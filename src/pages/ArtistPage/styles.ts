import { Dimensions } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled, { css } from 'styled-components/native';

const screenWidth = Dimensions.get('window').width;

interface GoBackContainerProps {
  isVisible: boolean;
}

export const Container = styled.View`
  background-color: #111;
  flex: 1;
`;

export const RandomCoverAlbum = styled.Image`
  position: absolute;
  width: ${screenWidth}px;
  height: ${screenWidth}px;
  top: 0px;
  left: 0px;
  z-index: -10;
`;

export const Content = styled.View`
  flex: 1;
  padding: 10px 15px;
`;

export const ArtistInfo = styled.View`
  background-color: #222;
  width: 100%;
  height: 75px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ArtistName = styled.Text`
  color: #fff;
  font-size: 28px;
`;

export const NumberOfSongs = styled.Text`
  color: #666;
  font-size: 9px;
  right: 20px;
  bottom: -19px;
`;

export const CurrentAlbumText = styled.Text`
  color: #aaa;
  font-size: 10px;
`;

export const RandomAlbumNameTicker = styled(TextTicker)`
  color: #aaa;
  font-size: 10px;
  margin-left: 2px;
`;

export const ArtistNameContainer = styled.View`
  margin-left: 20px;
  flex-direction: column;
`;

export const CoverOverlay = styled.View`  
  background-color: #111;
`;

export const BackgroundColor = styled.View`  
  height: 75px;
  background-color: #111;
`;

export const EmptyAlbumCover = styled.View`
  position: absolute;
  height: ${screenWidth}px;
  width: ${screenWidth}px;
  justify-content: center;
  align-items: center;
  background-color: #252525;
  top: 0px;
  left: 0px;
  z-index: -10;
`;

export const AlbumContainer = styled.View`
  margin: 5px 5px;
  width: ${(screenWidth - 50) / 2}px;
  height: ${((screenWidth - 50) / 2) + 50}px;
`;

export const AlbumCover = styled.Image`
  width: ${(screenWidth - 50) / 2}px;
  height: ${(screenWidth - 50) / 2}px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

export const AlbumInfoContainer = styled.View`
  flex: 1;
  background-color: #222;
  justify-content: center;
  align-items: center;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  padding: 0px 10px;
`;

export const AlbumName = styled.Text`
  color: #e5e5e5;
  font-size: 15px;
`;
export const SmallEmptyAlbumCover = styled.View`
  width: ${(screenWidth - 50) / 2}px;
  height: ${(screenWidth - 50) / 2}px;
  justify-content: center;
  align-items: center;
  background-color: #252525;
`;

export const AlbumNameTicker = styled(TextTicker)`
  color: #e5e5e5;
  font-size: 15px;
`;

export const GoBackContainer = styled(RectButton)<GoBackContainerProps>`
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0.9;
  background-color: #222;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
  border-radius: 17.5px;
  z-index: 10;
  /* transition: opacity 0.2s; */

  ${props => !props.isVisible ? css`opacity: 0` : css`opacity: 0.8`}
`;