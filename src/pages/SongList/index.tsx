import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSongs } from '../../hooks/songs';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconIonicons from 'react-native-vector-icons/Ionicons';
// import IconEntypo from 'react-native-vector-icons/Entypo';

import {ArtistName, Container, Content, Header, SongAlbumCover, SongContainer, SongInfo, SongName, Title, SongAlbumCoverPlaceHolder} from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
// import PopupMenu from '../../components/PopupMenu';
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

interface SongListProps {
  navigation?: any;
}

const SongList: React.FC<SongListProps> = ({ navigation }) => {
  const {songList, playSong, changeShuffleValue, setNeedToRefreshShuffleButton} = useSongs();

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer()
  }, [navigation]);

  const handleIniciateShufflePlaylist = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * songList.length);
    playSong(songList[randomIndex]);
    changeShuffleValue(true);
    setNeedToRefreshShuffleButton(true);

    const {id, title, path, author, cover, duration, album} = songList[randomIndex];
    
    navigation.jumpTo('Player', {
      id,
      title,
      path,
      author,
      cover,
      duration,
      album,
    })
  }, [songList]);

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
        <IconFeather name="menu" size={25} color="#FFF" onPress={handleOpenDrawerMenu}/>
        <Title>Lista de Músicas</Title>
        <IconIonicons name="shuffle" size={25} color="#fff" onPress={handleIniciateShufflePlaylist}/>
      </Header>
      <Content>
        <SafeAreaView>
        <FlatList
          data={songList}
          maxToRenderPerBatch={100}
          keyExtractor={(song) => String(song.id)}
          getItemLayout={(_, index) => (
            { length: 70, offset: 70 * index, index }
          )}
          renderItem={({item: song}) => (
            <SongContainer key={song.id} onPress={() => {handlePlayMusic(song)}}>
              {song.cover 
                ? <SongAlbumCover source={{uri: `${song.cover}`}}/>
                : (
                  <SongAlbumCoverPlaceHolder>
                    <IconFontisto name="music-note" color="#fff" size={20}/>    
                  </SongAlbumCoverPlaceHolder>
                )
              }
              <SongInfo>
                <SongName>{song.title}</SongName>
                <ArtistName>{song.author}</ArtistName>
              </SongInfo>
              {/* <IconEntypo 
                name="dots-three-vertical" 
                size={20} 
                color="#bbb" 
                style={{position: 'absolute', right: 10}}
                onPress={() => {<PopupMenu />}}
              /> */}
            </SongContainer>
          )}
        />
        </SafeAreaView>
      </Content>
    </Container>
  );
};

export default SongList;
