import React, { PureComponent, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';

import MenuPopup from '../MenuPopup';

import NoCoverJpg from '../../../assets/30x30.jpg';

import { ArtistName, SongContainer, SongName, SongTriger } from './styles';
import FastImage from 'react-native-fast-image';

interface SongProps {
  onPress?: () => void;
  song: MusicFile;
  navigation?: any;
}

interface ArtistList {
  albums: {
      album: string | undefined;
      cover: string | undefined;
  }[];
  artist: string;
  numberOfAlbums: number;
  numberOfSongs: number;
};
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


// export default class Song extends PureComponent<SongProps> {
//   handlePlayMusic(){  
//     const { onPress } = this.props;
//     onPress && onPress();
//   }
  
//   render() {
//     const { song, navigation, artistList, deleteSong } = this.props;
//     return(
//       <SongContainer>
//         <SongTriger onPress={() => {this.handlePlayMusic()}}>
//           <FastImage source={song.cover ? { uri: song.cover } : NoCoverJpg} style={{width: 40, height: 40, marginRight: 10}} />
//           <View>
//             <SongName>{song.title}</SongName>
//             <ArtistName>{song.author}</ArtistName>
//           </View>
//         </SongTriger>
//         <MenuPopup song={song} navigation={navigation} artistList={artistList} deleteSong={deleteSong}>
//           <IconEntypo 
//             name="dots-three-vertical" 
//             size={20} 
//             color="#bbb" 
//             />
//         </MenuPopup>
//       </SongContainer>
//     )
//   }
// }

const Song: React.FC<SongProps> = ({onPress, song}) => {
 
  const handlePlayMusic = useCallback(() => {
    onPress && onPress();
  }, []);
  
  return (
    <SongContainer>
      <SongTriger onPress={() => {handlePlayMusic()}}>
        <FastImage source={song.cover ? { uri: song.cover } : NoCoverJpg} style={{width: 30, height: 30, marginRight: 10}} />
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

export default React.memo(Song);
