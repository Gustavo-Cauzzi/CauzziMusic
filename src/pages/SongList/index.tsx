import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Animated, Easing, TouchableNativeFeedback, StyleSheet, View } from 'react-native';
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
  FloatingEditContainer,
  FloatingMenuContainer,
  LoadingCoversTest,
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

const HEADER_HEIGHT = 50;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList as new () => FlatList<MusicFile>);

const SongList: React.FC<SongListProps> = ({ navigation }) => {
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [editAnimationCompensation, setEditAnimationCompensation] = useState(false);
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
  const animatedXEditContainer = useRef(new Animated.Value(70)).current;
  
  const scroll = new Animated.Value(0);
  const animatedScroll = Animated.multiply(Animated.diffClamp(scroll, 0, HEADER_HEIGHT), -1);
  
  useEffect(() => {
    Animated.timing(animatedLoadingMarginTop, {
      toValue: isLoadingAlbumCovers ? 50 : 30,
      easing: Easing.inOut(Easing.ease),
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isLoadingAlbumCovers]);

  useEffect(() => {
    if(isEditModeActive){
      setEditAnimationCompensation(true);
    }
    Animated.timing(animatedXEditContainer, {
      toValue: isEditModeActive ? 0 : 70,
      easing: Easing.inOut(Easing.ease),
      duration: 300,
      useNativeDriver: true,
    }).start(() => {() => {
      setEditAnimationCompensation(false);
    }});
  }, [isEditModeActive]);

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
      {
        (isEditModeActive || editAnimationCompensation) &&
        <FloatingEditContainer as={Animated.View} style={[{transform: [{translateY: animatedScroll}, {translateX: animatedXEditContainer}]}]}>
          <FloatingMenuContainer>
            <MenuPopup 
              songs={songsSelected} 
              navigation={navigation} 
              onOptionSelected={() => {
                setIsEditModeActive(false);
                setSongsSelected([]);
              }}
            >
              <IconEntypo 
                name="dots-three-vertical" 
                size={20} 
                color="#fff" 
              />
            </MenuPopup>
          </FloatingMenuContainer>
          <FloatingMenuContainer>
            <TouchableNativeFeedback 
              style={{flex: 1, width: 40, alignItems: 'center', justifyContent: 'center'}}
              onPress={() => {
                setIsEditModeActive(false);
                setSongsSelected([]);
              }}
            >
              <IconMaterialCommunityIcons 
                name="close" 
                size={25} 
                color="#fff" 
              />
            </TouchableNativeFeedback>
          </FloatingMenuContainer>
        </FloatingEditContainer>
      }

      <Header as={Animated.View} style={[{transform: [{ translateY: animatedScroll }]}]}>
        <IconFeather name="menu" size={20} color="#FFF" onPress={handleOpenDrawerMenu}/>
        <Title>Lista de Músicas</Title>
        <IconMaterialCommunityIcons name="magnify" size={25} color="#fff" onPress={handleNavigateToSearchPage}/>
      </Header>
      <Animated.View style={[
        styles.loadingCoversContainer, 
        {transform: [{translateY: Animated.add(animatedLoadingMarginTop,animatedScroll)}]} 
      ]}>
        <LoadingCoversTest>
          Carregando covers...
        </LoadingCoversTest>
      </Animated.View>
      <Content>
        <SafeAreaView>
          <AnimatedFlatList
            data={hideFilteredSongs ? filteredSongList : songList}
            keyExtractor={(song) => String(song.id)}
            getItemLayout={(_, index) => (
              { length: 60, offset: (60 * index) + 125, index }
            )}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scroll}}}],
              {useNativeDriver: true},
            )}
            ListHeaderComponent={() => (
              <>
                <View style={styles.animatedHeaderCompensation}/>
                <ShuffleContainer>
                  <ShuffleButton onPress={handleIniciateShufflePlaylist}>
                    <ShuffleIconContainer>
                      <IconIonicons name="shuffle" size={23} color="#fff"/>
                    </ShuffleIconContainer>
                    <ShuffleText>Aleatório</ShuffleText>
                  </ShuffleButton>
                </ShuffleContainer>
              </>
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

const styles = StyleSheet.create({
  animatedHeader:{
    position: 'absolute',
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: '#50f',
    borderBottomWidth: 2,
    width: screenWidth,
    height: 50,
    zIndex: 10,
    elevation: 10,
  },
  loadingCoversContainer: {
    position: 'absolute', 
    height: 17, 
    width: screenWidth, 
    zIndex: 5, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#5ba35b', 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20
  },
  animatedHeaderCompensation: {
    width: screenWidth,
    height: 50 + 5, //header plus a little bit more (for a margin)
  }
});

export default SongList;