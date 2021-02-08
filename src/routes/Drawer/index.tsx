import React from 'react';
import DrawerView from './drawerView';
import SongList from '../../pages/SongList';
import AlbumPage from '../../pages/AlbumPage';
import FilterPage from '../../pages/FilterPage';
import ArtistList from '../../pages/ArtistList';
import ArtistPage from '../../pages/ArtistPage';
import SearchPage from '../../pages/SearchPage';
import PlaylistPage from '../../pages/PlaylistPage';
import PlaylistList from '../../pages/PlaylistList';
import SongsToFilterPage from '../../pages/SongsToFilterPage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FilterConfigurationPage from '../../pages/FilterConfigurationPage';

const Drawer = createDrawerNavigator();

const DrawerRouter: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName='SongList' drawerContent={props => <DrawerView {...props} />}>
      <Drawer.Screen name="SongList" component={SongList}/>
      <Drawer.Screen name="AlbumPage" component={AlbumPage}/>
      <Drawer.Screen name="ArtistList" component={ArtistList}/>
      <Drawer.Screen name="ArtistPage" component={ArtistPage}/>
      <Drawer.Screen name="SearchPage" component={SearchPage}/>
      <Drawer.Screen name="FilterPage" component={FilterPage}/>
      <Drawer.Screen name="PlaylistPage" component={PlaylistPage}/>
      <Drawer.Screen name="PlaylistList" component={PlaylistList}/>
      <Drawer.Screen name="SongsToFilterPage" component={SongsToFilterPage}/>
      <Drawer.Screen name="FilterConfigurationPage" component={FilterConfigurationPage}/>
    </Drawer.Navigator>
  );
}

export default DrawerRouter;