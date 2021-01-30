import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View, FlatList, ToastAndroid, TouchableNativeFeedback } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { 
  Container,
  Content,
  PageList,
  PageName,
  PageItem,
  Footer,
  FooterText,
  FooterItem,
  PlaylistTitle,
  FlatListContainer,
  CreatePlaylistButton,
  CreatePlaylistButtonText,
  EmptyPlaylists,
  SeeAllButton,
  SeeAllButtonText
} from './styles';
import { useSongs } from '../../hooks/songs';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import Playlist from '../../components/Playlist';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Easing } from 'react-native-reanimated';

interface DrawerProps {
  navigation?: any;
}

const DrawerView: React.FC<DrawerContentComponentProps & DrawerProps> = ({navigation, ...props}) => {
  const [pageSelected, setPageSelected] = useState(0);
  const [isModalActive, setIsModalActive] = useState(false);
  const { playlists, searchFiles } = useSongs();

  const animatedRotation = useRef(new Animated.Value(0)).current;

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

  const handleGoToFilterPage = useCallback(() => {
    navigation.toggleDrawer();
    navigation.navigate('FilterPage');
  }, [navigation]);

  const handleRefreshSongsPress = useCallback(() => {
    searchFiles();
    ToastAndroid.show('Atualizando Músicas', ToastAndroid.SHORT);
    Animated.timing(animatedRotation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animatedRotation, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start();
    });
  }, [searchFiles]);

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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <PlaylistTitle>Playlists</PlaylistTitle>
          <SeeAllButton onPress={() => {navigation.navigate('PlaylistList', {selectionMode: false, songs: []})}}>
            <SeeAllButtonText>
              Ver todas
            </SeeAllButtonText>
            <IconFeather name="chevrons-right" size={13} color="#aaa" style={{marginTop: 3}}/>
          </SeeAllButton>
        </View>
        <FlatListContainer>
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
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
              <EmptyPlaylists>Você não possui nenhuma playlist 😢</EmptyPlaylists>
              </View>
            )}
            renderItem={({item: playlist}) => (
              <Playlist playlist={playlist} navigation={navigation}/>
            )}
          />
        </FlatListContainer>
      </Content>
      <Footer>
        <FooterItem onPress={handleGoToFilterPage}>
          <IconFeather name="filter" size={20} color="#d3d3d3"/>
          <FooterText>Filtro de Músicas</FooterText>
        </FooterItem>
        <FooterItem onPress={handleRefreshSongsPress}>
              <Animated.View style={[
                {transform: 
                  [{rotate: 
                    animatedRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]}
                ]}
              >
                <IconMaterialIcons name="refresh" size={20} color="#d3d3d3" />
              </Animated.View>
              <FooterText>Atualizar músicas</FooterText>
        </FooterItem>
      </Footer>
    </Container>
  );
}

export default DrawerView;