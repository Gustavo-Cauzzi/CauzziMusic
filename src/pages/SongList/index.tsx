import React, { useCallback } from 'react';
import { FlatList, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useSongs } from '../../hooks/songs';
import Icon from 'react-native-vector-icons/Feather';

import {ArtistName, Container, Content, Header, MenuButton, SongAlbumCover, SongContainer, SongInfo, SongName, Title} from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
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
          <Icon name="menu" size={25} color="#FFF"/>
        </MenuButton>
        <Title>Lista de Músicas</Title>
      </Header>
      <Content>
        <SafeAreaView>
        <FlatList
          data = {songList}
          keyExtractor = {(song) => String(song.id)}
          renderItem = {({item: song}) => (
            <SongContainer key={song.id} onPress={() => {handlePlayMusic(song)}}>
              <SongAlbumCover source={{uri: `${song.cover}`}}/>
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
