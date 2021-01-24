import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
  padding: 20px 10px;
`;

export const InfoContainer = styled.View`
  height: 250px;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;

export const AlbumContainer = styled.View`
  height: 150px;
  width: 150px;
`;

export const AlbumCover = styled.Image`
  height: 75px;
  width: 75px;
`;

export const PlaylistTitle = styled.Text`
  color: #fff;
  font-size: 25px;
  font-family: 'Roboto Slab Regular';
  margin-top: 20px;
`;

export const EmptyPlaylistText = styled.Text`
  font-family: 'Roboto Slab Regular';
  color: #bbb;
  font-size: 12px;
`;