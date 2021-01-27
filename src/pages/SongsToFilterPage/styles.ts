import { RectButton } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';

interface SearchBoxContainerProps {
  isActive?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const Content = styled.View`
  flex: 1;
  padding: 10px;
`;

export const Header = styled.View`
  background-color: #111;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom-width: 2px;  
  border-bottom-color: #50f; 
  height: 50px;
  z-index: 10;
`;  

export const Title = styled.Text`
  color: #e5e5e5;
  font-size: 20px;
  font-family: 'Roboto Slab Bold';
`;

export const SearchButton = styled(RectButton)`
  height: 40px;
  width: 95%;
  margin: 10px 5px;
  flex-direction: row;
  justify-content: center;
  background-color: #50f;
  align-items: center;
  border-radius: 10px;
`;

export const SearchButtonText = styled.Text`
  color: #e5e5e5;
  font-size: 17px;
  margin-left: 5px;
  font-family: 'Roboto Slab SemiBold';
`;

export const SearchBox = styled.TextInput`
  flex: 1;
  color: #e5e5e5;
  font-family: 'Karla Regular';
`;

export const SearchBoxContainer = styled.View<SearchBoxContainerProps>`
  background-color: #252525;
  width: 95%;
  margin: 10px 5px;
  height: 40px;
  padding-left: 5px;
  padding-right: 10px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: #252525;
  ${props => props.isActive ? css`border-bottom-color: #50f;` : css`border-bottom-color: #252525;`}
`;

export const SongSelectedContainer = styled.View<{isSelected: boolean}>`
  ${props => props.isSelected ? css`background-color: rgba(85, 0, 255, 0.2)` : null}
`;
