import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { useSongs } from '../../hooks/songs';

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconEntypo from 'react-native-vector-icons/Entypo';

import { Container, Header, SearchBox, SearchBoxContainer, Title, Content, SongContainer, SongTriger, SongAlbumCover, SongAlbumCoverPlaceHolder, SongInfo, SongName, SongNameTicker, ArtistName, MenuContainer } from './styles';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

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

const screenWidth = Dimensions.get('window').width;

const SearchPage: React.FC<SearchPageProps> = ({ navigation }) => {
  const [currentSongList, setCurrentSongList] = useState<MusicFile[]>([]);
  const [isSearchBoxSelected, setIsSearchBoxSelected] = useState(false);

  const { songList, playSong, artistList } = useSongs();

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

  const handleGoToAlbum = useCallback((song: MusicFile) => {
    navigation.navigate('AlbumPage',{
      album: {
        name: song.album,
        cover: song.cover,
      },
      artist: song.author,
    })
  }, []);

  const handleGoToArtist = useCallback((song: MusicFile) => {
    const artist = artistList.find(a => a.artist == song.author);

    if(artist){
      const {numberOfAlbums, numberOfSongs, albums} = artist;

      navigation.jumpTo('ArtistPage', {
        albums,
        name: artist.artist,
        numberOfAlbums,
        numberOfSongs,
      });
    }else{
      console.log("Artist not found (songList - handleGoToArtist)")
    }

  }, [artistList]);


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
              }else{
                setCurrentSongList(songList.filter(song => song.title.toLowerCase().includes(newValue.toLowerCase())))
              }
            }}
          />
          <IconMaterialCommunityIcons name="magnify" size={25} color="#fff"/>
        </SearchBoxContainer>
        <FlatList
          data={currentSongList}
          keyExtractor={(item) => String(item.id)}
          renderItem={({item: song}) => (
            <SongContainer key={song.id}>
              <SongTriger onPress={() => {handlePlayMusic(song)}}>
                {song.cover 
                  ? <SongAlbumCover source={{uri: `${song.cover}`}}/>
                  : (
                    <SongAlbumCoverPlaceHolder>
                      <IconFontisto name="music-note" color="#fff" size={20}/>    
                    </SongAlbumCoverPlaceHolder>
                  )
                }
                <SongInfo>
                  {
                    song.title.length < 39
                      ? <SongName>{song.title}</SongName>
                      : (
                        <View
                          style={{width: screenWidth - 125}}
                        >
                          <SongNameTicker
                            duration={15000}
                            repeatSpacer={50}
                            marqueeDelay={1000}
                          >
                            {song.title}
                          </SongNameTicker>
                        </View>
                      )
                  }
                  <ArtistName>{song.author != '<unknown>' ? song.author : 'Desconhecido'}</ArtistName>
                </SongInfo>
              </SongTriger>
                <MenuContainer>
                  <Menu>
                    <MenuTrigger>
                      <IconEntypo 
                        name="dots-three-vertical" 
                        size={20} 
                        color="#bbb" 
                      />
                    </MenuTrigger>
                    <MenuOptions customStyles={{
                      optionsContainer: {
                        backgroundColor: '#151515',
                        width: 150,
                      },
                    }}>
                      <MenuOption onSelect={() => {handleGoToAlbum(song)}}>
                        <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
                          <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Album </Text>
                        </View>
                      </MenuOption>
                      <MenuOption onSelect={() => {handleGoToArtist(song)}}>
                      <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
                          <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Artista </Text>
                        </View>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </MenuContainer>
            </SongContainer>
          )}
        />
      </Content>
    </Container>
  );
};

export default SearchPage;
