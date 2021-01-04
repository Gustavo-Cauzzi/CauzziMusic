import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PERMISSIONS, request } from 'react-native-permissions';
import MusicFiles from 'react-native-get-music-files-v3dev-test';
import AsyncStorage from '@react-native-community/async-storage';
import { DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native';
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

interface MusicFilesResult{
  lenght?: number,
  results: {
    id: number,
    path: string,
    cover?: string,
    duration: number,
    album: string,
    artist: string,
    title: string
  }[],
}
interface SongContextData {
  TrackPlayer: any & ITrackPlayer;
  songList: MusicFile[];
  playSong(song: MusicFile): void;
  refresh(): void;
  needToRefreshPauseButton: boolean;
  needToRefreshShuffleButton: boolean;
  setNeedToRefreshPauseButton(value: boolean): void;
  setNeedToRefreshShuffleButton(value: boolean): void;
  isShuffleActive: boolean;
  changeShuffleValue(value?: boolean): void;
  isLoading: boolean;
}

interface ITrackPlayer{
  getPosition(): Promise<number>;
}

const { RNReactNativeGetMusicFiles } = NativeModules;

const SongContext = createContext<SongContextData>({} as SongContextData);

const SongProvider: React.FC = ({ children }) => {
  const [songList, setSongList] = useState<MusicFile[]>([]);
  const [needToRefreshPauseButton, setNeedToRefreshPauseButton] = useState(false);
  const [needToRefreshShuffleButton, setNeedToRefreshShuffleButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let isShuffleActive = false;
  let localScopeSongList: MusicFile[] = [];

  useEffect(() => {
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
      if(result == 'granted'){
        MusicFiles.getAll({
          cover: false,
          batchSize: 0,
          batchNumber: 0,
          minimumSongDuration: 10000,
          sortBy: 'TITLE',
          sortOrder: 'ASC'
        }).then((result: MusicFilesResult) => {
          const arrayToAdd = result.results.map((song: any) => {
            return {
              ...song,  
              author: song.artist,
            }
          })
  
          console.log(arrayToAdd);

          setSongList(arrayToAdd);

          handleGetMusicFilesWithCovers();
        }).catch((error: any) => {
            console.log('error: ',error);
            setIsLoading(false);
        })
      }else{
        console.log(result);
      }
    });

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
  }, []);

  const handleGetMusicFilesWithCovers = useCallback(() => {
    // DeviceEventEmitter.addListener('onBatchRecived', (params) => {
    //   console.log("batch: ",params.batch)
    // })

    MusicFiles.getAll({
      cover: true,
      coverFolder: '/storage/emulated/0/.covers/',
      batchSize: 0,
      batchNumber: 0,
      minimumSongDuration: 10000,
      sortBy: 'TITLE',
      sortOrder: 'ASC'
    }).then((result: MusicFilesResult) => {
      const arrayToAdd = result.results.map((song: any) => {
        return {
          ...song,  
          author: song.artist,
          cover: song.cover ? `file://${song.cover}` : undefined,
        }
      })

      console.log('albuns adiquiridos');

      setSongList(arrayToAdd);
    }).catch((error: any) => {
        console.log('error: ',error);
        setIsLoading(false);
    })
  }, [])

  const refresh = useCallback(() => {
    setSongList({} as MusicFile[]);
    setIsLoading(true);

    DeviceEventEmitter.addListener('onBatchReceived', (params) => {
      setSongList([params.batch]);
      // localScopeSongList = localScopeSongList.push()
      console.log("params.batch: ",params.batch);
      // console.log("song.tsx/81\n song.tsx/81\n song.tsx/81\n song.tsx/81")
    });

    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
      console.log(result);
    });

    
  }, []);

  const playSong = useCallback(async (song: MusicFile): Promise<void> => {
    TrackPlayer.reset();

    await TrackPlayer.add({
      id: String(song.id),
      url: song.path,
      title: song.title,
      artist: song.author,
      artwork: song.cover,
    });

    TrackPlayer.play(); 
    console.log("gerar o queueueueuee")
    generateQueue(song);
  }, [TrackPlayer, localScopeSongList]);
  
  const generateQueue = useCallback((song: MusicFile) => {
    console.log("entrou no generate")
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

  const changeShuffleValue = useCallback((value?: boolean) => {
    if(value != undefined){
      isShuffleActive = value;
    }else{
      isShuffleActive = !isShuffleActive;
    }

    resetQueue();
  }, [isShuffleActive]);

  const resetQueue = useCallback(async () => {
    const currentTrackId = await TrackPlayer.getCurrentTrack();
    if(currentTrackId){
      const currentTrack = localScopeSongList.find(s => s.id == Number(currentTrackId))!;
    
      await TrackPlayer.removeUpcomingTracks();
      const currentQueue = await TrackPlayer.getQueue();
      
      if(currentQueue.length > 1){
        const idsToRemoveFromQueue = currentQueue.map((s) => s.id);
        const filteredIdsToRemoveFromQueue = idsToRemoveFromQueue.filter((id, index) => index < currentQueue.length - 1 ? id : null);

        await TrackPlayer.remove(filteredIdsToRemoveFromQueue)
      }

      generateQueue(currentTrack);
    }
  }, [TrackPlayer, localScopeSongList]);

  return (
    <SongContext.Provider value={{ 
      TrackPlayer, 
      songList, 
      playSong, 
      refresh, 
      needToRefreshPauseButton, 
      needToRefreshShuffleButton,
      setNeedToRefreshPauseButton, 
      setNeedToRefreshShuffleButton,
      isShuffleActive,
      changeShuffleValue,
      isLoading
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

/*



*/