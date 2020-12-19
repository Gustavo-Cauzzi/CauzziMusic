import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import TextTicker from 'react-native-text-ticker';

import Slider from '@react-native-community/slider'

import { AlbumCover, ArtistName, Container, CurrentSongPostition, IconContainer, SongDuration, SongTitle, SongTitleContainer, TimeContainer } from './styles';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const [currentSongDurantion, setCurrentSongDurantion] = useState('0:00');
  const [currentTimeStamp, setCurrentTimeStamp] = useState('0:00');

  const { TrackPlayer, needToRefreshPauseButton, setNeedToRefreshPauseButton } = useSongs();
  let isUserSliding = false;
  const maxSongTitleLenght = 20;

  const routeParams = route.params as RouteParams;
  
  useEffect(() => {
    if(needToRefreshPauseButton){
      setIsPlaying(needToRefreshPauseButton);
      setNeedToRefreshPauseButton(false);
    }    
  }, [needToRefreshPauseButton]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if(!isUserSliding){
        const position = await TrackPlayer.getPosition();
        setCurrentTrackPosition(position);
        const parsedPosition = handleGetCurrentPosition(position);
        setCurrentTimeStamp(parsedPosition);
        const currentTrackDuration = await TrackPlayer.getDuration();
        const parsedCurrentTrackPosition = handleGetCurrentPosition(currentTrackDuration)
        setCurrentSongDurantion(parsedCurrentTrackPosition);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
    const currentPosition = await TrackPlayer.getPosition();
    if(currentPosition <= 5){
      const track = await TrackPlayer.getCurrentTrack();
      const queue = await TrackPlayer.getQueue();
      if(queue[0].id !== track){
        await TrackPlayer.skipToPrevious();
      }else{
        await TrackPlayer.seekTo(0);
      }
    }else{
      await TrackPlayer.seekTo(0);
    }
    setIsPlaying(true);
  }, []);

  const handleOnSlidingComplete = useCallback((value: number) => {
    isUserSliding = false;
    TrackPlayer.seekTo(value);
  }, []);

  const handleGetCurrentPosition = useCallback((value: number): string => {
    const minutes = Math.floor(value / 60);
    const seconds = (Math.floor(value - 60 * minutes)).toString().padStart(2, '0');
    return `${minutes}:${seconds}`
  }, []);

  return (
    <Container>
      {routeParams
        ?
        (
          <>
            <AlbumCover source={{uri: routeParams.cover}}/>
            <SongTitleContainer>
              <SongTitle
                duration={15000}
                repeatSpacer={50}
                marqueeDelay={1000}
              > 
                {routeParams.title}
              </SongTitle>
            </SongTitleContainer>
            <ArtistName> {routeParams.author} </ArtistName>
            <TimeContainer>
              <CurrentSongPostition>{currentTimeStamp}</CurrentSongPostition>
              <SongDuration>{currentSongDurantion}</SongDuration>
            </TimeContainer>
            <Slider 
              style={{
                width: 300,
                height: 40,
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
        : <Text style={{color: "#fff"}}>sem música</Text>
      }
    </Container>
  );
};

export default Player;
