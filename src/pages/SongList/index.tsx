import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';

import {
  Container,
  Content,
  Header,
  Title,
  ShuffleButton,
  ShuffleIconContainer,
  ShuffleText,
  ShuffleContainer,
  SongSelectedContainer,
} from './styles';
import Song from '../../components/Song';
import { useSongs } from '../../hooks/songs';
import MenuPopup from '../../components/MenuPopup';
interface SongListProps {
  navigation?: any;
}

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

const screenWidth = Dimensions.get('screen').width;

const SongList: React.FC<SongListProps> = ({ navigation }) => {
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [songsSelected, setSongsSelected] = useState<MusicFile[]>([]);

  const {
    songList,
    playSong,
    changeShuffleValue,
    setNeedToRefreshShuffleButton,
    isLoadingAlbumCovers,
    hideFilteredSongs,
    filteredSongList,
  } = useSongs();
  
  const animatedLoadingMarginTop = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    if(isLoadingAlbumCovers){
      Animated.timing(animatedLoadingMarginTop, {
        toValue: 50,
        easing: Easing.inOut(Easing.ease),
        duration: 500,
        useNativeDriver: true,
      }).start();
    }else{
      Animated.timing(animatedLoadingMarginTop, {
        toValue: 30,
        easing: Easing.inOut(Easing.ease),
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoadingAlbumCovers]);

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer()
  }, [navigation]);

  const handleIniciateShufflePlaylist = useCallback(() => {
    if (isEditModeActive) return;
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
        <IconFeather name="menu" size={20} color="#FFF" onPress={handleOpenDrawerMenu}/>
        <Title>Lista de Músicas</Title>
        {isEditModeActive 
          ? (
            <View style={{flexDirection: 'row', width: 60, justifyContent: 'space-between'}}>
              <IconMaterialCommunityIcons 
                name="close" 
                size={25} 
                color="#fff" 
                onPress={() => {
                  setIsEditModeActive(false);
                  setSongsSelected([] as MusicFile[]);
                }}
              />
              <MenuPopup songs={songsSelected} navigation={navigation}>
                <IconEntypo 
                  name="dots-three-vertical" 
                  size={20} 
                  color="#fff" 
                />
              </MenuPopup>
            </View>
          ) 
          : <IconMaterialCommunityIcons name="magnify" size={25} color="#fff" onPress={handleNavigateToSearchPage}/>
        }
      </Header>
      <Animated.View style={[{
        position: 'absolute', 
        height: 17, 
        width: screenWidth, 
        zIndex: 5, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#5ba35b', 
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20}, 
        {transform: [{translateY: animatedLoadingMarginTop}]}
      ]}>
        <Text style={{color: '#fff', fontSize: 12}}>
          Carregando covers...
        </Text>
      </Animated.View>
      <Content>
        <SafeAreaView>
          <FlatList
            data={hideFilteredSongs ? filteredSongList : songList}
            keyExtractor={(song) => String(song.id)}
            getItemLayout={(_, index) => (
              { length: 60, offset: (60 * index) + 70, index }
            )}
            ListHeaderComponent={() => (
              <ShuffleContainer>
                <ShuffleButton onPress={handleIniciateShufflePlaylist}>
                  <ShuffleIconContainer>
                    <IconIonicons name="shuffle" size={25} color="#fff"/>
                  </ShuffleIconContainer>
                  <ShuffleText>Aleatório</ShuffleText>
                </ShuffleButton>
              </ShuffleContainer>
            )}
            renderItem={({item: song}) => (
              <SongSelectedContainer isSelected={songsSelected.findIndex(s => s.id == song.id) != -1}>
                <Song 
                  song={song}
                  navigation={navigation}
                  onPress={() => {
                    if(isEditModeActive){
                      setSongsSelected(currentSelectedSongs => {
                        const index = currentSelectedSongs.findIndex(s => s.id == song.id);
                        if(index != -1){
                          if (currentSelectedSongs.length == 1) setIsEditModeActive(false);
                          return currentSelectedSongs.filter(s => s.id != song.id);
                        }else{
                          return [...currentSelectedSongs, song]
                        }
                      });
                    }else{
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
                      });
                    }
                  }}
                  onLongPress={() => {
                    if (!isEditModeActive) setIsEditModeActive(true);
                    setSongsSelected(currentSelectedSongs => {
                      const index = currentSelectedSongs.findIndex(s => s.id == song.id);
                      if(index != -1){
                        if (currentSelectedSongs.length == 1) setIsEditModeActive(false);
                        return currentSelectedSongs.filter(s => s.id != song.id);
                      }else{
                        return [...currentSelectedSongs, song]
                      }
                    })
                  }}
                  />
                </SongSelectedContainer>
              )}
            />
        </SafeAreaView>
      </Content>
    </Container>
  );
};

export default SongList;
