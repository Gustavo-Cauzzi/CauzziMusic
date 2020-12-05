import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

import TrackPlayer from 'react-native-track-player';
import Slider from '@react-native-community/slider'

import { AlbumCover, ArtistName, Container, IconContainer, SongTitle } from './styles';

interface RouteParams{
  id: string;
  title: string;
  path: string;
  author: string;
  cover: string;
  duration: number;
  album: string;
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
              style={{
                width: 300,
                height: 40,
                marginTop: 30,
                marginBottom: 40,
              }}
              thumbTintColor="#e5e5e5"
              minimumValue={0}
              maximumValue={Number(routeParams.duration)}
              minimumTrackTintColor="#50F"
              maximumTrackTintColor="#AAA"
            />
            <IconContainer>
              <Icon name="skip-back" size={30} color="#fff" />
              <Icon name="pause" size={30} color="#fff" style={{marginRight: 20, marginLeft: 20}}/>
              <Icon name="skip-forward" size={30} color="#fff" />
            </IconContainer>
          </>
        )
        : <Text style={{color: "#fff"}}>sem musica</Text>
      }
    </Container>
  );
};

export default Player;
