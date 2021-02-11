import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled, { css } from 'styled-components/native';

interface SearchBoxContainerProps {
  isActive?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const Header = styled.View`
  background-color: #111;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom-width: 2px;  
  align-items: center;
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

export const SwitchContainer = styled.View`
  width: 100%;
  margin: 5px 0px;
  justify-content: center;
  align-items: center;
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
