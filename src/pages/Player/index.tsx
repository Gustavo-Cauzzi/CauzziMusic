import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

import TrackPlayer from 'react-native-track-player';
import Slider from '@react-native-community/slider'

import { AlbumCover, ArtistName, Container, SongTitle } from './styles';

interface RouteParams{
  id: string;
  title: string;
  path: string;
  author: string;
  cover: string;
}

const Player: React.FC = () => {

  const route = useRoute();

  const routeParams = route.params as RouteParams;

  return (
    <Container>
      {routeParams
        ? 
        (
          <>
            <AlbumCover source={{uri: routeParams.cover}}/>
            <SongTitle> {routeParams.title} </SongTitle>
            <ArtistName> {routeParams.author} </ArtistName>
            <Slider 
              style={{width: 200, height: 40}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          </>
        )
        : <Text style={{color: "#fff"}}>sem musica</Text>
      }
    </Container>
  );
};

export default Player;
