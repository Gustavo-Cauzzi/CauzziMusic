import React, { PureComponent, useCallback, useState } from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import { MenuContainer } from './styles';
import { Alert, Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useSongs } from '../../hooks/songs';
import CreatePlaylistModal from '../CreatePlaylistModal';
import { remove } from 'react-native-track-player';

interface MenuPopupProps {
  navigation?: any;
  songs: MusicFile[];
  trigerStyle?: ViewStyle;
  children?: any;
  removeFromPlaylistId?: string;
  onOptionSelected?: () => void;
}

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

const MenuPopup: React.FC<MenuPopupProps> = ({ navigation, songs, children, trigerStyle, removeFromPlaylistId = '', onOptionSelected }) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);

  const { artistList, deleteSong, removeSongsFromPlaylist } = useSongs();

  const handleGoToAlbum = useCallback((song: MusicFile) => {
    onOptionSelected && onOptionSelected();

    navigation.navigate('AlbumPage',{
      album: {
        name: song.album,
        cover: song.cover,
      },
      artist: song.author,
    })
  }, []);

  const handleGoToArtist = useCallback((song: MusicFile) => {
    onOptionSelected && onOptionSelected();

    const artist = artistList.find(a => a.artist == song.author);

    if(artist){
      const {numberOfAlbums, numberOfSongs, albums} = artist;

      navigation.jumpTo('ArtistPage', {
        albums,
        name: artist.artist,
        numberOfAlbums,
        numberOfSongs,
      });
    }else{
      console.log("Artist not found (songList - handleGoToArtist)")
    }

  }, [artistList]);

  const handleDeleteSong = useCallback(() => {
    Alert.alert(
      "Excluir Música",
      `Você tem certeza que queres excluir a música${songs[0].title}${songs.length == 2 ? ` e ${songs[1].title}`: songs.length > 2 ? ` e outras ${songs.length - 1} músicas` : null}? ${Platform.OS === 'android' ? '\n\nATENÇÃO: Caso esteja rodando uma versão maior do que o Android 5, não será possível excluir músicas que provém de algum dispositivo externo (Cartão SD). Deseja mesmo continuar?': ''}`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Ação cancelada"),
          style: "cancel"
        },
        { 
          text: "Sim", 
          onPress: () => {
            onOptionSelected && onOptionSelected(); 
            deleteSong(songs);
          },
        }
      ],
      { cancelable: false }
    );
  }, [songs]);
  
  const handleDeleteSongsFromPlaylist = useCallback(() => {
    Alert.alert(
      "Remover Músicas",
      `Você tem certeza que queres excluir a música ${songs[0].title}${songs.length == 2 ? `e ${songs[1].title}`: songs.length > 2 ? `e outras ${songs.length - 1} músicas` : ''} da playlist?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Ação cancelada"),
          style: "cancel"
        },
        { 
          text: "Sim", 
          onPress: () => {
            onOptionSelected && onOptionSelected();
            removeSongsFromPlaylist(songs, removeFromPlaylistId);
          },
        }
      ],
      { cancelable: false }
    );
  }, [songs, removeFromPlaylistId]);

  return (
    <MenuContainer>
      <CreatePlaylistModal active={isModalActive} onClose={() => {setIsModalActive(false)}} songs={songs}/>
      <Menu>
        <MenuTrigger>
          <View style={{justifyContent: 'center', alignItems: 'center', width: 30, ...trigerStyle}} >
            { children }
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{
          optionsContainer: {
            backgroundColor: '#151515',
            width: 150,
          },
        }}>
          { songs.length == 1
          ?(
            <>
              <MenuOption onSelect={() => {handleGoToAlbum(songs[0])}}>
                <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
                  <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Album </Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => {handleGoToArtist(songs[0])}}>
                <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
                  <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Artista </Text>
                </View>
              </MenuOption>
            </>
            )
            : null
          }
          {
            removeFromPlaylistId != ''
              ?(
                <MenuOption onSelect={handleDeleteSongsFromPlaylist}>
                  <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
                    <Text style={{color: '#e5e5e5', fontSize: 15}}>Remover da Playlist</Text>
                  </View>
                </MenuOption>
              )
              : (
                <MenuOption onSelect={() => {navigation.navigate('PlaylistList', {selectionMode: true, songs: songs})}}>
                  <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
                    <Text style={{color: '#e5e5e5', fontSize: 15}}>Adicionar para playlist...</Text>
                  </View>
                </MenuOption>
              )
          }
          <MenuOption onSelect={handleDeleteSong}>
            <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
              <Text style={{color: '#e5e5e5', fontSize: 15}}>{songs.length > 1 ? 'Excluir Músicas' : 'Excluir Música'}</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </MenuContainer>
  );
};

export default React.memo(MenuPopup);