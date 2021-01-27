import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

export const Header = styled.View`
  background-color: #111;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom-width: 2px;  
  border-bottom-color: #50f; 
  height: 50px;
`;  

export const Title = styled.Text`
  color: #e5e5e5;
  font-size: 20px;
  font-family: 'Roboto Slab Bold';
`;

export const PlaylistContainer = styled(RectButton)`
  height: 190px;
  width: 150px;
  margin-right: 10px;
  background-color: #1a1a1a;
  margin-bottom: 20px;
  margin-left: 10px;
`;
export const AlbumContainer = styled.View`
  flex: 1;
  height: 150px;
`;

export const AlbumCover = styled.Image`
  height: 75px;
  width: 75px;
`;

export const PlaylistNameContainer = styled.View`
  height: 40px;
  border-top-width: 1px;
  border-top-color: #50f;
  justify-content: center;
  align-items: center;
  padding: 0px 5px;
`;

export const PlaylistName = styled.Text`
  color: #d5d5d5;
  font-size: 16px;
  font-family: 'Roboto Slab Regular';
`;

export const PlaylistNameTicker = styled(TextTicker)`
  color: #d5d5d5;
  font-size: 16px;
  font-family: 'Roboto Slab Regular';
`;

export const CreatePlaylistButton = styled(RectButton)`
  width: 95%;
  height: 35px;
  align-items: center;
  justify-content: center;
  background-color: #222;
  padding: 5px 0px;
  border-radius: 5px;
`;

export const CreatePlaylistButtonText = styled.Text`
  color: #e5e5e5;
  font-family: 'Roboto Slab Bold';
`;

export const RemovePlaylistButton = styled(RectButton)`
  width: 95%;
  height: 28px;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  padding: 5px 0px;
  margin-top: 10px;
  border-radius: 5px;
  flex-direction: row;
`;

export const RemovePlaylistText = styled.Text`
  color: #c53030;
  font-family: 'Roboto Slab Regular';
  font-size: 12px;
  margin-left: 5px;
`;