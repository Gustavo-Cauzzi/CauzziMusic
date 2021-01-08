import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PERMISSIONS, request } from 'react-native-permissions';
import MusicFiles from 'react-native-get-music-files-v3dev-test';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage from '@react-native-community/async-storage';
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

interface AlbumCover {
  id: number,
  cover: string | undefined;
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

const SongContext = createContext<SongContextData>({} as SongContextData);

const SongProvider: React.FC = ({ children }) => {
  const [songList, setSongList] = useState<MusicFile[]>([]);
  const [needToRefreshPauseButton, setNeedToRefreshPauseButton] = useState(false);
  const [needToRefreshShuffleButton, setNeedToRefreshShuffleButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAlbumCovers, setIsLoadingAlbumCovers] = useState(true);
  let isShuffleActive = false;
  let localScopeSongList: MusicFile[] = [];
  let albumsCoverArray: AlbumCover[] = [];

  async function loadAsyncInfo(){
    const albumArrayFromStorage = await AsyncStorage.getItem("CauzziMusic:AlbumArray");

    if(albumArrayFromStorage){
      albumsCoverArray = JSON.parse(albumArrayFromStorage);
    }
  }

  useEffect(() => {
    if(songList.length == 0){
      loadAsyncInfo();

      request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
        result != 'granted' ? console.log(result) : null
      })
      
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
              const albumIndex = albumsCoverArray.findIndex(a => a.id == song.id);

              return {
                ...song,  
                author: song.artist,
                cover: albumIndex != -1 
                        ?  albumsCoverArray[albumIndex].cover != undefined
                          ?  `file://${albumsCoverArray[albumIndex].cover}`
                          : undefined
                        : undefined
              }
            })
    
            console.log('musicas adiquiridas');
  
            localScopeSongList = arrayToAdd;
            setIsLoading(false);
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
    }

    async function setupMusicPlayer(){
      TrackPlayer.setupPlayer().then(async () => {
        TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          ],
          notificationCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          ],
          compactCapabilities : [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
          ],
        });
      })
    }

    setupMusicPlayer();
  }, []);

  const handleGetMusicFilesWithCovers = useCallback(() => {
    MusicFiles.getAll({
      cover: true,
      coverFolder: '/storage/emulated/0/.covers/',
      batchSize: 0,
      batchNumber: 0,
      minimumSongDuration: 10000,
      sortBy: 'TITLE',
      sortOrder: 'ASC'
    }).then((result: MusicFilesResult) => {
      console.log('albuns adiquiridos');
      let itNeedsToRefreshAlbumArray = false;

      result.results.map((song: any) => {
        const albumIndex = albumsCoverArray.findIndex(a => a.id == song.id);
        if(albumIndex != -1){
          const stringToTest = song.cover != '' ? String(`file://${song.cover}`) : undefined;

          if(albumsCoverArray[albumIndex].cover != stringToTest){
            itNeedsToRefreshAlbumArray = true;
            albumsCoverArray[albumIndex] = {
              id: song.id,
              cover: song.cover ? `file://${song.cover}` : undefined,
            }
          }
        }else{
          itNeedsToRefreshAlbumArray = true;
          albumsCoverArray.push({
            id: song.id,
            cover: song.cover ? `file://${song.cover}` : undefined,
          })
        }
      });

      if(itNeedsToRefreshAlbumArray){
        AsyncStorage.setItem("CauzziMusic:AlbumArray", JSON.stringify(albumsCoverArray))

        const refreshedSongList: any = localScopeSongList.map(s => {
          const index = albumsCoverArray.findIndex(a => a.id == s.id);  

          if(index == -1){
            return s;
          }else{
            return {
              ...s,
              cover: String(s.cover) != albumsCoverArray[index].cover ? albumsCoverArray[index].cover : s.cover
            }
          }
        })

        // console.log(refreshedSongList)
        setSongList(refreshedSongList);
      }
    }).catch((error: any) => {
        console.log('error: ',error);
        setIsLoadingAlbumCovers(false);
    })
  }, [localScopeSongList, albumsCoverArray])

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
    generateQueue(song);
  }, [TrackPlayer]);
  
  const generateQueue = useCallback((song: MusicFile) => {
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