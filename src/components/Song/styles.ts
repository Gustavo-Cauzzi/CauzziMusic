import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const SongContainer = styled.View`
  height: 40px;
  border-left-width: 2px;  
  border-left-color: rgba(85, 0, 255, 0.5);
  flex-direction: row;
  margin: 5px 0px;
`;

export const SongTriger = styled(RectButton)`
  flex-direction: row;
  padding: 0px 10px;
  align-items: center;
  flex: 1;
  align-self: stretch;
`;

export const SongInfo = styled.View`
`;

export const SongAlbumCover = styled(FastImage)`
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