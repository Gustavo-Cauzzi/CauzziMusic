import React, { useCallback } from 'react';
import { ArtistContainer, ArtistInfoContainer, ArtistName, ArtistNameTicker, Cover, CoversContainers } from './styles';

import NoCoverJpg from '../../../assets/50x50.jpg'
import { View } from 'react-native';

interface ArtistProps {
  artist: iArtist;
  onPress?: () => void;
}

interface iArtist {
  albums: {
      album: string | undefined;
      cover: string | undefined;
  }[];
  artist: string;
  numberOfAlbums: number;
  numberOfSongs: number;
};

const MAX_NAME_LENGHT = 41;

const Artist: React.FC<ArtistProps> = ({artist, onPress}) => {
  const numberOfCoversPerArtist = [0, 1, 2, 3];

  const handleGoToArtistPage = useCallback(() => {
    onPress && onPress();
  }, [onPress])
  
  return (
    <ArtistContainer onPress={() => {handleGoToArtistPage()}}>
      <CoversContainers>
        {
          numberOfCoversPerArtist.map(i => (
            <Cover 
              key={`${artist.artist}${i}`}
              source={ artist.albums[i] == undefined ? NoCoverJpg : {uri: `${artist.albums[i].cover}`}} 
              style={{
                borderTopLeftRadius: i == 0 ? 10 : 0,
                borderTopRightRadius: i == 3 ? 10 : 0,
              }}
            />
          ))
        }
      </CoversContainers>
      <ArtistInfoContainer>
        {
          artist.artist.length <= 41
            ? 
              <ArtistName>
                {artist.artist == '<unknown>' ? 'Desconhecido' : artist.artist}
              </ArtistName>
            :
              <View style={{flex: 1, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                <ArtistNameTicker
                  duration={15000}
                  repeatSpacer={50}
                  marqueeDelay={1000}
                > 
                  {artist.artist}
                </ArtistNameTicker>
              </View>
        }
      </ArtistInfoContainer>
    </ArtistContainer>
  );
};

export default Artist;
