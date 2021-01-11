import React, { useCallback } from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontisto from 'react-native-vector-icons/Fontisto';


import { View } from 'react-native';

import { ArtistContainer, ArtistInfoContainer, ArtistName, Container, Content, Cover, CoversContainers, EmptyAlbumCover, Header, Title } from './styles';
import { useSongs } from '../../hooks/songs';
import { FlatList } from 'react-native-gesture-handler';
interface ArtistListProps {
  navigation?: any;
}

interface  Album {
  album: string | undefined;
  cover: string | undefined;
}

const ArtistList: React.FC<ArtistListProps> = ({ navigation }) => {
  const { artistList } = useSongs();

  const numberOfCoversPerArtist = [0, 1, 2, 3];

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <Container>
      <Header>
        <IconFeather name="menu" size={25} color="#FFF" onPress={handleOpenDrawerMenu} />
        <Title>Lista de Artistas</Title>
        <View style={{width: 25}}/>
      </Header>
      <Content>
      <FlatList
          data={artistList}
          maxToRenderPerBatch={30}
          keyExtractor={(_, i) => String(i)}
          getItemLayout={(_, index) => (
            { length: 133, offset: 133 * index, index }
          )}
          renderItem={({item: artist}) => (
            <ArtistContainer>
              <CoversContainers>
                {
                  numberOfCoversPerArtist.map(i => (
                    artist.albums[i] != undefined
                      ? (
                        <Cover 
                          key={`${artist.artist}${i}`}
                          source={{uri: `${artist.albums[i].cover}`}} 
                          style={{
                            borderTopLeftRadius: i == 0 ? 10 : 0,
                            borderTopRightRadius: i == 3 ? 10 : 0,
                          }}
                        />
                      )
                      : (
                        <EmptyAlbumCover
                          key={`${artist.artist}${i}`}
                          style={{
                            borderTopLeftRadius: i == 0 ? 10 : 0,
                            borderTopRightRadius: i == 3 ? 10 : 0,
                          }}
                        >
                          <IconFontisto name="music-note" color="#fff" size={20}/>    
                        </EmptyAlbumCover>
                      )
                  ))
                }
              </CoversContainers>
              <ArtistInfoContainer>
                <ArtistName>
                  {artist.artist == '<unknown>' ? 'Desconhecido' : artist.artist}
                </ArtistName>
              </ArtistInfoContainer>
            </ArtistContainer>
          )}
        />
      </Content>
    </Container>
  );
};

export default ArtistList;

{/* <EmptyAlbumCover>
  <IconFontisto name="music-note" color="#fff" size={20}/>    
</EmptyAlbumCover> */}

/*

<ArtistContainer>
  <CoversContainers>
    
  </CoversContainers>
  <ArtistInfoContainer>

  </ArtistInfoContainer>
</ArtistContainer>

*/