import React, { PureComponent, useCallback, useState } from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import { MenuContainer } from './styles';
import { Alert, Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useSongs } from '../../hooks/songs';
import CreatePlaylistModal from '../CreatePlaylistModal';

interface MenuPopupProps {
  navigation?: any;
  songs: MusicFile[];
  trigerStyle?: ViewStyle;
  children?: any;
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

const MenuPopup: React.FC<MenuPopupProps> = ({ navigation, songs, children, trigerStyle }) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);

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
          onPress: () => deleteSong(songs),
        }
      ],
      { cancelable: false }
    );
  }, [songs]);
  
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
          <MenuOption onSelect={() => {setIsModalActive(true)}}>
            <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
              <Text style={{color: '#e5e5e5', fontSize: 15}}>Adicionar para playlist...</Text>
            </View>
          </MenuOption>
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

// export class MenuPopup extends PureComponent<MenuPopupProps> {
//   handleGoToAlbum(song: MusicFile){
//     const { navigation } = this.props;

//     navigation.navigate('AlbumPage',{
//       album: {
//         name: song.album,
//         cover: song.cover,
//       },
//       artist: song.author,
//     })
//   }

//   handleGoToArtist(song: MusicFile){
//     const { navigation, artistList } = this.props;

//     const artist = artistList.find(a => a.artist == song.author);

//     if(artist){
//       const {numberOfAlbums, numberOfSongs, albums} = artist;

//       navigation.jumpTo('ArtistPage', {
//         albums,
//         name: artist.artist,
//         numberOfAlbums,
//         numberOfSongs,
//       });
//     }else{
//       console.log("Artist not found (songList - handleGoToArtist)")
//     }
//   }

//   handleDeleteSong(song: MusicFile){
//     const { deleteSong } = this.props;

//     Alert.alert(
//       "Excluir Música",
//       `Você tem certeza que queres excluir a música ${song.title}? ${Platform.OS === 'android' ? '\n\nATENÇÃO: Caso esteja rodando uma versão maior do que o Android 5, não será possível excluir músicas que provém de algum dispositivo externo (Cartão SD). Deseja mesmo continuar?': ''}`,
//       [
//         {
//           text: "Cancelar",
//           onPress: () => console.log("Ação cancelada"),
//           style: "cancel"
//         },
//         { 
//           text: "Sim", 
//           onPress: () => deleteSong(song),
//         }
//       ],
//       { cancelable: false }
//     );
//   }

//   render(){
//     const { children, trigerStyle, song } = this.props;
//     return (
//       <MenuContainer>
//       <Menu>
//           <MenuTrigger>
//             <View style={{justifyContent: 'center', alignItems: 'center', width: 30, ...trigerStyle}} >
//               { children }
//             </View>
//           </MenuTrigger>
//           <MenuOptions customStyles={{
//             optionsContainer: {
//               backgroundColor: '#151515',
//               width: 150,
//             },
//           }}>
//             <MenuOption onSelect={() => {this.handleGoToAlbum(song)}}>
//               <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
//                 <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Album </Text>
//               </View>
//             </MenuOption>
//             <MenuOption onSelect={() => {this.handleGoToArtist(song)}}>
//               <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
//                 <Text style={{color: '#e5e5e5', fontSize: 15}}> Ir para Artista </Text>
//               </View>
//             </MenuOption>
//             <MenuOption onSelect={() => {this.handleDeleteSong(song)}}>
//               <View style={{padding: 10, borderLeftColor: "#50f", borderLeftWidth: 2}}>
//                 <Text style={{color: '#e5e5e5', fontSize: 15}}> Excluir música </Text>
//               </View>
//             </MenuOption>
//           </MenuOptions>
//         </Menu>
//       </MenuContainer>
//     )
//   }
// }