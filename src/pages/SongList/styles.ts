import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const Content = styled.View`
  margin: 0px 15px;
`;  

export const Header = styled.View`
  position: absolute;
  width: 100%;
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

export const ShuffleButton = styled(RectButton)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
`

export const ShuffleContainer = styled.View`
  margin: 5px 0;
  height: 50px;
  border-left-width: 2px;
  border-left-color: rgba(85, 0, 255, 0.5);
`;

export const ShuffleIconContainer = styled.View`
  height: 30px;
  width: 30px;
  background-color: rgba(85, 0, 255, 0.8);
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

export const ShuffleText = styled.Text`
  color: #e5e5e5;
  font-size: 15px;
  font-family: 'Roboto Slab SemiBold';
`;

export const SongNameTicker = styled(TextTicker)`
  font-family: 'Roboto Slab Regular';
  color: #e5e5e5;
`;

export const FloatingContainer = styled.View`
  position: absolute;
  background-color: rgba(85, 0, 255, 0.8);
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  right: 5px;
  top: 0px;
  border-radius: 10px;
`;

export const FloatingEditContainer = styled.View`
  position: absolute;
  z-index: 5;
  right: 10px;
  top: 60px;
  width: 40px;
`;

export const FloatingMenuContainer = styled.View`
  height: 40px;
  width: 40px;
  background-color: #50f;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const LoadingCoversTest = styled.Text`
  color: #fff;
  font-size: 12px;
`;

export const SongSelectedContainer = styled.View<{isSelected: boolean}>`
  ${props => props.isSelected ? css`background-color: rgba(85, 0, 255, 0.2)` : null}
`;
