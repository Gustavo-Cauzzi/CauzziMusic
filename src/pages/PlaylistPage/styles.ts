import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

export const InfoContainer = styled.View`
  height: 300px;
  align-items: center;
  padding-top: 50px;
`;

export const AlbumContainer = styled.View`
  height: 150px;
  width: 150px;
`;

export const AlbumCover = styled.Image`
  height: 75px;
  width: 75px;
`;

export const PlaylistInfo = styled.View`
  width: 100%;
  height: 100px;
  align-items: center;
  padding: 0px 10px;
  padding-top: 15px;
`;

export const PlaylistTitle = styled.Text`
  color: #fff;
  font-size: 25px;
  font-family: 'Roboto Slab Regular';
`;

export const PlaylistDetails = styled.Text`
  margin-top: 5px;
  color: #777;
  font-size: 10px;
  font-family: 'Karla Regular';
  text-align: center;
`;

export const EmptyPlaylistText = styled.Text`
  font-family: 'Roboto Slab Regular';
  color: #bbb;
  font-size: 12px;
`;

export const FloatingContainer = styled.View`
  position: absolute;
  z-index: 5;
  right: 10px;
  top: 10px;
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

export const SongSelectedContainer = styled.View<{isSelected: boolean}>`
  ${props => props.isSelected ? css`background-color: rgba(85, 0, 255, 0.2)` : null}
`;
