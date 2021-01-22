import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const SongContainer = styled.View`
  height: 50px;
  border-left-width: 2px;  
  border-left-color: rgba(85, 0, 255, 0.5);
  flex-direction: row;
  margin: 5px 0px;
`;

export const SongTriger = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
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