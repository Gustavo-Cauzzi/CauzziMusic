import React, { useCallback } from 'react';
import { Dimensions, View } from 'react-native';

import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import { useSongs } from '../../hooks/songs';

import MenuPopup from '../MenuPopup';

import { SongInfo, ArtistName, SongAlbumCover, SongAlbumCoverPlaceHolder, SongContainer, SongName, SongNameTicker, SongTriger } from './styles';

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

const screenWidth = Dimensions.get('window').width;

const Song: React.FC<SongProps> = ({onPress, song}) => {
 
  const handlePlayMusic = useCallback(() => {
    onPress && onPress();
  }, []);
  
  return (
    <SongContainer>
      <SongTriger onPress={() => {handlePlayMusic()}}>
        {song.cover 
          ? <SongAlbumCover source={{uri: `${song.cover}`}}/>
          : (
            <SongAlbumCoverPlaceHolder>
              <IconFontisto name="music-note" color="#fff" size={20}/>    
            </SongAlbumCoverPlaceHolder>
          )
        }
        <SongInfo>
          {
            song.title.length < 39
              ? <SongName>{song.title}</SongName>
              : (
                <View
                  style={{width: screenWidth - 125}}
                >
                  <SongNameTicker
                    duration={15000}
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    {song.title}
                  </SongNameTicker>
                </View>
              )
          }
          <ArtistName>{song.author != '<unknown>' ? song.author : 'Desconhecido'}</ArtistName>
        </SongInfo>
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
