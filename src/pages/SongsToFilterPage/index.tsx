import React, { useState } from 'react';
import { FlatList } from 'react-native';

import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSongs } from '../../hooks/songs';
import Song from '../../components/Song';
import { MusicFile } from '../../@types/MusicFile';

import { Container, 
  Header, 
  Content,
  SongSelectedContainer, 
  Title, 
  SearchButtonText,
  SearchButton,
  SearchBoxContainer,
  SearchBox,
} from './styles';

interface SongsToFilterPageProps {
  navigation?: any;
}

const SongsToFilterPage: React.FC<SongsToFilterPageProps> = ({ navigation }) => {
  const [songsSelected, setSongsSelected] = useState<MusicFile[]>([]);
  const [searchList, setSearchList] = useState<MusicFile[]>([]);
  const [isSearchModeActive, setIsSearchModeActive] = useState(false);
  const [isSearchBoxSelected, setIsSearchBoxSelected] = useState(false);

  const { filteredSongList, addSongsToFilter} = useSongs();

  return (
    <Container>
      <Header>
        <IconFeather 
          name="x" 
          size={25} 
          color="#fff" 
          onPress={() => {
            navigation.goBack();
            setSongsSelected([]);
          }}
        />
        <Title>Escolha as Músicas</Title>
        <IconFeather 
          name="check" 
          size={25} 
          color="#fff" 
          onPress={() => {
            addSongsToFilter(songsSelected);
            navigation.goBack();
            setSongsSelected([]);
          }}
        />
      </Header>
      <Content>
        <SearchButton onPress={() => {
            if(isSearchModeActive){
              setIsSearchModeActive(false);
              setSearchList([]);
            }else{
              setIsSearchModeActive(true);
            }
          }}
        >
          {
            isSearchModeActive
              ? (
                <>
                  <IconFeather 
                    name="list" 
                    size={20} 
                    color="#fff" 
                  />
                  <SearchButtonText>Lista de Música</SearchButtonText>
                </>
              )
              : (
                <>
                  <IconMaterialCommunityIcons 
                    name="magnify" 
                    size={20} 
                    color="#fff" 
                  />
                  <SearchButtonText>Buscar Música</SearchButtonText>
                </>
              )
          }
        </SearchButton>
        {
          isSearchModeActive && 
          <SearchBoxContainer isActive={isSearchBoxSelected}>
            <SearchBox 
              autoCorrect={false}          
              onFocus={() => {setIsSearchBoxSelected(true)}}  
              onBlur={() => {setIsSearchBoxSelected(false)}}  
              onChangeText={(newValue) => {
                if(newValue == ''){
                  setSearchList([]);
                }else{
                  setSearchList(filteredSongList.filter(song => song.title.toLowerCase().includes(newValue.toLowerCase())))
                }
              }}
            />
            <IconMaterialCommunityIcons name="magnify" size={25} color="#fff"/>
          </SearchBoxContainer>
        }
        <FlatList
          data={isSearchModeActive ? searchList : filteredSongList}
          keyExtractor={(item) => String(item.id)}
          getItemLayout={(_, index) => (
            { length: 60, offset: 60 * index, index }
          )}
          renderItem={({item: song}) => (
            <SongSelectedContainer isSelected={songsSelected.findIndex(s => s.id == song.id) != -1}>
              <Song 
                song={song}
                navigation={navigation}
                onPress={() => {
                  setSongsSelected(currentSelectedSongs => {
                    const index = currentSelectedSongs.findIndex(s => s.id == song.id);
                    if(index != -1){
                      return currentSelectedSongs.filter(s => s.id != song.id);
                    }else{
                      return [...currentSelectedSongs, song]
                    }
                  });
                }}
                onLongPress={() => {
                  setSongsSelected(currentSelectedSongs => {
                    const index = currentSelectedSongs.findIndex(s => s.id == song.id);
                    if(index != -1){
                      return currentSelectedSongs.filter(s => s.id != song.id);
                    }else{
                      return [...currentSelectedSongs, song]
                    }
                  })
                }}
                />
              </SongSelectedContainer>
            )}
          />
        </Content>
    </Container>
  );
};

export default SongsToFilterPage;
