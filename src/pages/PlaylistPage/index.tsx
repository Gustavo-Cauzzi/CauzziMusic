import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, View } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';

import NoCoverJpg from '../../../assets/50x50.jpg';
import MenuPopup from '../../components/MenuPopup';
import Song from '../../components/Song';
import { useSongs } from '../../hooks/songs';

import { AlbumContainer, FloatingContainer, Container, InfoContainer, AlbumCover, PlaylistTitle, EmptyPlaylistText, FloatingMenuContainer, SongSelectedContainer, PlaylistInfo, PlaylistDetails } from './styles';

interface MusicFile{
  id : number,
  title : string,
  author : string,
  album : string,
  genre : string,
  duration : number, 
  cover :string,
  blur : string,
  path : string
}

interface MusicFileIndex{
  index: number;
  id : number,
  title : string,
  author : string,
  album : string,
  genre : string,
  duration : number, 
  cover :string,
  blur : string,
  path : string
}

interface Playlist{
  id: string;
  name: string;
  songs: MusicFile[];
  description: string;
}

interface PlaylistPageProps{
  navigation?: any;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList as new () => FlatList<MusicFile>);

const PlaylistPage: React.FC<PlaylistPageProps> = ({navigation}) => {
  const [playlist, setPlaylist] = useState<Playlist>({id: '', name: '', songs: [], description: ''});
  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(false);
  const [songsSelected, setSongsSelected] = useState<MusicFileIndex[]>([]);
  const [editAnimationCompensation, setEditAnimationCompensation] = useState(false);

  const animatedXEditContainer = useRef(new Animated.Value(70)).current;
  const animatedFlatlistScrollValue = useRef(new Animated.Value(0)).current;

  const route = useRoute();
  
  const { playSong, playlists } = useSongs();

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
  
  useEffect(() => {
    if (playlist.id == '') return;
    const currentPlaylist = playlists.find(p => p.id == playlist.id);

    if (!currentPlaylist){
      setPlaylist({id: '', name: '', songs: [] as MusicFile[], description: ''});
      setSongsSelected([]);
      return;
    } 

    setPlaylist(currentPlaylist);
  }, [playlists]);

  useEffect(() => {
    setPlaylist(route.params as Playlist);
  }, [route.params]);

  const handleSongPress = useCallback((song: MusicFile, index: number) => {
    if(isEditModeActive){
      if (!isEditModeActive) setIsEditModeActive(true);
      setSongsSelected(currentSelectedSongs => {
        const i = currentSelectedSongs.findIndex(s => s.index == index);
        if(i != -1){
          if (currentSelectedSongs.length == 1) setIsEditModeActive(false);
          return currentSelectedSongs.filter(s => s.index != index);
        }else{
          return [...currentSelectedSongs, {...song, index}]
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
  }, [isEditModeActive]);

  const handleSongLongPress = useCallback((song: MusicFile, index: number) => {
    if (!isEditModeActive) setIsEditModeActive(true);
    setSongsSelected(currentSelectedSongs => {
      const i = currentSelectedSongs.findIndex(s => s.index == index);
      if(i != -1){
        if (currentSelectedSongs.length == 1) setIsEditModeActive(false);
        return currentSelectedSongs.filter(s => s.index != index);
      }else{
        return [...currentSelectedSongs, {...song, index}]
      }
    })
  }, [isEditModeActive]);

  return (
    <Container>
      <Animated.View 
        style={[
          {position: 'absolute', left: 20, top: 20}, 
          {opacity: animatedFlatlistScrollValue.interpolate({
            inputRange: [0, 150],
            outputRange: [1 , 0]
          })}
        ]}
      >
        <TouchableNativeFeedback onPress={() => {navigation.openDrawer()}}>
          <IconFeather 
            name="menu" 
            size={25} 
            color="#FFF" 
          />
        </TouchableNativeFeedback>
      </Animated.View>
      {
        (isEditModeActive || editAnimationCompensation) &&
        <FloatingContainer as={Animated.View} style={[{transform: [{translateX: animatedXEditContainer}]}]}>
          <FloatingMenuContainer>
            <MenuPopup 
              songs={songsSelected} 
              navigation={navigation} 
              removeFromPlaylistId={playlist.id} 
              onOptionSelected={() => {setIsEditModeActive(false)}}
            >
              <IconEntypo 
                name="dots-three-vertical" 
                size={20} 
                color="#fff" 
              />
            </MenuPopup>
          </FloatingMenuContainer>
          <FloatingMenuContainer>
            <TouchableNativeFeedback style={{flex: 1, width: 40, alignItems: 'center', justifyContent: 'center'}}>
              <IconMaterialCommunityIcons 
                name="close" 
                size={25} 
                color="#fff" 
              />
            </TouchableNativeFeedback>
          </FloatingMenuContainer>
        </FloatingContainer>
      }
      <AnimatedFlatList
        data={playlist.songs}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{paddingHorizontal: 5}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: animatedFlatlistScrollValue}}}],
          {useNativeDriver: true},
        )}
        ListHeaderComponent={() => (
          <InfoContainer
            as={Animated.View} 
            style={[{
              transform: [
                {
                  translateY: animatedFlatlistScrollValue.interpolate({
                    inputRange: [0, 150],
                    outputRange: [0 , 100]
                  })
                }, 
                {
                  scale: animatedFlatlistScrollValue.interpolate({
                    inputRange: [0, 400],
                    outputRange: [1 , 0]
                  })
                },
              ],
              opacity: animatedFlatlistScrollValue.interpolate({
                inputRange: [0, 175],
                outputRange: [1 , 0]
              })
            }]}
          >
            <AlbumContainer>
              <View style={{height: 75, width: 150, flexDirection: 'row'}}>
                <AlbumCover source={playlist.songs[0] == undefined ? NoCoverJpg : {uri: playlist.songs[0].cover}}/>
                <AlbumCover source={playlist.songs[1] == undefined ? NoCoverJpg : {uri: playlist.songs[1].cover}}/>
              </View>
              <View style={{height: 75, width: 150, flexDirection: 'row'}}>
                <AlbumCover source={playlist.songs[2] == undefined ? NoCoverJpg : {uri: playlist.songs[2].cover}}/>
                <AlbumCover source={playlist.songs[3] == undefined ? NoCoverJpg : {uri: playlist.songs[3].cover}}/>
              </View>
            </AlbumContainer>
            <PlaylistInfo>
              <PlaylistTitle>
                {playlist.name}
              </PlaylistTitle>
              <PlaylistDetails>
                {playlist.description}
              </PlaylistDetails>
            </PlaylistInfo>
          </InfoContainer>
        )}
        ListEmptyComponent={() => (
          <View style={{flex: 1, height: 30, alignItems: 'center', justifyContent: 'center'}}>
            <EmptyPlaylistText>
              Esta playlist está vazia! 🙁
            </EmptyPlaylistText>
          </View>
        )}
        renderItem={({item: song, index}) => (
          <SongSelectedContainer isSelected={songsSelected.findIndex(s => s.index == index) != -1}>
            <Song 
              song={song} 
              onPress={() => {handleSongPress(song, index)}} 
              onLongPress={() => {handleSongLongPress(song,index)}} 
              navigation={navigation}
            />
          </SongSelectedContainer>
        )}
      />
    </Container>
  );
};

export default PlaylistPage;
