import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import NoCoverJpg from '../../../assets/30x30.jpg';

import { ArtistName, SongContainer, SongName, SongTriger } from './styles';
import FastImage from 'react-native-fast-image';

interface SongProps {
  onPress?: () => void;
  onLongPress?: () => void;
  song: MusicFile;
  navigation?: any;
  children?: any
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

const Song: React.FC<SongProps> = ({onPress, song, onLongPress, children}) => {
  return (
    <SongContainer>
      <SongTriger>
        <TouchableOpacity
          activeOpacity={0.8} 
          style={{flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', flex: 1, alignSelf: 'stretch'}}
          delayLongPress={200}
          onPress={() => {onPress && onPress()}} 
          onLongPress={() => {onLongPress && onLongPress()}}
        >
          <>
            <FastImage source={song.cover ? { uri: song.cover } : NoCoverJpg} style={{width: 30, height: 30, marginRight: 10}} />
            <View>
              <SongName>{song.title}</SongName>
              <ArtistName>{song.author}</ArtistName>
            </View>
          </>
        </TouchableOpacity>
        { children }
      </SongTriger>
    </SongContainer>
  );
};

export default React.memo(Song);