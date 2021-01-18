import styled, { css } from 'styled-components/native';

interface DivisionProps{
  isActive: boolean;
}

interface OptionTextProps{
  isActive: boolean;
}

export const Container = styled.View`
  border-width: 1px;
  border-color: #AAA;
  height: 30px;
  border-radius: 15px;
  flex-direction: row;
  width: 200px;
`;

export const Division1 = styled.View<DivisionProps>`
  height: 28px;
  width: 50%;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 15px;
  border-top-left-radius: 15px;
  border-right-width: 1px;
  border-right-color: #AAA;

  ${props => props.isActive ? css`background-color: #50f` : null}
`;

export const Division2 = styled.View<DivisionProps>`
  height: 28px;
  width: 50%;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 15px;
  border-top-right-radius: 15px;

  ${props => props.isActive ? css`background-color: #50f` : null}
`;

export const OptionText = styled.Text<OptionTextProps>`
  color: #DDD;
  font-family: 'Roboto Slab Regular';

  ${props => props.isActive ? css`font-family: 'Roboto Slab Bold'` : null}
`;