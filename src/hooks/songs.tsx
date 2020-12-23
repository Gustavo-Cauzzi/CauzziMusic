import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PERMISSIONS, request } from 'react-native-permissions';
import MusicFiles from 'react-native-get-music-files';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeEventEmitter, NativeModules } from 'react-native';
import TrackPlayer from 'react-native-track-player';
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

interface SongContextData {
  TrackPlayer: any & ITrackPlayer;
  songList: MusicFile[];
  playSong(song: MusicFile): void;
  refresh(): void;
  needToRefreshPauseButton: boolean;
  setNeedToRefreshPauseButton(value: boolean): void;
  isShuffleActive: boolean;
  isRepeatActive: boolean;
  changeShuffleValue(): void;
  changeRepeatValue(): void;
}

interface ITrackPlayer{
  getPosition(): Promise<number>;
}

const { RNReactNativeGetMusicFiles } = NativeModules;

const eventEmitter = new NativeEventEmitter(RNReactNativeGetMusicFiles);

const SongContext = createContext<SongContextData>({} as SongContextData);

const SongProvider: React.FC = ({ children }) => {
  const [songList, setSongList] = useState<MusicFile[]>([]);
  const [needToRefreshPauseButton, setNeedToRefreshPauseButton] = useState(false);
  let isRepeatActive = false;
  let isShuffleActive = false;
  let localScopeSongList: MusicFile[] = [];

  useEffect(() => {
    async function loadDataFromStorage(){
      const songListFromStorage = await AsyncStorage.getItem("PlayerCauzziTeste3:songList");

      if(songListFromStorage){
        setSongList(JSON.parse(songListFromStorage))
       localScopeSongList = JSON.parse(songListFromStorage)
      }else{
        refresh();
      }
    }

    async function setupMusicPlayer(){
      TrackPlayer.setupPlayer().then(async () => {
        TrackPlayer.updateOptions({
          capabilities: [
              TrackPlayer.CAPABILITY_PLAY,
              TrackPlayer.CAPABILITY_PAUSE,
              TrackPlayer.CAPABILITY_STOP
          ],
          notificationCapabilities: [
              TrackPlayer.CAPABILITY_PLAY,
              TrackPlayer.CAPABILITY_PAUSE,
              TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
              TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          ],
        });
      })
    }

    setupMusicPlayer();
    loadDataFromStorage();
  }, []);

  const refresh = useCallback(() => {
    eventEmitter.addListener('onBatchReceived', (params) => {
      setSongList([params.batch]);
      console.log("song.tsx/81\n song.tsx/81\n song.tsx/81\n song.tsx/81")
    });

    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
      console.log(result);
    });

    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
      console.log(result);
      if(result == 'granted'){
        MusicFiles.getAll({
          id: true,
          blured : false, // works only when 'cover' is set to true
          artist : true,
          duration : true, //default : true
          cover : true, //default : true,
          genre : true,
          title : true,
          minimumSongDuration : 10000, // get songs bigger than 10000 miliseconds duration,
        }).then(async (tracks: MusicFile[]) => {
            console.log('tracks ',tracks);
            setSongList(tracks);

            await AsyncStorage.setItem("PlayerCauzziTeste3:songList", JSON.stringify(tracks));
        }).catch((error: any) => {
            console.log('error: ',error);
        })
      }
    });
  }, []);

  const playSong = useCallback(async (song: MusicFile): Promise<void> => {
    console.log("shufle: ", isShuffleActive);
    TrackPlayer.reset();

    await TrackPlayer.add({
      id: String(song.id),
      url: song.path,
      title: song.title,
      artist: song.author,
      artwork: song.cover,
    });

    TrackPlayer.play(); 
    
    if(isShuffleActive){
      let songsToAdd: any = [{
        id: String(song.id),
        url: song.path,
        title: song.title,
        artist: song.author,
        artwork: song.cover,
      }];

      while(songsToAdd.length < localScopeSongList.length){
        const randomIndex = Math.floor(Math.random() * localScopeSongList.length);
        const {id, path, title, author, cover} = localScopeSongList[randomIndex]
        const currentSong = {
          id: String(id),
          url: path,
          title: title,
          artist: author,
          artwork: cover,
        } 
        if(!songsToAdd.includes(currentSong)){
          songsToAdd.push(currentSong);
        }
      }

      songsToAdd.splice(0, 1);

      TrackPlayer.add(songsToAdd);
    }else{
      // const currentTrack = await TrackPlayer.getCurrentTrack();     // maybe not having this could be a problem in the future (but probably not)
      const index = localScopeSongList.findIndex(s => s.id === song.id);
      
      const songsToAddList = localScopeSongList.map((s, i) => {
        if(i > index){
            return {
            id: String(s.id),
            url: s.path,
            title: s.title,
            artist: s.author,
            artwork: s.cover,            
          }
        }
      });

      const songsToAdd: any = songsToAddList.filter(s => s != undefined ? s : null);

      TrackPlayer.add(songsToAdd);
    } 

  }, [TrackPlayer, localScopeSongList]);
  
  const changeShuffleValue = useCallback(() => {
    isShuffleActive = !isShuffleActive;
  }, [isShuffleActive]);

  const changeRepeatValue = useCallback(() => {
    isRepeatActive = !isRepeatActive;
  }, [isRepeatActive]);

  return (
    <SongContext.Provider value={{ 
      TrackPlayer, 
      songList, 
      playSong, 
      refresh, 
      needToRefreshPauseButton, 
      setNeedToRefreshPauseButton, 
      isShuffleActive,
      isRepeatActive,
      changeShuffleValue,
      changeRepeatValue,
    }}>
      {children}
    </SongContext.Provider>
  );
};

const useSongs = (): SongContextData => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error('useSongs must be used within an SongContextProvider');
  }

  return context;
}

export { useSongs, SongProvider};