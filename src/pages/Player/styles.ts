import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
  align-items: center;
  justify-content: center;
`;

export const AlbumCover = styled.Image`
  height: 250px;
  width: 250px;
  border-radius: 15px;
`;

export const SongTitleContainer = styled.View`
  width: 300px;
`

export const SongTitle = styled(TextTicker)`
  color: #e5e5e5;
  margin-top: 30px;
  margin-bottom: 5px;
  font-size: 30px;
  overflow: hidden;
`;

export const ArtistName = styled.Text`
  color: #a5a5a5;
  font-size: 15px;
`;

export const CurrentSongPostition = styled.Text`
  color: #656565;
`

export const SongDuration = styled.Text`
  color: #656565;
`

export const IconContainer = styled.View`
  flex-direction: row;
`;

export const TimeContainer = styled.View`
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  margin-top: 30px;
`;

