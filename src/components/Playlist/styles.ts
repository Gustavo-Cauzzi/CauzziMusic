import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

export const Container = styled(RectButton)`
  height: 130px;
  width: 100px;
  margin-right: 10px;
  background-color: #1a1a1a;
`;

export const AlbumContainer = styled.View`
  flex: 1;
  height: 100px;
`;

export const AlbumCover = styled.Image`
  height: 50px;
  width: 50px;
`;

export const PlaylistNameContainer = styled.View`
  height: 30px;
  border-top-width: 1px;
  border-top-color: #50f;
  justify-content: center;
  align-items: center;
  padding: 0px 5px;
`;

export const PlaylistName = styled.Text`
  color: #d5d5d5;
  font-size: 12px;
  font-family: 'Roboto Slab Regular';
`;

export const PlaylistNameTicker = styled(TextTicker)`
  color: #d5d5d5;
  font-family: 'Roboto Slab Regular';
`;
