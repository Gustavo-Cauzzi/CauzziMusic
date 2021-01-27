import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const Header = styled.View`
  background-color: #111;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  height: 50px;
  z-index: 10;
`;  

export const Title = styled.Text`
  color: #fff;
  font-size: 20px;
  font-family: 'Roboto Slab Regular';
`;

export const ConfigurationContainer = styled.View`
  width: 100%;
  height: 100px;
  align-items: center;
  padding: 0px 20px;
  flex-direction: row;
  justify-content: space-between;
`;

export const ConfigurationInfo = styled.View`
  max-width: 80%;
`;

export const ConfigurationTitle = styled.Text`
  color: #fff;
  font-size: 17px;
  font-family: 'Roboto Slab Regular';
  margin-bottom: 5px;
`;

export const ConfigurationDetails = styled.Text`
  color: #777;
  font-size: 12px;
  font-family: 'Karla Regular';  
`;