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
  refresh(): void;
  songList: MusicFile[];
  playSong(song: MusicFile): void;
  TrackPlayer: any;
}

const { RNReactNativeGetMusicFiles } = NativeModules;

const eventEmitter = new NativeEventEmitter(RNReactNativeGetMusicFiles);

const SongContext = createContext<SongContextData>({} as SongContextData);

const SongProvider: React.FC = ({ children }) => {
  const [songList, setSongList] = useState<MusicFile[]>([]);
  const [isRandomActivated, setIsRandomActivated] = useState(false);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDataFromStorage(){
      const songListFromStorage = await AsyncStorage.getItem("PlayerCauzziTeste3:songList");

      if(songListFromStorage){
        setSongList(JSON.parse(songListFromStorage))
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
    await TrackPlayer.add({
        id: String(song.id),
        url: song.path,
        title: song.title,
        artist: song.author,
        artwork: song.cover,
    });
    
    const trackPlayerState = await TrackPlayer.getState();

    console.log("currentTrackPlayerState: ",trackPlayerState);

    if(trackPlayerState != 2){
      TrackPlayer.skipToNext();
    }else{
      TrackPlayer.play();

      // if(isRandomActivated){
      //   const indexCurrentSong = songList.findIndex(s => s.id === song.id);

      //   songList.map(async (s, index) => {
      //     if(index <= indexCurrentSong) return;
      //     await TrackPlayer.add({
      //       id: String(s.id),
      //       url: s.path,
      //       title: s.title,
      //       artist: s.author,
      //       artwork: s.cover,
      //     });
      //   })
      //   const queue = await TrackPlayer.getQueue();
      //   console.log("queue: ", queue)
      // }else{
      //   let numberOfSongsQueued = 1;
      //   while(numberOfSongsQueued < songList.length){
      //     const randomSongIndex = Math.random() * (songList.length - 1)
      //     const currentQueue = await TrackPlayer.getQueue();
      //     const randomSongAlreadyInQueue = currentQueue.some(s => s.id === String(songList[randomSongIndex].id))
      //     if(!randomSongAlreadyInQueue){
      //       await TrackPlayer.add({
      //         id: String(songList[randomSongIndex].id),
      //         url: songList[randomSongIndex].path,
      //         title: songList[randomSongIndex].title,
      //         artist: songList[randomSongIndex].author,
      //         artwork: songList[randomSongIndex].cover,
      //       }); 
      //       numberOfSongsQueued++;           
      //     }
      //   }
      //   const queue = await TrackPlayer.getQueue();
      //   console.log("queue: ", queue);
      // }
    }
  }, [TrackPlayer, songList]);


  return (
    <SongContext.Provider value={{ songList, refresh, playSong, TrackPlayer }}>
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