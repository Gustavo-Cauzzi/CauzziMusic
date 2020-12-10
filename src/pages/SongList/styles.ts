import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

export const Content = styled.View`
  margin: 10px 15px;
`;  

export const Header = styled.View`
  /* background-color: #55f; */
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
  border-bottom-width: 2px;  
  border-bottom-color: #50f; 
`;  

export const MenuButton = styled.TouchableOpacity`
  left: -85px;
`;

export const Title = styled.Text`
  color: #e5e5e5;
  font-size: 20px;
  font-weight: bold;
`;

export const SongContainer = styled(RectButton)`
  background-color: #1a1a1a;
  margin: 5px 0;
  padding: 5px 5px;
  flex-direction: row;
  border-radius: 5px;
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

export const SongName = styled.Text`
  color: #e5e5e5;
`;

export const ArtistName = styled.Text`
  color: #a5a5a5;
  font-size: 12px;
`;

export const SongAlbumCoverPlaceHolder = styled.View`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  background-color: #333;
`;
