import React, { useCallback } from 'react';
import { Dimensions, Image, View } from 'react-native';
import rnfs from 'react-native-fs';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import { useSongs } from '../../hooks/songs';

import MenuPopup from '../MenuPopup';

import NoCoverJpg from '../../../assets/30x30.jpg';

import { SongInfo, ArtistName, SongAlbumCover, SongAlbumCoverPlaceHolder, SongContainer, SongName, SongNameTicker, SongTriger } from './styles';
import FastImage from 'react-native-fast-image';

interface SongProps {
  onPress?: () => void;
  song: MusicFile;
}

interface MusicFile{
  id : number,
  title : string,
  author : string,
  album : string,
  genre : string,
  duration : number, 
  cover :string,
  blur : string,
  path : string
}

const Song: React.FC<SongProps> = ({onPress, song}) => {
 
  const handlePlayMusic = useCallback(() => {
    onPress && onPress();
  }, []);
  
  return (
    <SongContainer>
      <SongTriger onPress={() => {handlePlayMusic()}}>
        <FastImage source={NoCoverJpg} style={{width: 30, height: 30, marginRight: 10}} />
        <View>
          <SongName>{song.title}</SongName>
          <ArtistName>{song.author}</ArtistName>
        </View>
        </SongTriger>
        <MenuPopup song={song}>
          <IconEntypo 
            name="dots-three-vertical" 
            size={20} 
            color="#bbb" 
          />
        </MenuPopup>
      </SongContainer>
  );
};

export default Song;
