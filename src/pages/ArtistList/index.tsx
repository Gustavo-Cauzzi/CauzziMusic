import React, { useCallback } from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontisto from 'react-native-vector-icons/Fontisto';

import { View } from 'react-native';

import { ArtistContainer, ArtistInfoContainer, ArtistName, Container, Content, Cover, CoversContainers, EmptyAlbumCover, Header, Title } from './styles';
import { useSongs } from '../../hooks/songs';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Artist from '../../components/Artist';
interface ArtistListProps {
  navigation?: any;
}

interface  Album {
  album: string | undefined;
  cover: string | undefined;
}

const ArtistList: React.FC<ArtistListProps> = ({ navigation }) => {
  const { artistList } = useSongs();

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const handleGoToArtistPage = useCallback((artist) => {
    const {numberOfAlbums, numberOfSongs, albums} = artist;

    navigation.jumpTo('ArtistPage', {
      albums,
      name: artist.artist,
      numberOfAlbums,
      numberOfSongs,
    })
  }, []);

  return (
    <Container>
      <Header>
        <IconFeather name="menu" size={25} color="#FFF" onPress={handleOpenDrawerMenu} />
        <Title>Lista de Artistas</Title>
        <View style={{width: 25}}/>
      </Header>
      <SafeAreaView>
        <Content>
        <FlatList
          data={artistList}
          maxToRenderPerBatch={30}
          keyExtractor={(_, i) => String(i)}
          getItemLayout={(_, index) => (
            { length: 133, offset: 133 * index, index }
          )}
          renderItem={({item: artist}) => (
            <Artist
              artist={artist}
              onPress={() => {handleGoToArtistPage(artist)}}
            />
            )}
          />
        </Content>
      </SafeAreaView>
    </Container>
  );
};

export default ArtistList;
