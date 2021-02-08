import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled, { css } from 'styled-components/native';

interface SearchBoxContainerProps {
  isActive?: boolean;
}

export const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  font-family: 'Roboto Slab Regular';
  margin-bottom: 10px;
  margin-left: 5px;
`;

export const FieldTitle = styled.Text`
  font-size: 15px;
  color: #e5e5e5;
  font-family: 'Roboto Slab Regular';
  margin-top: 10px;
  margin-left: 9px;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #222;
`;

export const ErrorMessage = styled.Text`
  font-size: 10px;
  flex-wrap: wrap;
  color: #A61919;
  font-family: 'Roboto Slab Regular';
`;

export const ErrorMessageContainer = styled.View`
  justify-content: center;
  flex: 1;
  width: 140px;
  padding-left: 5px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row-reverse;
  height: 30px;
  position: absolute;
  bottom: 15px;
  right: 10px;
`;

export const CustomButton = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #40f;
  margin-right: 10px;
  border-radius: 5px;
  padding: 0px 10px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-family: 'Roboto Slab Bold';
`;

export const SearchBoxContainer = styled.View<SearchBoxContainerProps>`
  background-color: #1a1a1a;
  width: 100%;
  max-height: 80px;
  padding-left: 5px;
  padding-right: 10px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: rgba(85, 0, 255, 0.5);
  ${props => props.isActive ? css`border-bottom-color: #50f;` : css`border-bottom-color: rgba(85, 0, 255, 0.5);`}
`;

export const SearchBox = styled.TextInput`
  flex: 1;
  color: #ccc;
  font-family: 'Karla Regular';
`;
