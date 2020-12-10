import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { useSongs } from '../../hooks/songs';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontisto from 'react-native-vector-icons/Fontisto';

import {ArtistName, Container, Content, Header, MenuButton, SongAlbumCover, SongContainer, SongInfo, SongName, Title, SongAlbumCoverPlaceHolder} from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stop } from 'react-native-track-player';
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
  const {songList, playSong} = useSongs();

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer()
  }, [navigation]);

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
        <MenuButton onPress={handleOpenDrawerMenu}>
          <IconFeather name="menu" size={25} color="#FFF"/>
        </MenuButton>
        <Title>Lista de Músicas</Title>
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
            </SongContainer>
          )}
        />
        </SafeAreaView>
      </Content>
    </Container>
  );
};

export default SongList;
