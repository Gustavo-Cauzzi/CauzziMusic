import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
  align-items: center;
  justify-content: center;
`;

export const AlbumCover = styled.Image`
  height: 250px;
  width: 250px;
  border-radius: 15px;
`;

export const SongTitle = styled.Text`
  color: #e5e5e5;
  margin-top: 30px;
  margin-bottom: 5px;
  font-size: 30px;
`;

export const ArtistName = styled.Text`
  color: #a5a5a5;
  font-size: 15px;
`;

export const IconContainer = styled.View`
  flex-direction: row;
`;

