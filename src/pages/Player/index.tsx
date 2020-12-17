import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

import Slider, { SliderRef } from '@react-native-community/slider'

import { AlbumCover, ArtistName, Container, IconContainer, SongTitle } from './styles';
import { useSongs } from '../../hooks/songs';
import { useState } from 'react';
import { useValue } from 'react-native-reanimated';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const { TrackPlayer, needToRefreshPauseButton, setNeedToRefreshPauseButton } = useSongs();
  let isUserSliding = false;
  
  useEffect(() => {
    if(needToRefreshPauseButton){
      setIsPlaying(needToRefreshPauseButton);
      setNeedToRefreshPauseButton(false);
    }    
  }, [needToRefreshPauseButton]);

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("dentro do interval, o isUserSliding esta com: ",isUserSliding.valueOf());
      if(!isUserSliding){
        setCurrentTrackPosition(await TrackPlayer.getPosition());
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const routeParams = route.params as RouteParams;

  const handlePauseSong = useCallback(async () => {
    TrackPlayer.pause();
    setIsPlaying(false);
  }, []);

  const handlePlaySong = useCallback(async () => {
    TrackPlayer.play();
    setIsPlaying(true);
  }, []);

  const handleSkipFoward = useCallback(async () => {
    TrackPlayer.skipToNext();
    setIsPlaying(true);
  }, []);

  const handleSkipBackwards = useCallback(async () => {
    TrackPlayer.skipToPrevious();
    setIsPlaying(true);
  }, []);

  const handleOnSlidingComplete = useCallback((value: number) => {
    isUserSliding = false;
    TrackPlayer.seekTo(value);
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
            {console.log("renderizado com :",currentTrackPosition)}
            <Slider 
              style={{
                width: 300,
                height: 40,
                marginTop: 30,
                marginBottom: 40,
              }}
              onSlidingStart={() => {isUserSliding = true}}
              onSlidingComplete={(value) => {handleOnSlidingComplete(value)}}
              value={currentTrackPosition}
              thumbTintColor="#e5e5e5"
              minimumValue={0}
              maximumValue={Number(routeParams.duration) / 1000}
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
