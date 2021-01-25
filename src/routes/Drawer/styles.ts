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

export const PlaylistTitle = styled.Text`
  color: #fff;
  font-family: 'Roboto Slab Regular';
  font-size: 20px;
  margin-left: 10px;
  margin-top: 10px;
`;

export const SeeAllButton = styled(RectButton)`
  height: 20px;
  align-self: flex-end;
  margin-right: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* background-color: #f0f; */
`;

export const SeeAllButtonText = styled.Text`
  color: #aaa;
  font-family: 'Roboto Slab Regular';
  font-size: 13px;
`;

export const FlatListContainer = styled.View`
  flex: 1;
  margin: 5px 10px;
  padding-bottom: 10px;
  border-top-width: 2px;
  border-top-color: #50f;
  margin-bottom: 60px;
`;

export const CreatePlaylistButton = styled(RectButton)`
  width: 100%;
  height: 28px;
  align-items: center;
  justify-content: center;
  background-color: #222;
  padding: 5px 0px;
`;

export const CreatePlaylistButtonText = styled.Text`
  color: #e5e5e5;
  font-family: 'Roboto Slab Regular';
`;

export const EmptyPlaylists = styled.Text`
  color: #bbb;
  font-size: 10px;
  font-family: 'Karla Regular';
`;

export const PageList = styled.View``;

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