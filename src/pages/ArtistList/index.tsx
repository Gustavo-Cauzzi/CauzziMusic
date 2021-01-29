import React, { useCallback } from 'react';
import IconFeather from 'react-native-vector-icons/Feather';

import { View } from 'react-native';

import { Container, Content, Header, Title } from './styles';
import { useSongs } from '../../hooks/songs';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { iArtist } from '../../@types/iArtist';
import Artist from '../../components/Artist';
interface ArtistListProps {
  navigation?: any;
}

const HEADER_HEIGHT = 50;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList as new () => FlatList<iArtist>)

const ArtistList: React.FC<ArtistListProps> = ({ navigation }) => {
  const { artistList } = useSongs();

  const scroll = new Animated.Value(0);
  const animatedScroll = Animated.multiply(Animated.diffClamp(scroll, 0, HEADER_HEIGHT), -1);

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
      <Header as={Animated.View} style={[{transform: [{translateY: animatedScroll}]}]}>
        <IconFeather name="menu" size={25} color="#FFF" onPress={handleOpenDrawerMenu} />
        <Title>Lista de Artistas</Title>
        <View style={{width: 25}}/>
      </Header>
      <SafeAreaView>
        <Content>
        <AnimatedFlatList
          data={artistList}
          keyExtractor={(_: any, i: number) => String(i)}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scroll}}}],
            {useNativeDriver: true},
          )}
          ListHeaderComponent={() => (
            <View style={{flex: 1, height: 50 + 5}}/> // absolute header compensation
          )}
          getItemLayout={(_: any, index: number) => (
            { length: 133, offset: (133 * index) + 55, index }
          )}
          renderItem={({item: artist}: {item: iArtist}) => (
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
