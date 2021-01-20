import React, { useCallback } from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import IconEntypo from 'react-native-vector-icons/Entypo';

import { MenuContainer } from './styles';
import { Alert, Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useSongs } from '../../hooks/songs';

interface MenuPopupProps {
  navigation?: any;
  song: MusicFile;
  trigerStyle?: ViewStyle;
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

const MenuPopup: React.FC<MenuPopupProps> = ({ navigation, song, children, trigerStyle }) => {
  const { artistList, deleteSong } = useSongs();

  const handleGoToAlbum = useCallback((song: MusicFile) => {
    navigation.navigate('AlbumPage',{
      album: {
        name: song.album,
        cover: song.cover,
      },
      artist: song.author,
    })
  }, []);

  const handleGoToArtist = useCallback((song: MusicFile) => {
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

  const handleDeleteSong = useCallback((song: MusicFile) => {
    Alert.alert(
      "Excluir Música",
      `Você tem certeza que queres excluir a música ${song.title}? ${Platform.OS === 'android' ? '\n\nATENÇÃO: Caso esteja rodando uma versão maior do que o Android 5, não será possível excluir músicas que provém de algum dispositivo externo (Cartão SD). Deseja mesmo continuar?': ''}`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Ação cancelada"),
          style: "cancel"
        },
        { 
          text: "Sim", 
          onPress: () => deleteSong(song),
        }
      ],
      { cancelable: false }
    );
  }, []);
  
  return (
    <MenuContainer>
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
          <MenuOption onSelect={() => {handleGoToAlbum(song)}}>
            <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
              <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Album </Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => {handleGoToArtist(song)}}>
            <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
              <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Artista </Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => {handleDeleteSong(song)}}>
            <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
              <Text style={{color: '#e5e5e5', fontSize: 15}}> Excluir música </Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </MenuContainer>
  );
};

export default MenuPopup;
