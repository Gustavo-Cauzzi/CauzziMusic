import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const ArtistContainer = styled(RectButton)`
  width: 100%;
  height: 123px;
  margin-bottom: 10px;
`;

export const CoversContainers = styled.View`
  height: 83px;
  width: 100%;
  background-color: #111;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-direction: row;
`;

export const ArtistName = styled.Text`
  color: #e5e5e5;
`;

export const Cover = styled.Image`
  height: 83px;
  width: 83px;
`

export const ArtistInfoContainer = styled.View`
  height: 40px;
  width: 100%;
  background-color: #1D1D1D;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  align-items: center;
  justify-content: center;
`;