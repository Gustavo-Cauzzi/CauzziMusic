import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const Header = styled.View`
  /* background-color: #55f; */
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom-width: 2px;  
  border-bottom-color: #50f;
  align-items: center;
  height: 50px;
`;  

export const Title = styled.Text`
  color: #e5e5e5;
  font-size: 20px;
  font-weight: bold;
`;

export const Content = styled.View`
  flex: 1;
  padding: 20px 10px;
`;