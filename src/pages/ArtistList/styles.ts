import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const Header = styled.View`
  position: absolute;
  background-color: #111;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom-width: 2px;  
  border-bottom-color: #50f; 
  height: 50px;
  width: 100%;
  z-index: 10;
`;  

export const Title = styled.Text`
  color: #e5e5e5;
  font-size: 20px;
  font-weight: bold;
`;


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

export const ArtistInfoContainer = styled.View`
  height: 40px;
  width: 100%;
  background-color: #1D1D1D;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const ArtistName = styled.Text`
  color: #e5e5e5;
`;

export const Cover = styled.Image`
  height: 83px;
  width: 83px;
`

export const EmptyAlbumCover = styled.View`
  height: 83px;
  width: 83px;
  justify-content: center;
  align-items: center;
  background-color: #252525;
`;

export const Content = styled.View`
  margin: 15px;
  align-items: center;
  ${ Platform.OS == 'android' ? (css`padding-bottom: 30px `) : null}
`;