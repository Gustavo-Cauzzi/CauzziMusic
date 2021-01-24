import React, { useCallback, useEffect, useState } from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { 
  Container,
  Content,
  PageList,
  PageName,
  PageItem,
  Footer,
  FooterText,
  FooterItem,
  LoadingText,
  PlaylistTitle,
  FlatListContainer,
  CreatePlaylistButton,
  CreatePlaylistButtonText,
  EmptyPlaylists
} from './styles';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSongs } from '../../hooks/songs';
import { View, FlatList } from 'react-native';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import Playlist from '../../components/Playlist';

interface DrawerProps {
  navigation?: any;
}

const DrawerView: React.FC<DrawerContentComponentProps & DrawerProps> = ({navigation, ...props}) => {
  const [pageSelected, setPageSelected] = useState(0);
  const [isModalActive, setIsModalActive] = useState(false);
  const { isLoading, playlists } = useSongs();

  useEffect(() => {
    setPageSelected(props.state.index);
  }, [props.state.index]);

  const handleItemSelected = useCallback((id: number, pageName: string) => {
    if(pageSelected != id){
      setPageSelected(id);
      navigation.navigate(pageName);
    }else{
      navigation.toggleDrawer();
    }
  }, [pageSelected]);

  const handleGoToSearchPage = useCallback(() => {
    navigation.toggleDrawer();
    navigation.navigate('SearchPage');
  }, [navigation]);

  return (
    <Container>
      <CreatePlaylistModal active={isModalActive} onClose={() => {setIsModalActive(false)}}/>
      <Content>
        <PageList>
          <PageItem isSelected={pageSelected == 0} onPress={() => {handleItemSelected(0, 'SongList')}} >
            <IconMaterialCommunityIcons name="music-note-half" size={22} color="#fff"/>
            <PageName>Lista de Músicas</PageName>
          </PageItem>
          <PageItem isSelected={pageSelected == 1} onPress={() => {handleItemSelected(1, 'ArtistList')}} >
            <IconFeather name="user" size={22} color="#fff"/>
            <PageName>Lista de Artistas</PageName>
          </PageItem>
        </PageList>
        <PlaylistTitle>Playlists</PlaylistTitle>
        <FlatListContainer>
          <FlatList
            data={playlists}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 10,
              backgroundColor: '#111',
            }}
            ListFooterComponentStyle={{
              marginHorizontal: 10,
              marginVertical: 10,
            }}
            ListFooterComponent={() => (
              <CreatePlaylistButton onPress={() => {setIsModalActive(true)}}>
                <CreatePlaylistButtonText>
                  + Criar playlist
                </CreatePlaylistButtonText>
              </CreatePlaylistButton>
            )}
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                <EmptyPlaylists>Você não possui nenhuma playlist</EmptyPlaylists>
              </View>
            )}
            renderItem={({item: playlist}) => (
              <Playlist playlist={playlist} navigation={navigation}/>
            )}
          />
        </FlatListContainer>
      </Content>
      <Footer>
        <FooterItem onPress={handleGoToSearchPage}>
          <IconMaterialCommunityIcons name="magnify" size={20} color="#d3d3d3" />
          <FooterText>Buscar música</FooterText>
        </FooterItem>
        {isLoading 
          ? (
            <View style={{ flexDirection: 'row' }}>
              <IconMaterialIcons name="refresh" size={20} color="#777" />
              <LoadingText>
                Carregando...
              </LoadingText>
            </View>
          )
          : (
            <FooterItem onPress={() => {}}>
              <IconMaterialIcons name="refresh" size={20} color="#d3d3d3" />
              <FooterText>Atualizar músicas</FooterText>
            </FooterItem>
          )
        }
      </Footer>
    </Container>
  );
}

export default DrawerView;