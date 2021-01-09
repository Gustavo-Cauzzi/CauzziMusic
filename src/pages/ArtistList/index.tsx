import React from 'react';

import { Text } from 'react-native';

import { Container } from './styles';

const ArtistList: React.FC = () => {
  return (
    <Container>
      <Text style={{color: "#fff"}}>ArtistList</Text>
      <Text style={{color: "#fff"}}>work in progress...</Text>
      <Text style={{color: "#fff", fontSize: 10, marginTop: 10}}>by Gustavo 😊</Text>
    </Container>
  );
};

export default ArtistList;
