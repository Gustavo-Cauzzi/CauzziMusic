import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

export const SongContainer = styled.View`
  background-color: #1a1a1a;
  margin: 5px 0;
  border-radius: 5px;
  flex-direction: row;
`;

export const SongTriger = styled(RectButton)`
  flex: 1;
  padding: 5px 5px;
  flex-direction: row;
  align-items: center;
`;

export const SongInfo = styled.View`
`;

export const SongAlbumCover = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 5px;
`;

export const SongAlbumCoverPlaceHolder = styled.View`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  background-color: #252525;
`;

export const SongNameTicker = styled(TextTicker)`
  font-family: 'Roboto Slab Regular';
  color: #e5e5e5;
`;

export const SongName = styled.Text`
  font-family: 'Roboto Slab Regular';
  color: #e5e5e5;
`;

export const ArtistName = styled.Text`
  color: #a5a5a5;
  font-size: 12px;
  font-family: 'Karla Regular';
`;