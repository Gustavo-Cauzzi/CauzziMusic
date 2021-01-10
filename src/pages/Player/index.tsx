import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import IconFeather from 'react-native-vector-icons/Feather'
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconIonicons from 'react-native-vector-icons/Ionicons'

import Slider from '@react-native-community/slider'

import { 
  AlbumCover, 
  ArtistName, 
  Container, 
  CurrentSongPostition, 
  IconContainer, 
  SongDuration, 
  SongTitleTicker, 
  SongTitleContainer, 
  TimeContainer, 
  SongTitle, 
  IconFooter 
} from './styles';
import { useSongs } from '../../hooks/songs';
import { useState } from 'react';
import { EmptyAlbumCover, EmptyTimeContainer } from './emptyPlayerStyles';
// import { addEventListener } from 'react-native-track-player';
interface RouteParams{
  id: string;
  title: string;
  path: string;
  author: string;
  cover: string;
  duration: number;
  album: string;
}

interface MusicFile{
  id : number,
  title : string,
  author : string,
  album : string,
  duration : number, // miliseconds
  cover :string,
  path : string
}

const Player: React.FC = () => {
  const route = useRoute();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const [currentSongDurantion, setCurrentSongDurantion] = useState('0:00');
  const [currentTimeStamp, setCurrentTimeStamp] = useState('0:00');
  const [currentTrack, setCurrentTrack] = useState<MusicFile>();

  const { 
    TrackPlayer, 
    needToRefreshPauseButton, 
    setNeedToRefreshPauseButton, 
    songList, 
    changeShuffleValue, 
    needToRefreshShuffleButton,
    setNeedToRefreshShuffleButton,
  } = useSongs();
  let { isShuffleActive: shuffle } = useSongs();

  const [isShuffleActive, setIsShuffleActive] = useState(shuffle);
  const [isRepeatActive, setIsRepeatActive] = useState(false);

  let isUserSliding = false;
  const maxSongTitleLenght = 18;

  useEffect(() => {
    if(currentTrack && songList && currentTrack.cover == undefined){
      const currentSongRefreshedData = songList.find(s => s.id == currentTrack.id);
      setCurrentTrack(currentSongRefreshedData);
    }
  }, [songList]);

  useEffect(() => {
    TrackPlayer.addEventListener('playback-track-changed', async () => {
      if (!songList) return;
      const newCurrentTrackId = await TrackPlayer.getCurrentTrack();
      const newCurrentTrack = songList.find(s => s.id == newCurrentTrackId);
      
      if (!newCurrentTrack) return;

      setCurrentTrack(newCurrentTrack);
    })
  }, []);

  useEffect(() => {
    setCurrentTrack(route.params as MusicFile)
    setIsPlaying(true);
  }, [route.params]);

  useEffect(() => {
    if(needToRefreshPauseButton){
      setIsPlaying(needToRefreshPauseButton);
      setNeedToRefreshPauseButton(false);
    }    
  }, [needToRefreshPauseButton]);

  useEffect(() => {
    if(needToRefreshShuffleButton){
      setIsShuffleActive(needToRefreshShuffleButton);
      setNeedToRefreshShuffleButton(false);
    }    
  }, [needToRefreshShuffleButton]);

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

    const nextTrackId = await TrackPlayer.getCurrentTrack();
    const {id, title, path, author, cover, duration, album} = songList.find(s => s.id === nextTrackId)!;

    if(nextTrackId){
      setCurrentTrack({
        id,
        title,
        path,
        author,
        cover,
        duration,
        album,      
      })
    }
  }, [songList]);

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

    const nextTrackId = await TrackPlayer.getCurrentTrack();
    const {id, title, path, author, cover, duration, album} = songList.find(s => s.id === nextTrackId)!;

    if(nextTrackId){
      setCurrentTrack({
        id,
        title,
        path,
        author,
        cover,
        duration,
        album,      
      })
    }
  }, [songList]);

  const handleOnSlidingComplete = useCallback((value: number) => {
    isUserSliding = false;
    TrackPlayer.seekTo(value);
  }, []);

  const handleGetCurrentPosition = useCallback((value: number): string => {
    const minutes = Math.floor(value / 60);
    const seconds = (Math.floor(value - 60 * minutes)).toString().padStart(2, '0');
    return `${minutes}:${seconds}`
  }, []);

  const handleShufflePress = useCallback(() => {
    setIsShuffleActive(!isShuffleActive);
    changeShuffleValue();
  }, [isShuffleActive]);

  const handleRepeatPress = useCallback(() => {
    setIsRepeatActive(!isRepeatActive);
  }, [isRepeatActive]);

  return (
    <Container>
      {currentTrack
        ?
        (
          <>
            {
              currentTrack.cover 
                ? <AlbumCover source={{uri: currentTrack.cover}}/>
                : (
                  <EmptyAlbumCover >
                    <IconFontisto name="music-note" color="#fff" size={125} style={{ marginLeft: -5 }}/>
                  </EmptyAlbumCover>
                )
            }
            <SongTitleContainer
              text={currentTrack.title}
              maxTextLenght={maxSongTitleLenght}
            >
              {
                currentTrack.title.length > maxSongTitleLenght
                  ? (
                    <SongTitleTicker
                      duration={15000}
                      repeatSpacer={50}
                      marqueeDelay={1000}
                    > 
                      {currentTrack.title}
                    </SongTitleTicker>
                  )
                  : (
                    <SongTitle>
                      {currentTrack.title}
                    </SongTitle>
                  )
              }
            </SongTitleContainer>
            <ArtistName> {currentTrack.author} </ArtistName>
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
              maximumValue={Number(currentTrack.duration) / 1000}
              minimumTrackTintColor="#50F"
              maximumTrackTintColor="#AAA"            
            />
            <IconContainer>
              <IconFeather name="skip-back" size={40} color="#fff" onPress={handleSkipBackwards}/>

              {isPlaying 
                ? <IconFeather name="pause" size={40} color="#fff" style={{marginRight: 55, marginLeft: 55}} onPress={handlePauseSong}/>
                : <IconFeather name="play" size={40} color="#fff" style={{marginRight: 55, marginLeft: 55}} onPress={handlePlaySong}/>
              }

              <IconFeather name="skip-forward" size={40} color="#fff" onPress={handleSkipFoward}/>
            </IconContainer>
            <IconFooter>
              <IconIonicons 
                name="shuffle" 
                size={30} 
                color={
                  isShuffleActive 
                    ? "#50f"
                    : "#a5a5a5"
                }
                onPress={handleShufflePress}
                style={{ marginTop: -4 }}
              />
              <IconFeather 
                name="repeat" 
                size={20} 
                color={
                  isRepeatActive 
                    ? "#50f"
                    : "#a5a5a5"
                }
                onPress={handleRepeatPress}
              />
            </IconFooter>
          </>
        )
        : (
          <>
            <EmptyAlbumCover>
              <IconFontisto name="music-note" color="#fff" size={125} style={{ marginLeft: -5 }}/>
            </EmptyAlbumCover>
            <EmptyTimeContainer>
              <CurrentSongPostition>0:00</CurrentSongPostition>
              <SongDuration>0:00</SongDuration>
            </EmptyTimeContainer>
            <Slider 
              style={{
                width: 300,
                height: 40,
                marginBottom: 40,
              }}
              value={0}
              disabled={true}
              minimumTrackTintColor="#50F"
              maximumTrackTintColor="#AAA"
            />
            <IconContainer>
              <IconFeather name="skip-back" size={40} color="#fff"/>

              <IconFeather name="play" size={40} color="#fff" style={{marginRight: 55, marginLeft: 55}}/>

              <IconFeather name="skip-forward" size={40} color="#fff"/>
            </IconContainer>
            <IconFooter>
              <IconIonicons 
                name="shuffle" 
                size={30} 
                color={
                  isShuffleActive 
                    ? "#50f"
                    : "#a5a5a5"
                }
                onPress={handleShufflePress}
                style={{ marginTop: -4 }}
              />
              <IconFeather 
                name="repeat" 
                size={20} 
                color={
                  isRepeatActive 
                    ? "#50f"
                    : "#a5a5a5"
                }
                onPress={handleRepeatPress}
              />
            </IconFooter>
          </>
        )
      }
    </Container>
  );
};

export default Player;
