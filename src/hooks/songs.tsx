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

interface getArtistsResult {
  results: {
    artist: string,
    numberOfAlbums: number,
    numberOfSongs: number,
  }[],
  length: number
}
interface AlbumCover {
  id: number,
  artist: string;
  album: string;
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

interface ArtistList {
  albums: {
      album: string | undefined;
      cover: string | undefined;
  }[];
  artist: string;
  numberOfAlbums: number;
  numberOfSongs: number;
};
interface SongContextData {
  TrackPlayer: any & ITrackPlayer;
  songList: MusicFile[];
  artistList: ArtistList[];
  playSong(song: MusicFile, playlist?: MusicFile[]): void;
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
  const [artistList, setArtistList] = useState<ArtistList[]>([]);
  const [needToRefreshPauseButton, setNeedToRefreshPauseButton] = useState(false);
  const [needToRefreshShuffleButton, setNeedToRefreshShuffleButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAlbumCovers, setIsLoadingAlbumCovers] = useState(true);
  let currentPlaylist: MusicFile[] = [] as MusicFile[];
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
    
            console.log('songs.tsx: SongList acquired',result.results);
  
            localScopeSongList = arrayToAdd;
            setIsLoading(false);
            setSongList(arrayToAdd);

            handleGetArtistWithRespectiveAlbums();
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

  const handleGetArtistWithRespectiveAlbums = useCallback(() => {
    MusicFiles.getArtists({
      sortBy: 'ARTIST',
      sortOrder: 'ASC'
    }).then((data: getArtistsResult) => {
      console.log('songs.tsx: ArtistList Acquired');
      let processableData = data.results;

      if(albumsCoverArray.length > 0){
        let unknownArtistIndex = -1;

        const artistsWithAlbuns = processableData.map((artist, index) => {
          let albumArray: {
            album: string | undefined;
            cover: string | undefined;
          }[] = [];

          albumArray = findAlbumsOfCertainArtist(artist);

         if(processableData[index + 1]){
            while(processableData[index + 1].artist.toLowerCase().includes(artist.artist.toLowerCase())){
              const data = findAlbumsOfCertainArtist(processableData[index + 1]);
              data.map((newAlbum, index) => {
                const result = albumArray.findIndex(album => album.album == newAlbum.album);
                if(result == -1){
                  albumArray.push(newAlbum);
                }else{
                  data.splice(index, 1);
                }
              })
              
              processableData.splice(index + 1, 1);
            }
         }

          if(artist.artist == '<unknown>'){
            unknownArtistIndex = index;
          }

          return {
            ...artist,
            albums: albumArray
          }          
        })

        if(unknownArtistIndex != -1){
          const moveUnknownArtist = artistsWithAlbuns[unknownArtistIndex];
          artistsWithAlbuns.splice(unknownArtistIndex, 1);
          artistsWithAlbuns.push(moveUnknownArtist);
        }
        
        const filteredArtistsWithAlbums = artistsWithAlbuns.filter(a => a != undefined);


        setArtistList(filteredArtistsWithAlbums);
      }
      console.log('songs.tsx: ArtistList Processed');
    })
  }, [albumsCoverArray]);

  const findAlbumsOfCertainArtist = useCallback((artist: any) => {
    const albumArray: {
      album: string | undefined;
      cover: string | undefined;
    }[] = [];

    albumsCoverArray.map(a =>{
      if(a.artist == artist.artist){
        if(!albumArray.find(album => album.album == a.album)){
          albumArray.push({
            album: a.album,
            cover: a.cover,
          });
        }
      }
    });

    return albumArray;
  }, [albumsCoverArray]);

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
      console.log('songs.tsx: Albums acquired');
      let itNeedsToRefreshAlbumArray = false;

      result.results.map((song: any) => {
        const albumIndex = albumsCoverArray.findIndex(a => a.id == song.id);
        if(albumIndex != -1){
          const stringToTest = song.cover != '' ? String(`file://${song.cover}`) : undefined;

          if(albumsCoverArray[albumIndex].cover != stringToTest){
            itNeedsToRefreshAlbumArray = true;
            albumsCoverArray[albumIndex] = {
              id: song.id,
              artist: song.artist,
              album: song.album,
              cover: song.cover ? `file://${song.cover}` : undefined,
            }
          }
        }else{
          itNeedsToRefreshAlbumArray = true;
          albumsCoverArray.push({
            id: song.id,
            artist: song.artist,
            album: song.album,
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

        setSongList(refreshedSongList);
      }
    }).catch((error: any) => {
        console.log('error: ',error);
        setIsLoadingAlbumCovers(false);
    })
  }, [localScopeSongList, albumsCoverArray])

  const playSong = useCallback(async (song: MusicFile, playlist?: MusicFile[]): Promise<void> => {
    if (!playlist){
      currentPlaylist = [];
    }

    TrackPlayer.reset();

    await TrackPlayer.add({
      id: String(song.id),
      url: song.path,
      title: song.title,
      artist: song.author,
      artwork: song.cover,
    });

    TrackPlayer.play(); 

    if(playlist){
      generateQueue(song, playlist);
    }else{
      generateQueue(song);
    }
  }, [TrackPlayer]);
  
  const generateQueue = useCallback((song: MusicFile, playlist?: MusicFile[]) => {
    let playlistToProcess = localScopeSongList;

    if(playlist){
      playlistToProcess = playlist;
      currentPlaylist = playlist;
    }

    if(isShuffleActive){
      let songsToAdd: any = [{
        id: String(song.id),
        url: song.path,
        title: song.title,
        artist: song.author,
        artwork: song.cover,
      }];

      while(songsToAdd.length < playlistToProcess.length){
        const randomIndex = Math.floor(Math.random() * playlistToProcess.length);
        const {id, path, title, author, cover} = playlistToProcess[randomIndex]
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
      const index = playlistToProcess.findIndex(s => s.id === song.id);
      
      const songsToAddList = playlistToProcess.map((s, i) => {
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

      console.log('curentPlaylist: ',currentPlaylist);
      if(currentPlaylist.length > 0){
        console.log("resetQueue- There is a playlist Seted")
        generateQueue(currentTrack, currentPlaylist);
      }else{
        console.log("resetQueue- There is NOT a playlist Seted")
        generateQueue(currentTrack);
      }
    }
  }, [TrackPlayer, localScopeSongList, currentPlaylist]);

  return (
    <SongContext.Provider value={{ 
      TrackPlayer, 
      songList, 
      artistList,
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