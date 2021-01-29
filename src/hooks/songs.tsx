import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import MusicFiles from 'react-native-get-music-files-v3dev-test';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage from '@react-native-community/async-storage';
import rnfs from 'react-native-fs';
import { Alert, ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';
interface MusicFile{
  id : number,
  title : string,
  author : string,
  album : string,
  genre : string,
  duration : number, 
  cover :string,
  blur : string, 
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

interface Playlist{
  id: string;
  name: string;
  songs: MusicFile[];
  description: string;
}

interface Artist {
  albums: {
      album: string | undefined;
      cover: string | undefined;
  }[];
  artist: string;
  numberOfAlbums: number;
  numberOfSongs: number;
};

interface UserSettings{
  ignoreAudios: boolean;
  hideFilteredSongs: boolean;
}
interface SongContextData {
  TrackPlayer: any & ITrackPlayer;
  searchFiles(): void;
  songList: MusicFile[];
  filteredSongList: MusicFile[];
  artistList: Artist[];
  playlists: Playlist[];
  filteredSongs: MusicFile[];
  playSong(song: MusicFile, playlist?: MusicFile[]): void;
  setNeedToRefreshPauseButton(value: boolean): void;
  setNeedToRefreshShuffleButton(value: boolean): void;
  changeShuffleValue(value?: boolean): void;
  deleteSong(song: MusicFile[]): void;
  createPlaylist(name: String, songs?: MusicFile[]): boolean;
  deletePlaylist(playlistId: string): void;
  removeSongsFromPlaylist(songs: MusicFile[], playlistId: string): void;
  addSongsToPlaylist(songs: MusicFile[], playlistId: string): void;
  addSongsToFilter(songs: MusicFile[]): void;
  removeSongsFromFilter(songs: MusicFile[]): void;
  isLoadingAlbumCovers: boolean;
  isShuffleActive: boolean;
  needToRefreshPauseButton: boolean;
  needToRefreshShuffleButton: boolean;

  ignoreAudios: boolean;
  changeIgnoreAudios(value: boolean): void;
  hideFilteredSongs: boolean;
  changeHideFilteredSongs(value: boolean): void
}

interface ITrackPlayer{
  getPosition(): Promise<number>;
}

const SongContext = createContext<SongContextData>({} as SongContextData);

const SongProvider: React.FC = ({ children }) => {
  const [songList, setSongList] = useState<MusicFile[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<MusicFile[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<MusicFile[]>([]);
  const [artistList, setArtistList] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albumCoversFromStorage, setAlbumCoversFromStorage] = useState<AlbumCover[]>([]);
  const [needToRefreshPauseButton, setNeedToRefreshPauseButton] = useState(false);
  const [needToRefreshShuffleButton, setNeedToRefreshShuffleButton] = useState(false);
  const [isLoadingAlbumCovers, setIsLoadingAlbumCovers] = useState(true);
  const [ignoreAudios, setignoreAudios] = useState(false);
  const [hideFilteredSongs, setHideFilteredSongs] = useState(false);
  let isThereAlbumsInStorage = false; 
  let currentPlaylist: MusicFile[] = [] as MusicFile[];
  let isShuffleActive = false;
  let localScopeSongList: MusicFile[] = [];
  let albumsCoverArray: AlbumCover[] = [];
  
  async function loadAsyncInfo(){
    const playlistsFromStorage = await AsyncStorage.getItem("CauzziMusic:Playlists");
    const albumArrayFromStorage = await AsyncStorage.getItem("CauzziMusic:AlbumArray");
    const ignoreAudiosFromStorage = await AsyncStorage.getItem("CauzziMusic:IgnoreAudios");
    const filteredSongsFromStorage = await AsyncStorage.getItem("CauzziMusic:FilteredSongs");
    const hideFilteredSongsFromStorage = await AsyncStorage.getItem("CauzziMusic:HideFilteredSongs");
    
    if (playlistsFromStorage) setPlaylists(JSON.parse(playlistsFromStorage));
    if (ignoreAudiosFromStorage) setignoreAudios(JSON.parse(ignoreAudiosFromStorage));
    if (filteredSongsFromStorage) setFilteredSongs(JSON.parse(filteredSongsFromStorage));
    if (hideFilteredSongsFromStorage) setHideFilteredSongs(JSON.parse(hideFilteredSongsFromStorage));
    
    if(albumArrayFromStorage && albumArrayFromStorage.length > 0){
      albumsCoverArray = JSON.parse(albumArrayFromStorage);
      setAlbumCoversFromStorage(JSON.parse(albumArrayFromStorage))
      setIsLoadingAlbumCovers(false);
      isThereAlbumsInStorage = true;
    }
  }

  useEffect(() => {
    setFilteredSongList(songList.filter(song => !filteredSongs.find(s => s.id == song.id)));
  }, [filteredSongs, songList]);

  useEffect(() => {    
    function requestPermissions(){
      requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((result) => {
        if(result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] == 'granted' && result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'granted'){
          searchFiles();
        }else{
          Alert.alert(
            "Permissões Necessárias",
            "Por favor permita para que o Cauzzi Music possa ler as músicas presentes em seu celular!",
            [
              {
                text: 'Ok',
                onPress: () => {requestPermissions()}
              }
            ]
          )
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

    loadAsyncInfo();
    requestPermissions();
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
      console.log('songs.tsx: Artist Processed');
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
        setAlbumCoversFromStorage(albumsCoverArray);

        let refreshedSongList: any = localScopeSongList.map(s => {
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

        if(ignoreAudios){
          const _refreshedSongList = refreshedSongList as MusicFile[];
          refreshedSongList = _refreshedSongList.filter(song => !song.title.includes('AUD-'));
        }

        setSongList(refreshedSongList);
        setIsLoadingAlbumCovers(false);
        if (!isThereAlbumsInStorage) handleGetArtistWithRespectiveAlbums();
      }
    }).catch((error: any) => {
        console.log('error: ',error);
        setIsLoadingAlbumCovers(false);
    })
  }, [localScopeSongList, albumsCoverArray])

  const searchFiles = useCallback(() => {
    MusicFiles.getAll({
      cover: false,
      batchSize: 0,
      batchNumber: 0,
      minimumSongDuration: 10000,
      sortBy: 'TITLE',
      sortOrder: 'ASC'
    }).then((result: MusicFilesResult) => {
      let arrayToAdd = result.results.map((song: any) => {
        const albumIndex = albumsCoverArray.findIndex(a => a.id == song.id);

        return {
          ...song,  
          author: song.artist == '<unknown>' ? 'Desconhecido' : song.artist,
          cover: 
            albumIndex != -1 
              ?  albumsCoverArray[albumIndex].cover != undefined
                ?  `file://${albumsCoverArray[albumIndex].cover}`
                : undefined
              : undefined
        }
      })

      if(ignoreAudios){
        arrayToAdd = arrayToAdd.filter(song => !song.title.includes('AUD-'));
      }

      console.log('songs.tsx: SongList acquired');

      localScopeSongList = arrayToAdd;
      setSongList(arrayToAdd);

      handleGetArtistWithRespectiveAlbums();
      handleGetMusicFilesWithCovers();
    }).catch((error: any) => {
        console.log('error: ',error);
    })
  }, [albumCoversFromStorage, handleGetArtistWithRespectiveAlbums, handleGetMusicFilesWithCovers, filteredSongs, ignoreAudios]);
  
  const generateQueue = useCallback((song: MusicFile, playlist?: MusicFile[]) => {
    let playlistToProcess = filteredSongList;
    console.log("filteredSong: ",filteredSongList);

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
      console.log("songs/ queue: ",songsToAdd);
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
      console.log("songs/ queue: ",songsToAdd);
    } 
  }, [TrackPlayer, filteredSongList]);

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
  }, [TrackPlayer, generateQueue]);

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

      if(currentPlaylist.length > 0){
        generateQueue(currentTrack, currentPlaylist);
      }else{
        generateQueue(currentTrack);
      }
    }
  }, [TrackPlayer, localScopeSongList, currentPlaylist]);

  const deleteSong = useCallback((songs: MusicFile[]) => {
    songs.map(song => {
      rnfs.exists(`file://${song.path}`).then((result) => {
        console.log("file exists: ", result);

        if(result){
          return rnfs.unlink(song.path).then(() => {
            console.log('FILE DELETED');
            rnfs.scanFile(song.path);
          }).catch((err) => {
            console.log(err.message);
          });
        }else{
          rnfs.scanFile(song.path);
        }
      }).catch((err) => {
        console.log(err.message);
      });
    });

    const refreshedSongList = songList.filter(slist => {
      const index = songs.findIndex(s => s.id == slist.id);

      if (index == -1) return slist;
    });
    const refreshedAlbumList = albumCoversFromStorage.filter(a => {
      const index = songs.findIndex(s => s.id == a.id);

      if (index == -1) return a;
    });

    const refreshedPlaylists = playlists.map(playlist => {
      const refreshedSongs = playlist.songs.filter(song => {
        const index = songs.findIndex(s => s.id == song.id);

        if (index == -1) return song;
      });

      return {...playlist, songs: refreshedSongs}
    });

    setPlaylists(refreshedPlaylists)
    setSongList(refreshedSongList);
    setAlbumCoversFromStorage(refreshedAlbumList);

    AsyncStorage.setItem("CauzziMusic:Playlists", JSON.stringify(refreshedPlaylists));
    AsyncStorage.setItem("CauzziMusic:AlbumArray", JSON.stringify(refreshedAlbumList))
  }, [songList, albumCoversFromStorage]);

  const createPlaylist = useCallback((name: string, songs?: MusicFile[]) => {
    const playlistWithTheSameName = playlists.find(p => p.name.toLowerCase() == name.toLowerCase());
    if (playlistWithTheSameName) return false;

    setPlaylists([...playlists, {
      id: uuid.v4(),
      name: name,
      songs: songs ? [...songs] : [],
      description: '',
    }]);

    AsyncStorage.setItem("CauzziMusic:Playlists", JSON.stringify([...playlists,{
      id: playlists.length,
      name: name,
      songs: songs ? [...songs] : []
    }]));

    return true;
  }, [playlists]);

  const removeSongsFromPlaylist = useCallback((songs: MusicFile[], playlistId: string) => {
    if (!playlists.find(p => p.id == playlistId)) return;

    const refreshedPlaylists = playlists.map(playlist => {
      if(playlist.id == playlistId){
        const refreshedSongs = playlist.songs.filter(song => {
          if(!songs.find(s => song.id == s.id)){
            return song;
          }
        });

        return {...playlist, songs: refreshedSongs}
      }else{
        return playlist;
      }
    });

    setPlaylists(refreshedPlaylists);
    AsyncStorage.setItem("CauzziMusic:Playlists", JSON.stringify(refreshedPlaylists));
  }, [playlists]);

  const addSongsToPlaylist  = useCallback((songs: MusicFile[], playlistId: string) => {
    const playlist = playlists.find(p => p.id == playlistId);
    if (!playlist) return;
    
    const repeatedSongs = playlist.songs.filter(song => songs.find(s => s.id == song.id));
    
    let refreshedPlaylists: Playlist[] = [];
    if(repeatedSongs.length != 0){
      Alert.alert(
        "Músicas Repitidas",
        `Uma ou mais músicas selecionadas já se encontram nesta playlist. Você gostaria de coloca-las repitidamente ou adicionar apenas as músicas novas?`,
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Ação cancelada"),
            style: "cancel"
          },
          {
            text: "Repitir",
            onPress: () => {
              refreshedPlaylists = playlists.map(p => p.id == playlistId ? {...p, songs: [...p.songs, ...songs]} : p);
              setPlaylists(refreshedPlaylists);
              ToastAndroid.show('Músicas Adicionadas', ToastAndroid.SHORT);
            },
          },
          { 
            text: "Apenas novas", 
            onPress: () => {
              const newSongs = songs.filter(song => {
                if(!repeatedSongs.find(s => s!.id == song.id)){
                  return song;
                }
              })

              refreshedPlaylists = playlists.map(p => p.id == playlistId ? {...p, songs: [...p.songs, ...newSongs]} : p)
              setPlaylists(refreshedPlaylists);
              ToastAndroid.show('Músicas Adicionadas', ToastAndroid.SHORT);
            },
          }
        ],
        { cancelable: false }
      );
    }else{
      refreshedPlaylists = playlists.map(p => p.id == playlistId ? {...p, songs: [...p.songs, ...songs]} : p);
      setPlaylists(refreshedPlaylists);
      ToastAndroid.show('Músicas Adicionadas', ToastAndroid.SHORT);
    }

    AsyncStorage.setItem("CauzziMusic:Playlists", JSON.stringify(refreshedPlaylists));
  }, [playlists]);

  const deletePlaylist = useCallback((playlistId: string) => {
    const playlist = playlists.find(p => p.id == playlistId);
    if (!playlist) return;

    Alert.alert(
      "Excluir Playlist",
      `Você tem certeza que gostaria de remover a playlist ${playlist.name}?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Ação cancelada"),
          style: "cancel"
        },
        { 
          text: "Sim", 
          onPress: () => {
            const refreshedPlaylists = playlists.filter(p => p.id != playlistId);
        
            setPlaylists(refreshedPlaylists);
            AsyncStorage.setItem("CauzziMusic:Playlists", JSON.stringify(refreshedPlaylists));
          },
        }
      ],
    );
  }, [playlists]);

  const addSongsToFilter = useCallback((songs: MusicFile[]) => {
    let arrayToAdd: MusicFile[] = [];

    songs.map(song => {
      const songAlreadyFiltered = filteredSongs.find(f => f.id == song.id);
      if (songAlreadyFiltered){
        console.log(`Song ${songAlreadyFiltered.title} (${songAlreadyFiltered.id}) already filtered`);
        return;
      }

      arrayToAdd.push(song);
    })

    setFilteredSongs([...filteredSongs, ...arrayToAdd]);
    ToastAndroid.show(`${arrayToAdd.length} Músicas adicionadas`, ToastAndroid.SHORT);
    AsyncStorage.setItem('CauzziMusic:FilteredSongs', JSON.stringify([...filteredSongs, ...arrayToAdd]));
  }, [filteredSongs, setFilteredSongs]);

  const removeSongsFromFilter = useCallback((songs: MusicFile[]) => {
    songs.map(song => {
      const songIsFiltered = filteredSongs.find(f => f.id == song.id);
      if (!songIsFiltered){
        throw new Error(`Cannot remove a song that is't filtered. \n${song.title} (${song.id})`)
      }
    });

    const refreshedFilteredSongs = filteredSongs.filter(f => !songs.find(s => s.id == f.id))
    
    setFilteredSongs(refreshedFilteredSongs);
    AsyncStorage.setItem('CauzziMusic:FilteredSongs', JSON.stringify(refreshedFilteredSongs));
  }, [filteredSongs, setFilteredSongs]);
  
  const changeHideFilteredSongs = useCallback((value: boolean) => {
    setHideFilteredSongs(value)
    AsyncStorage.setItem('CauzziMusic:HideFilteredSongs', JSON.stringify(value));
  }, []);
  
  const changeIgnoreAudios = useCallback((value: boolean) => {
    setignoreAudios(value);

    searchFiles();
    ToastAndroid.show("Atualizando lista", ToastAndroid.SHORT);

    AsyncStorage.setItem('CauzziMusic:IgnoreAudios', JSON.stringify(value));
  }, [searchFiles]);

  return (
    <SongContext.Provider value={{ 
      TrackPlayer, 
      searchFiles,
      songList, 
      filteredSongList,
      artistList,
      filteredSongs,
      playlists,
      playSong, 
      addSongsToPlaylist,
      setNeedToRefreshPauseButton, 
      setNeedToRefreshShuffleButton,
      changeShuffleValue,
      createPlaylist,
      deletePlaylist,
      removeSongsFromPlaylist,
      addSongsToFilter,
      removeSongsFromFilter,
      isShuffleActive,
      isLoadingAlbumCovers,
      needToRefreshPauseButton, 
      needToRefreshShuffleButton,
      deleteSong,
      ignoreAudios,
      changeIgnoreAudios,
      hideFilteredSongs,
      changeHideFilteredSongs,
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