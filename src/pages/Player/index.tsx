import { useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

import Slider from '@react-native-community/slider'

import { AlbumCover, ArtistName, Container, IconContainer, SongTitle } from './styles';
import { useSongs } from '../../hooks/songs';
import { useState } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(true)
  const { TrackPlayer } = useSongs();

  const routeParams = route.params as RouteParams;

  const handlePauseSong = useCallback(() => {
    TrackPlayer.pause();
    setIsPlaying(false);
  }, []);

  const handlePlaySong = useCallback(() => {
    TrackPlayer.play();
    setIsPlaying(true);
  }, []);

  const handleSkipFoward = useCallback(() => {
    TrackPlayer.skipToNext();
    setIsPlaying(true);
  }, []);

  const handleSkipBackwards = useCallback(() => {
    TrackPlayer.skipToPrevious();
    setIsPlaying(true);
  }, []);

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
              <Icon name="skip-back" size={40} color="#fff" onPress={handleSkipBackwards}/>

              {isPlaying 
                ? <Icon name="pause" size={40} color="#fff" style={{marginRight: 55, marginLeft: 55}} onPress={handlePauseSong}/>
                : <Icon name="play" size={40} color="#fff" style={{marginRight: 55, marginLeft: 55}} onPress={handlePlaySong}/>
              }

              <Icon name="skip-forward" size={40} color="#fff" onPress={handleSkipFoward}/>
            </IconContainer>
          </>
        )
        : <Text style={{color: "#fff"}}>sem musica</Text>
      }
    </Container>
  );
};

export default Player;
