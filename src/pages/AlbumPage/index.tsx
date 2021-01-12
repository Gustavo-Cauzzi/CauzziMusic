import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import IconAntDesing from 'react-native-vector-icons/AntDesign';
import IconFontisto from 'react-native-vector-icons/Fontisto';

import { 
  AlbumCover,
  AlbumInfo,
  AlbumInfoContainer,
  AlbumName,
  AlbumNameTicker,
  ArtistName,
  ArtistNameTicker,
  Container,
  Content,
  GoBackContainer, 
  SongAlbumCover, 
  SongAlbumCoverPlaceHolder, 
  SongContainer,
  SongInfo,
  SongName,
  SongNameTicker
} from './styles';
import { FlatList, Text, View } from 'react-native';
import { useSongs } from '../../hooks/songs';

interface Album {
  album: {
    name: string | undefined;
    cover: string | undefined;
  };
  artist: string;
}

interface MusicFile{
  id: number,
  title: string,
  author: string,
  album: string,
  duration : number,
  cover: string | undefined,
  path: string
}

interface AlbumPageProps {
  navigation?: any;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ navigation }) => {
  const [currentAlbum, setCurrentAlbum] = useState<Album>();
  const [currentSongs, setCurrentSongs] = useState<MusicFile[]>([] as MusicFile[]);
  const { songList, playSong } = useSongs();

  const maxAlbumName = 13;
  const maxArtistName = 26;
  const maxSongName = 34;

  const route = useRoute();
  let routeParams = route.params as Album;

  useEffect(() => {
    routeParams = route.params as Album;
    setCurrentAlbum(routeParams as Album);

    if(routeParams != undefined){
      const songsFromAlbum = songList.filter(s => s.author.toLowerCase() == routeParams.artist.toLowerCase() && s.album.toLowerCase() == routeParams.album.name!.toLowerCase());
      console.log('songsFromAlbum: ',songsFromAlbum);
      setCurrentSongs(songsFromAlbum);
    }
  }, [route.params]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handlePlayMusic = useCallback((song: any) => {
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
  
  return (
    <Container>
      <GoBackContainer onPress={handleGoBack}>
        <IconAntDesing name="arrowleft" size={20} color="#fff"/>
      </GoBackContainer>
      <AlbumInfoContainer>
        <AlbumInfo>
          {
            currentAlbum != undefined
              ? <AlbumCover source={{uri: currentAlbum.album.cover}}/>
              : null
          }
          {
            currentAlbum != undefined && currentAlbum.album.name && currentAlbum.artist
              ? (
                <View style={{marginLeft: 10}}>
                  {currentAlbum.album.name 
                    ? currentAlbum.album.name.length <= maxAlbumName
                      ? <AlbumName>{currentAlbum.album.name}</AlbumName>
                      : (
                        <AlbumNameTicker
                          duration={15000}
                          repeatSpacer={50}
                          marqueeDelay={1000}
                        > 
                          {currentAlbum.album.name}
                        </AlbumNameTicker>
                      )
                    : <AlbumName>Desconhecido</AlbumName>
                  }
                  {
                    currentAlbum.artist
                      ? currentAlbum.artist.length <= maxArtistName
                        ? <ArtistName>{currentAlbum.artist}</ArtistName>
                        : (
                          <ArtistNameTicker
                            duration={15000}
                            repeatSpacer={50}
                            marqueeDelay={1000}
                          >
                            {currentAlbum.artist}
                          </ArtistNameTicker>
                        )
                      : <ArtistName>Desconhecido</ArtistName>
                  }
                </View>
              )
              : null
          }
        </AlbumInfo>
      </AlbumInfoContainer>
      <Content>
        <FlatList
          data={currentSongs}
          maxToRenderPerBatch={30}
          keyExtractor={(song) => String(song.id)}
          getItemLayout={(_, index) => (
            { length: 70, offset: 70 * index, index }
          )}
          renderItem={({item: song}) => (
            <SongContainer key={song.id} onPress={() => {handlePlayMusic(song)}}>
              {song.cover 
                ? <SongAlbumCover source={{uri: `${song.cover}`}}/>
                : (
                  <SongAlbumCoverPlaceHolder>
                    <IconFontisto name="music-note" color="#fff" size={20}/>    
                  </SongAlbumCoverPlaceHolder>
                )
              }
              <SongInfo>
                {song.title && song.title.length <= maxSongName
                  ? <SongName>{song.title}</SongName>
                  : (
                    <SongNameTicker
                    duration={15000}
                    repeatSpacer={50}
                    marqueeDelay={1000}
                    >
                      {song.title}
                    </SongNameTicker>
                  )
                }
                <ArtistName>{song.author != '<unknown>' ? song.author : 'Desconhecido'}</ArtistName>
              </SongInfo>
            </SongContainer>
          )}
        />
      </Content>
    </Container>
  );
};

export default AlbumPage;
