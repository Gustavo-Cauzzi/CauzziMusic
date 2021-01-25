import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import NoCoverJpg from '../../../assets/50x50.jpg';

import { View } from 'react-native';

import { 
  AlbumContainer,
  AlbumCover,
  Container,
  CreatePlaylistButton,
  CreatePlaylistButtonText,
  Header,
  PlaylistContainer,
  PlaylistName,
  PlaylistNameContainer,
  PlaylistNameTicker,
  RemovePlaylistButton,
  RemovePlaylistText,
  Title,
} from './styles';
import { useSongs } from '../../hooks/songs';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import { useRoute } from '@react-navigation/native';

interface PlaylistListProps{
  navigation?: any;
}

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

interface Playlist{
  id: string;
  name: string;
  songs: MusicFile[];
  description: string;
}


interface RouteParams{
  selectionMode: boolean;
  songs?: MusicFile[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({navigation}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isRemovePlaylistMode, setIsRemovePlaylistMode] = useState(false);
  const [songsFromRoute, setSongsFromRoute] = useState<MusicFile[]>([]);

  const { playlists: playlistsFromStorage, addSongsToPlaylist, deletePlaylist } = useSongs();

  const route = useRoute();

  useEffect(() => {
    if (!route.params) return;
    const routeParams = route.params as RouteParams;

    if (routeParams.songs) setSongsFromRoute(routeParams.songs);

    setIsSelectionMode(routeParams.selectionMode);
  }, [route.params]);

  useEffect(() => {
    setPlaylists(playlistsFromStorage);
    if (isRemovePlaylistMode) setIsRemovePlaylistMode(false);
  }, [playlistsFromStorage]);

  const handleClosePress = useCallback(() => {
    if(isSelectionMode){
      navigation.goBack();
      setIsSelectionMode(false);
    }else{
      setIsRemovePlaylistMode(false);
    }
  }, [navigation]);

  const handlePlaylistPress = useCallback((playlist: Playlist) => {
    if(isSelectionMode){
      addSongsToPlaylist(songsFromRoute, playlist.id);
      navigation.goBack();
    }else if(isRemovePlaylistMode){
      deletePlaylist(playlist.id);
    }else{
      navigation.navigate('PlaylistPage', playlist);
    }
  }, [songsFromRoute, addSongsToPlaylist, deletePlaylist, isRemovePlaylistMode, isSelectionMode]);

  const handleCreatePlaylistPress = useCallback(() => {
    setIsModalActive(true);
    if (isSelectionMode) navigation.goBack();
  }, [isSelectionMode ]);

  return (
    <Container>
      <CreatePlaylistModal active={isModalActive} onClose={() => {setIsModalActive(false)}} songs={songsFromRoute ? songsFromRoute : undefined}/>
      <Header>
        {isSelectionMode || isRemovePlaylistMode
          ? (
            <View style={{width: 25}}/>
          )
          : (
          <IconFeather 
            name="menu" 
            size={25} 
            color="#FFF" 
            onPress={() => {navigation.openDrawer()}} 
          />
          )
        }
        
        {isSelectionMode ? (<Title>Escolha a Playlist</Title>) : isRemovePlaylistMode ? (<Title>Remover Playlist</Title>) : (<Title>Suas Playlists</Title>)}
        {isSelectionMode || isRemovePlaylistMode
          ? <IconMaterialCommunityIcons 
              name="close" 
              size={25} 
              color="#fff" 
              onPress={handleClosePress}
            />
          : <IconFeather 
              name="plus" 
              size={25} 
              color="#FFF" 
              onPress={() => {setIsModalActive(true)}} 
            />
        }
      </Header>
      <FlatList 
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListFooterComponentStyle={{marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}
        contentContainerStyle={{paddingTop: 30, paddingHorizontal: 10}}
        ListFooterComponent={() => (
          <>
            {
              isRemovePlaylistMode
                ? null
                : (
                  <>
                    <CreatePlaylistButton onPress={handleCreatePlaylistPress}>
                      <CreatePlaylistButtonText>
                        + Criar playlist
                      </CreatePlaylistButtonText>
                    </CreatePlaylistButton>
                    {
                      !isSelectionMode
                        ? (
                          <RemovePlaylistButton onPress={() => {setIsRemovePlaylistMode(true)}}>
                            <IconIonicons name="trash-outline" size={12} color="#c53030"/>
                            <RemovePlaylistText>
                              Excluir Playlist
                            </RemovePlaylistText>
                          </RemovePlaylistButton>
                        )
                        : null
                    }
                  </>
                )
            }
          </>
        )}
        renderItem={({item: playlist}) => (
          <PlaylistContainer onPress={() => {handlePlaylistPress(playlist)}}>
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
            {
              isRemovePlaylistMode
                ? (
                  <AlbumContainer style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', width: 150}}>
                    <View style={{width: 50, height: 50, backgroundColor: "#9c2626", borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
                      <IconIonicons name="trash-outline" size={30} color="#fff"/>
                    </View>
                  </AlbumContainer>
                )
                : null
            }
            <PlaylistNameContainer>
              {
                playlist.name.length > 14
                  ? (
                    <PlaylistNameTicker
                      duration={5000}
                      repeatSpacer={50}
                      marqueeDelay={1000}              
                    >
                      {playlist.name}
                    </PlaylistNameTicker>
                  )
                  :(
                    <PlaylistName>{playlist.name}</PlaylistName>
                  )
              }
            </PlaylistNameContainer>
          </PlaylistContainer>
        )}
      />
    </Container>
  );
};

export default PlaylistList;
