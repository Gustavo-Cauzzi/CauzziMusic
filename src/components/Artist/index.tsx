import React, { useCallback } from 'react';
import { ArtistContainer, ArtistInfoContainer, ArtistName, Cover, CoversContainers, EmptyAlbumCover } from './styles';
import IconFontisto from 'react-native-vector-icons/Fontisto';

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
            artist.albums[i] != undefined
              ? (
                <Cover 
                  key={`${artist.artist}${i}`}
                  source={{uri: `${artist.albums[i].cover}`}} 
                  style={{
                    borderTopLeftRadius: i == 0 ? 10 : 0,
                    borderTopRightRadius: i == 3 ? 10 : 0,
                  }}
                />
              )
              : (
                <EmptyAlbumCover
                  key={`${artist.artist}${i}`}
                  style={{
                    borderTopLeftRadius: i == 0 ? 10 : 0,
                    borderTopRightRadius: i == 3 ? 10 : 0,
                  }}
                >
                  <IconFontisto name="music-note" color="#fff" size={20}/>    
                </EmptyAlbumCover>
              )
          ))
        }
      </CoversContainers>
      <ArtistInfoContainer>
        <ArtistName>
          {artist.artist == '<unknown>' ? 'Desconhecido' : artist.artist}
        </ArtistName>
      </ArtistInfoContainer>
    </ArtistContainer>
  );
};

export default Artist;
