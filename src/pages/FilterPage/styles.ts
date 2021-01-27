import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #000;
  flex: 1;
`;

export const Header = styled.View`
  height: 200px;
  width: 100%;
`;

export const HeaderIconContainer = styled.View`
  justify-content: space-between;
  flex-direction: row;
  padding: 20px 20px 15px 20px;
  margin-bottom: -30px;
`;

export const IconContainer = styled.View`
  margin: auto 0px;
`;

export const Content = styled.View`
  flex: 1;
  padding: 0px 15px;
  margin-top: 10px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  padding-left: 20px;
  padding-top: 40px;
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 26px;
  font-family: 'Roboto Slab Bold';
  margin-top: -7px;
  margin-left: 10px;
`;

export const DescriptionContainer = styled.View`
  flex: 1;
  padding: 10px 30px;
`;

export const Description = styled.Text`
  text-align: left;
  font-size: 12px;
  color: #777;
  font-family: 'Karla Regular';
`;

export const FilteredTitleContainer = styled.View`
  border-bottom-color: #40f;
  border-bottom-width: 2px;
  padding: 5px 0px;
  padding-right: 5px;
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const FilteredTitle = styled.Text`
  font-size: 22px;
  color: #fff;
  font-family: 'Roboto Slab Regular';
`;

export const AddSongButton = styled(RectButton)`
  height: 35px;
  background-color: #222;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export const AddSongText = styled.Text`
  font-size: 15px;
  color: #ddd;
  font-family: 'Roboto Slab Regular';
`;

export const EmptyListText = styled.Text`
  font-size: 12px;
  color: #888;
  font-family: 'Karla Regular';
`;
