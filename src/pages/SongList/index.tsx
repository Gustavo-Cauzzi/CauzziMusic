import React, { useCallback } from 'react';
import { Alert, Dimensions, FlatList, Text, View, Platform } from 'react-native';
import { useSongs } from '../../hooks/songs';

import IconFeather from 'react-native-vector-icons/Feather';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';

import {
  ArtistName,
  Container,
  Content,
  Header,
  SongAlbumCover,
  SongContainer,
  SongInfo,
  SongName,
  Title,
  SongAlbumCoverPlaceHolder,
  SongTriger,
  MenuContainer,
  ShuffleButton,
  ShuffleIconContainer,
  ShuffleText,
} from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { SongNameTicker } from '../AlbumPage/styles';
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

interface SongListProps {
  navigation?: any;
}

const screenWidth = Dimensions.get('window').width;

const SongList: React.FC<SongListProps> = ({ navigation }) => {
  const {songList, playSong, changeShuffleValue, setNeedToRefreshShuffleButton, artistList, deleteSong} = useSongs();

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer()
  }, [navigation]);

  const handleIniciateShufflePlaylist = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * songList.length);
    playSong(songList[randomIndex]);
    changeShuffleValue(true);
    setNeedToRefreshShuffleButton(true);

    const {id, title, path, author, cover, duration, album} = songList[randomIndex];
    
    navigation.jumpTo('Player', {
      id,
      title,
      path,
      author,
      cover,
      duration,
      album,
    })
  }, [songList]);

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

  

  const handlePlayMusic = useCallback((song: MusicFile) => {
    playSong(song);    

    const {id, title, path, author, cover, duration, album} = song;
    
    navigation.jumpTo('Player', {
      id,
      title,
      path,
      author,
      cover,
      duration,
      album,
    })
  }, []);

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

  const handleNavigateToSearchPage = useCallback(() => {
    navigation.navigate('SearchPage');
  }, []);

  return (
    <Container>
      <Header>
        <IconFeather name="menu" size={25} color="#FFF" onPress={handleOpenDrawerMenu}/>
        <Title>Lista de Músicas</Title>
        <IconMaterialCommunityIcons name="magnify" size={25} color="#fff" onPress={handleNavigateToSearchPage}/>
      </Header>
      <Content>
        <SafeAreaView>
        <FlatList
          data={songList}
          maxToRenderPerBatch={30}
          keyExtractor={(song) => String(song.id)}
          getItemLayout={(_, index) => (
            { length: 70, offset: 70 * index + 1, index }
          )}
          ListHeaderComponent={() => (
            <ShuffleButton onPress={handleIniciateShufflePlaylist}>
              <ShuffleIconContainer>
                <IconIonicons name="shuffle" size={27.5} color="#fff"/>
              </ShuffleIconContainer>
              <ShuffleText>Aleatório</ShuffleText>
            </ShuffleButton>
          )}
          renderItem={({item: song}) => (
            <SongContainer key={song.id}>
              <SongTriger onPress={() => {handlePlayMusic(song)}}>
                {song.cover 
                  ? <SongAlbumCover source={{uri: `${song.cover}`}}/>
                  : (
                    <SongAlbumCoverPlaceHolder>
                      <IconFontisto name="music-note" color="#fff" size={20}/>    
                    </SongAlbumCoverPlaceHolder>
                  )
                }
                <SongInfo>
                  {
                    song.title.length < 39
                      ? <SongName>{song.title}</SongName>
                      : (
                        <View
                          style={{width: screenWidth - 125}}
                        >
                          <SongNameTicker
                            duration={15000}
                            repeatSpacer={50}
                            marqueeDelay={1000}
                          >
                            {song.title}
                          </SongNameTicker>
                        </View>
                      )
                  }
                  <ArtistName>{song.author != '<unknown>' ? song.author : 'Desconhecido'}</ArtistName>
                </SongInfo>
              </SongTriger>
                <MenuContainer>
                  <Menu>
                    <MenuTrigger>
                      <IconEntypo 
                        name="dots-three-vertical" 
                        size={20} 
                        color="#bbb" 
                      />
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
            </SongContainer>
          )}
        />
        </SafeAreaView>
      </Content>
    </Container>
  );
};

export default SongList;
