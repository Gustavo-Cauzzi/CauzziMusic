import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled, { css } from 'styled-components/native';

interface SearchBoxContainerProps {
  isActive?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

export const Header = styled.View`
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

export const Content = styled.View`
  flex: 1;
  padding: 10px 15px;
`;

export const SearchBox = styled.TextInput`
  flex: 1;
  color: #e5e5e5;
  font-family: 'Karla Regular';
`;

export const SongContainer = styled.View`
  background-color: #1a1a1a;
  margin: 5px 0;
  border-radius: 5px;
  flex-direction: row;
`;

export const MenuContainer = styled.View`
  position: absolute;
  right: 10px;
  justify-content: center;
  align-items: center;
  height: 60px;
`;

export const SongTriger = styled(RectButton)`
  flex: 1;
  padding: 5px 5px;
  flex-direction: row;
  align-items: center;
  margin-right: 35px;
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
  font-family: 'Roboto Slab Regular';
  color: #e5e5e5;
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

export const ArtistName = styled.Text`
  color: #a5a5a5;
  font-size: 12px;
  font-family: 'Karla Regular';
`;

export const SearchBoxContainer = styled.View<SearchBoxContainerProps>`
  background-color: #252525;
  width: 100%;
  height: 40px;
  padding-left: 5px;
  padding-right: 10px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: #252525;
  ${props => props.isActive ? css`border-bottom-color: #50f;` : css`border-bottom-color: #252525;`}
`;
