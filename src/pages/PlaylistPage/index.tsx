import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import NoCoverJpg from '../../../assets/50x50.jpg';
import Song from '../../components/Song';
import { useSongs } from '../../hooks/songs';

import { AlbumContainer, Container, InfoContainer, AlbumCover, PlaylistTitle, EmptyPlaylistText } from './styles';

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

interface Playlist{
  id: number;
  name: string;
  songs: MusicFile[];
}

interface PlaylistPageProps{
  navigation?: any;
}

const PlaylistPage: React.FC<PlaylistPageProps> = ({navigation}) => {
  const [playlist, setPlaylist] = useState<Playlist>({id: -1, name: '', songs: []});
  const [randomAlbums, setRandomAlbums] = useState<(String | undefined)[]>([]);

  const route = useRoute();
  
  const { playSong } = useSongs();

  useEffect(() => {
    let routeParams = route.params as Playlist;
    setPlaylist(routeParams);

    if(routeParams.songs.length < 4){
      let randomAlbumsToAdd: (String | undefined)[] = [];
      for(let i = 0; i <= 3 ; i++){
        if(routeParams.songs[i] != undefined){
          randomAlbumsToAdd.push(routeParams.songs[i].cover);
        }else{
          randomAlbumsToAdd.push(undefined);
        }
      }

      setRandomAlbums(randomAlbumsToAdd);
    }else{
      let albumsAlreadyAdded: number[] = [];

      while(albumsAlreadyAdded.length < 4){
        const randomIndex = Math.floor(Math.random() * routeParams.songs.length);
        if(!albumsAlreadyAdded.includes(randomIndex)){
          albumsAlreadyAdded.push(randomIndex);
        }
      }

      const covers = albumsAlreadyAdded.map(index => routeParams.songs[index].cover);

      setRandomAlbums(covers);
    }
  }, [route.params]);

  const handleSongPress = useCallback((song: MusicFile) => {
    playSong(song, playlist.songs);    

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
  }, []);

  return (
    <Container>
      <FlatList
        data={playlist.songs}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={() => (
          <View style={{flex: 1, height: 30, alignItems: 'center', justifyContent: 'center'}}>
            <EmptyPlaylistText>
              Esta playlist está vazia! 🙁
            </EmptyPlaylistText>
          </View>
        )}
        ListHeaderComponent={() => (
          <InfoContainer>
            <AlbumContainer>
              <View style={{height: 75, width: 150, flexDirection: 'row'}}>
                <AlbumCover source={randomAlbums[0] == undefined ? NoCoverJpg : {uri: randomAlbums[0]}}/>
                <AlbumCover source={randomAlbums[1] == undefined ? NoCoverJpg : {uri: randomAlbums[1]}}/>
              </View>
              <View style={{height: 75, width: 150, flexDirection: 'row'}}>
                <AlbumCover source={randomAlbums[2] == undefined ? NoCoverJpg : {uri: randomAlbums[2]}}/>
                <AlbumCover source={randomAlbums[3] == undefined ? NoCoverJpg : {uri: randomAlbums[3]}}/>
              </View>
            </AlbumContainer>
            <PlaylistTitle>
              {playlist.name}
            </PlaylistTitle>
          </InfoContainer>
        )}
        renderItem={({item: song}) => (
          <Song song={song} onPress={() => {handleSongPress(song)}} onLongPress={() => {}} navigation={navigation}/>
        )}
      />
    </Container>
  );
};

export default PlaylistPage;
