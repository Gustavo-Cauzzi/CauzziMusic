import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Container,
  Content,
  Header,
  Title,
  ShuffleButton,
  ShuffleIconContainer,
  ShuffleText,
} from './styles';
import Song from '../../components/Song';
import { useSongs } from '../../hooks/songs';

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

  const handleNavigateToSearchPage = useCallback(() => {
    navigation.navigate('SearchPage');
  }, []);

  return (
    <Container>
      <Header>
        <IconFeather name="menu" size={25} color="#FFF" onPress={handleOpenDrawerMenu}/>
        <Title>Lista de Músicas</Title>
        <IconMaterialCommunityIcons name="magnify" size={25} color="#fff" onPress={handleNavigateToSearchPage}/>
      </Header>
      <Content>
        <SafeAreaView>
        <FlatList
          data={songList}
          maxToRenderPerBatch={30}
          keyExtractor={(song) => String(song.id)}
          getItemLayout={(_, index) => (
            { length: 70, offset: 70 * index + 1, index }
          )}
          ListHeaderComponent={() => (
            <ShuffleButton onPress={handleIniciateShufflePlaylist}>
              <ShuffleIconContainer>
                <IconIonicons name="shuffle" size={27.5} color="#fff"/>
              </ShuffleIconContainer>
              <ShuffleText>Aleatório</ShuffleText>
            </ShuffleButton>
          )}
          renderItem={({item: song}) => (
            <Song 
              song={song}
              onPress={() => {
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
              }}
            />
          )}
        />
        </SafeAreaView>
      </Content>
    </Container>
  );
};

export default SongList;
