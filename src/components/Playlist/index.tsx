import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import NoCoverJpg from '../../../assets/50x50.jpg';

import { AlbumContainer, AlbumCover, Container, PlaylistName, PlaylistNameContainer, PlaylistNameTicker } from './styles';

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

interface PlaylistProps{
  playlist: Playlist;
  navigation?: any;
}

const Playlist: React.FC<PlaylistProps> = ({playlist, navigation}) => {
  const [fourCovers, setFourCovers] = useState<(String | undefined)[]>([]);

  useEffect(() => {
    let covers: (String | undefined)[] = [];
    for(let i = 0; i <= 3; i++){
      if (playlist.songs[i] == undefined){
        covers.push(undefined);
      }else{
        covers.push(playlist.songs[i].cover);
      }
    }
    setFourCovers(covers);
  }, [playlist]);

  return (
    <Container onPress={() => {
      navigation.navigate('PlaylistPage', playlist)
    }}>
      <AlbumContainer>
        <View style={{height: 50, width: 100, flexDirection: 'row'}}>
          <AlbumCover source={fourCovers[0] == undefined ? NoCoverJpg : {uri: fourCovers[0]}}/>
          <AlbumCover source={fourCovers[1] == undefined ? NoCoverJpg : {uri: fourCovers[1]}}/>
        </View>
        <View style={{height: 50, width: 100, flexDirection: 'row'}}>
          <AlbumCover source={fourCovers[2] == undefined ? NoCoverJpg : {uri: fourCovers[2]}}/>
          <AlbumCover source={fourCovers[3] == undefined ? NoCoverJpg : {uri: fourCovers[3]}}/>
        </View>
      </AlbumContainer>
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
    </Container>
  );
};

export default Playlist;
