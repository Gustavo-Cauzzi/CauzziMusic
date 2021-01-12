import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconAntDesing from 'react-native-vector-icons/AntDesign';

import { ArtistInfo, Container, RandomCoverAlbum, Content, ArtistName, ArtistNameContainer, CurrentAlbumText, EmptyAlbumCover, CoverOverlay, AlbumContainer, AlbumCover, AlbumInfoContainer, AlbumName, SmallEmptyAlbumCover, AlbumNameTicker, NumberOfSongs, RandomAlbumNameTicker, GoBackContainer, BackgroundColor } from './styles';

interface Album {
  album: string | undefined;
  cover: string | undefined;
}

interface Artist {
  albums: Album[];
  name: string;
  numberOfAlbums: number;
  numberOfSongs: number;
}

interface ArtistPageProps {
  artist?: Artist;
  navigation?: any;
}

const ArtistPage: React.FC<ArtistPageProps> = ({ navigation }) => {
  const [currentArtist, setCurrentArtist] = useState<Artist>({} as Artist);
  const [currentRandomAlbum, setCurrentRandomAlbum] = useState<Album>({} as Album);
  const [isGoBackVisible, setIsGoBackVisible] = useState(true);

  const maxAlbumNameAlbumContainer = 16;
  const maxAlbumNameArtistInfo = 37;

  const screenWidth = Dimensions.get('window').width;
  
  const route = useRoute();
  let routeParams = route.params as Artist;
  
  useEffect(() => {
    routeParams = route.params as Artist;
    setCurrentArtist(routeParams as Artist);
    if (!routeParams.albums) return;
    
    const hasOnlyUndefined = routeParams.albums.findIndex(a => a.cover != undefined);
    if (hasOnlyUndefined == -1) {
      setCurrentRandomAlbum({
        album: undefined,
        cover: undefined,
      });
      return;
    };

    let randomIndex = Math.floor(Math.random() * routeParams.albums.length);
    while(routeParams.albums[randomIndex].cover == undefined){
      randomIndex = Math.floor(Math.random() * routeParams.albums.length);
    }
  
    setCurrentRandomAlbum(routeParams.albums[randomIndex])
  }, [route.params]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <Container>
      {
        currentRandomAlbum.cover != undefined
          ? <RandomCoverAlbum source={{uri: currentRandomAlbum.cover}}/>
          : (
            <EmptyAlbumCover>
              <IconFontisto name="music-note" color="#fff" size={screenWidth / 4}/>
            </EmptyAlbumCover>
          )
      } 
      <GoBackContainer onPress={handleGoBack} isVisible={isGoBackVisible}>
        <IconAntDesing name="arrowleft" size={20} color="#fff"/>
      </GoBackContainer>
      <FlatList
        data={currentArtist.albums}
        keyExtractor={album => `${album.album}${album.cover}`}
        numColumns={2}
        onScroll={(scroll) => {
          if(!isGoBackVisible && scroll.nativeEvent.contentOffset.y < screenWidth - 40){
            setIsGoBackVisible(true);
          }else if(isGoBackVisible && scroll.nativeEvent.contentOffset.y >= screenWidth - 40){
            setIsGoBackVisible(false);
          }
        }}
        columnWrapperStyle={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: '#111',
        }}
        ListHeaderComponent={() => (
          <>
            <View style={{
              width: screenWidth,
              height: screenWidth - 40,
              marginTop: 40,
            }}>
              
              </View>
            <BackgroundColor>
              <ArtistInfo>
                <ArtistNameContainer>
                  <ArtistName>
                    {currentArtist.name}
                  </ArtistName>
                    {
                      currentRandomAlbum.album && currentRandomAlbum.album.length < maxAlbumNameArtistInfo
                        ? <CurrentAlbumText> Album: {currentRandomAlbum.album} </CurrentAlbumText>
                        : (
                          <View style={{flexDirection: 'row'}}>
                          <CurrentAlbumText> Album: </CurrentAlbumText>
                            <View style={{ 
                              width: screenWidth * 0.62,
                            }}>
                            <RandomAlbumNameTicker
                              duration={15000}
                              repeatSpacer={50}
                              marqueeDelay={1000}
                            > 
                              {currentRandomAlbum.album}
                            </RandomAlbumNameTicker>
                          </View>
                          </View>
                        )
                    }
                </ArtistNameContainer>
                <NumberOfSongs>
                  Músicas: {currentArtist.numberOfSongs}
                </NumberOfSongs>
              </ArtistInfo>
            </BackgroundColor>
          </>
        )}
        renderItem={({item: album}) => (
          <AlbumContainer>
            {
              album.cover
                ? <AlbumCover source={{uri: album.cover}} />
                : (
                  <SmallEmptyAlbumCover>
                    <IconFontisto name="music-note" color="#fff" size={25}/>
                  </SmallEmptyAlbumCover>
                )
            }
            <AlbumInfoContainer>
              {album.album && album.album.length < maxAlbumNameAlbumContainer
                ? <AlbumName> {album.album} </AlbumName>
                : (
                  <AlbumNameTicker
                    duration={15000}
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  > 
                    {album.album}
                  </AlbumNameTicker>
                )
              }
            </AlbumInfoContainer>
          </AlbumContainer>
        )}
      />
    </Container>
  );
};

export default ArtistPage;
