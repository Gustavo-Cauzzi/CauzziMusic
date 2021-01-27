import TextTicker from 'react-native-text-ticker';
import styled, { css } from 'styled-components/native';

interface orientationProps {
  orientation?: 'landscape' | 'portrait';
}
interface SongTitleContainer {
  text: string;
  maxTextLenght: number;
}

export const Container = styled.View<orientationProps>`
  flex: 1;
  background-color: #000;
  align-items: center;
  justify-content: center;

  /* ${props => props.orientation == 'landscape' ? css`flex-direction: row;` : null} */
`;

export const AlbumCover = styled.Image`
  height: 250px;
  width: 250px;
  border-radius: 15px;
`;


export const SongTitleTicker = styled(TextTicker)`
  color: #e5e5e5;
  margin-top: 30px;
  margin-bottom: 5px;
  font-size: 30px;
`;

export const SongTitle = styled.Text`
  color: #e5e5e5;
  margin-top: 30px;
  margin-bottom: 5px;
  font-size: 30px;
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

export const IconFooter = styled.View`
  flex-direction: row;
  width: 125px;
  justify-content: space-between;
  position: absolute;
  bottom: 20px;
`;

export const SongTitleContainer = styled.View<SongTitleContainer>`
  width: 300px;
  ${props => props.text.length > props.maxTextLenght ? null : css`align-items: center`}
`;