import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';

interface PageItemProps {
  isSelected: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

export const Content = styled.View`
  margin: 40px 10px 10px 10px;
  flex: 1;
`;

export const PageList = styled.View`
`;

export const PageName = styled.Text`
  color: #fff;
  font-size: 18px;
  margin-left: 15px;
`;

export const Footer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  justify-content: center;
  padding: 10px 20px;
  background-color: #151515;
`;

export const FooterItem = styled(RectButton)`
  margin: 5px 0;
  flex-direction: row;
`;

export const FooterText = styled.Text`
  color: #d3d3d3;
  font-size: 15px;
  margin-left: 10px;
`;

export const LoadingText = styled.Text`
  color: #d3d3d3;
  margin-left: 10px;
  font-size: 15px;
`;

export const PageItem = styled(RectButton)<PageItemProps>`
  height: 40px;
  flex-direction: row;
  padding-left: 10px;
  margin: 0 5px;
  margin-bottom: 10px;
  align-items: center;
  border-radius: 5px;

  ${props => props.isSelected ? css`background-color: rgba(85, 0, 255, 0.6)` : css`background-color:#222`}
`;