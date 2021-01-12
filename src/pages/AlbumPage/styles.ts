import { RectButton } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

export const AlbumInfoContainer = styled.View`
  height: 300px;
  width: 100%;
  padding: 30px 0px;
  padding-top: 100px;
`;

export const AlbumInfo = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: row;
  padding-left: 20px;
`;

export const AlbumCover = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 20px;
`;

export const AlbumNameTicker = styled(TextTicker)`
  color: #e5e5e5;
  font-size: 25px;
`;

export const ArtistNameTicker = styled(TextTicker)`
  color: #aaa;
  font-size: 12px;
`;

export const AlbumName = styled.Text`
  color: #e5e5e5;
  font-size: 25px;
`;

export const ArtistName = styled.Text`
  color: #aaa;
  font-size: 12px;
`;

export const GoBackContainer = styled(RectButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0.9;
  background-color: #222;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
  border-radius: 17.5px;
  z-index: 10;
`;

export const SongContainer = styled(RectButton)`
  background-color: #1a1a1a;
  margin: 5px 0;
  padding: 5px 5px;
  flex-direction: row;
  border-radius: 5px;
  align-items: center;
`;

export const SongAlbumCover = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 5px;
`;

export const SongAlbumCoverPlaceHolder = styled.View`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  background-color: #252525;
`;

export const SongInfo = styled.View`
`;

export const SongName = styled.Text`
  color: #e5e5e5;
`;

export const SongArtistName = styled.Text`
  color: #a5a5a5;
  font-size: 12px;
`;

export const Content = styled.View`
  padding: 0px 10px;
  margin-bottom: 25px;
`;

export const SongNameTicker = styled(TextTicker)`
  color: #e5e5e5;
`;