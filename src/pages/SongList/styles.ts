import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
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
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom-width: 2px;  
  border-bottom-color: #50f; 
  height: 50px;
`;  

export const MenuButton = styled.TouchableOpacity`
`;

export const Title = styled.Text`
  color: #e5e5e5;
  font-size: 20px;
  font-family: 'Roboto Slab Bold';
`;

export const ShuffleButton = styled(RectButton)`
  background-color: #1a1a1a;
  margin: 5px 0;
  border-radius: 5px;
  flex-direction: row;
  height: 60px;
  align-items: center;
  padding-left: 10px;
`

export const ShuffleIconContainer = styled.View`
  height: 45px;
  width: 45px;
  background-color: #580CF0;
  border-radius: 22.5px;
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