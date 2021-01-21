import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useSongs } from '../../hooks/songs';

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { 
  Container, 
  Header, 
  SearchBox, 
  SearchBoxContainer, 
  Title, 
  Content, 
  SwitchContainer 
} from './styles';
import Switch from '../../components/Switch';
import Artist from '../../components/Artist';
import Song from '../../components/Song';

interface MusicFile{
  id : number,
  title : string,
  author : string,
  album : string,
  genre : string,
  duration : number, // miliseconds
  cover :string,
  blur : string, //Will come null if createBLur is set to false
  path : string
}

interface SearchPageProps {
  navigation?: any
}

interface Album {
  album: string | undefined;
  cover: string | undefined;
}
interface Artist {
  albums: Album[];
  artist: string;
  numberOfAlbums: number;
  numberOfSongs: number;
}

const SearchPage: React.FC<SearchPageProps> = ({ navigation }) => {
  const [currentSongList, setCurrentSongList] = useState<MusicFile[]>([]);
  const [currentArtistList, setCurrentArtistList] = useState<Artist[]>([]);
  const [isSearchBoxSelected, setIsSearchBoxSelected] = useState(false);
  const [searchSongsOrArtist, setSearchSongsOrArtist] = useState<'Songs' | 'Artists'>('Songs');

  const { songList, playSong, artistList, deleteSong } = useSongs();

  const handlePlayMusic = useCallback((song: MusicFile) => {
    playSong(song);    

    const {id, title, path, author, cover, duration, album} = song;
    
    navigation.jumpTo('Player', {
      id,
      title,
      path,
      author,
      cover,
      duration,
      album,
    })
  }, []);

  return (
    <Container>
      <Header>
        <Title>Buscar Músicas</Title>
      </Header>
      <Content>
        <SearchBoxContainer
          isActive={isSearchBoxSelected}
        >
          <SearchBox 
            autoCorrect={false}          
            onFocus={() => {setIsSearchBoxSelected(true)}}  
            onBlur={() => {setIsSearchBoxSelected(false)}}  
            onChangeText={(newValue) => {
              if(newValue == ''){
                setCurrentSongList([]);
                setCurrentArtistList([]);
              }else{
                setCurrentSongList(songList.filter(song => song.title.toLowerCase().includes(newValue.toLowerCase())))
                setCurrentArtistList(artistList.filter(artist => artist.artist.toLowerCase().includes(newValue.toLowerCase())))
              }
            }}
          />
          <IconMaterialCommunityIcons name="magnify" size={25} color="#fff"/>
        </SearchBoxContainer>

        <SwitchContainer>
          <Switch 
            options={['Músicas','Artistas']} 
            onChange={() => {setSearchSongsOrArtist(oldValue => oldValue == 'Songs' ? 'Artists' : 'Songs')}}
          />
        </SwitchContainer>

        {
          searchSongsOrArtist == 'Songs'
            ? (
              <FlatList
                data={currentSongList}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item: song}) => (
                  <Song 
                    deleteSong={deleteSong}
                    artistList={artistList}
                    song={song} 
                    onPress={() => handlePlayMusic(song)}
                  />
                )}
              />
            )
            :(
              <FlatList
                data={currentArtistList}
                keyExtractor={(_, i) => String(i)}
                contentContainerStyle={{paddingTop: 10}}
                renderItem={({item: currentArtist}) => (
                  <Artist 
                    artist={currentArtist}
                    onPress={() => {
                      const {numberOfAlbums, numberOfSongs, albums} = currentArtist;

                      navigation.jumpTo('ArtistPage', {
                        albums,
                        name: currentArtist.artist,
                        numberOfAlbums,
                        numberOfSongs,
                      })
                    }}
                  />
                )}
              />
            )
        }
      </Content>
    </Container>
  );
};

export default SearchPage;
