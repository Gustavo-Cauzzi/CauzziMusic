import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { Text } from 'react-native';

import { Container } from './styles';

interface Album {
  album: {
    name: string | undefined;
    cover: string | undefined;
  };
  artist: string;
}

const AlbumPage: React.FC = () => {
  const [currentAlbum, setCurrentAlbum] = useState<Album>({} as Album);

  const route = useRoute();
  let routeParams = route.params as Album;

  useEffect(() => {
    console.log(routeParams);
    setCurrentAlbum(routeParams);
  }, [route.params]);

  return (
    <Container>
    </Container>
  );
};

export default AlbumPage;
