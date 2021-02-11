import React, { useCallback } from 'react';
import { Alert, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import IconFeather from 'react-native-vector-icons/Feather';
import { MusicFile } from '../../@types/MusicFile';
import Song from '../../components/Song';
import { useSongs } from '../../hooks/songs';

import { 
  AddSongButton, 
  AddSongText, 
  Container, 
  Content, 
  Description, 
  DescriptionContainer, 
  EmptyListText, 
  FilteredTitle, 
  FilteredTitleContainer, 
  Header, 
  HeaderIconContainer, 
  IconContainer, 
  Title, 
  TitleContainer
} from './styles';

interface FilterPageProps{
  navigation?: any;
}

const FilterPage: React.FC<FilterPageProps> = ({ navigation }) => {
  const { filteredSongs, removeSongsFromFilter } = useSongs();

  const handleOpenDrawerMenu = useCallback(() => {
    navigation.openDrawer()
  }, [navigation]);
  
  const handleRemoveSongFromFilter = useCallback((song: MusicFile) => {
    Alert.alert(
      'Remover Música',
      `Você tem certeza que gostaria de tirar a música ${song.title} das músicas filtradas?`,
      [
        {
          text: 'Cancelar',
          onPress: () => console.log("Ação cancelada"),
          style: "cancel",
        },
        {
          text: 'Sim',
          onPress: () => {removeSongsFromFilter([song])},
        },
      ],
      {cancelable: true}
    )
  }, [removeSongsFromFilter]);

  return (
    <Container>
      <Header>
        <HeaderIconContainer>
          <IconContainer>
            <IconFeather 
              name="menu" 
              size={25} 
              color="#FFF" 
              onPress={handleOpenDrawerMenu} 
            />
          </IconContainer>
          <IconContainer>
            <IconFeather 
              name="settings" 
              size={25} 
              color="#FFF" 
              onPress={() => {navigation.navigate('FilterConfigurationPage')}} 
            />
          </IconContainer>
        </HeaderIconContainer>
        <TitleContainer>
          <IconFeather name="filter" color="#50f" size={20} style={{marginLeft: 5}}/>
          <Title>Filtro de Músicas</Title>
        </TitleContainer>
        <DescriptionContainer>
          <Description>
            O filtro de música serve para você escolher quais músicas não devem tocar quando você estiver ouvindo música. Estas músicas tocaram apenas caso estiverem em um playlist, caso contrário, o Player irá evitar tocá-las.
          </Description>
        </DescriptionContainer>
      </Header>
      <Content>
        <FilteredTitleContainer>
          <FilteredTitle>Músicas Filtradas</FilteredTitle>
          <IconFeather 
            name="plus" 
            size={25}
            color="#FFF" 
            onPress={() => {navigation.navigate('SongsToFilterPage')}}
          />
        </FilteredTitleContainer>
        <FlatList
          data={filteredSongs}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={{paddingHorizontal: 5}}
          ListFooterComponentStyle={{paddingHorizontal: 10, paddingBottom: 10, paddingTop: 20}}
          ListEmptyComponent={() => (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 15}}>
              <EmptyListText>
                Não há nenhuma música no filtro.
              </EmptyListText>
            </View>            
          )}
          ListFooterComponent={() => (
            <AddSongButton onPress={() => {navigation.navigate('SongsToFilterPage')}}>
              <AddSongText>
                + Adicionar Música
              </AddSongText>
            </AddSongButton>
          )}
          renderItem={({item: song}) => (
            <Song song={song} onPress={() => {handleRemoveSongFromFilter(song)}}>
              <View style={{marginRight: 10}}>
                <IconFeather 
                  name="x" 
                  size={20} 
                  color="#777" 
                  onPress={() => {handleRemoveSongFromFilter(song)}}
                />
              </View>
            </Song>
          )}
        />
      </Content>
    </Container>
  );
};

export default FilterPage;
