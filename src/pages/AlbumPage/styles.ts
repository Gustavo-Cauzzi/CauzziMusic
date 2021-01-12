import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

// export const GoBackContainer = styled(RectButton)<GoBackContainerProps>`
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   opacity: 0.9;
//   background-color: #222;
//   width: 35px;
//   height: 35px;
//   align-items: center;
//   justify-content: center;
//   border-radius: 17.5px;
//   z-index: 10;
//   /* transition: opacity 0.2s; */

//   ${props => !props.isVisible ? css`opacity: 0` : css`opacity: 0.8`}
// `;
