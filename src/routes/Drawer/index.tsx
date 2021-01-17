import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SongList from '../../pages/SongList';
import ArtistList from '../../pages/ArtistList';
import DrawerView from './drawerView';
import ArtistPage from '../../pages/ArtistPage';
import AlbumPage from '../../pages/AlbumPage';
import SearchPage from '../../pages/SearchPage';

const Drawer = createDrawerNavigator();

const DrawerRouter: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName='SongList' drawerContent={props => <DrawerView {...props} />}>
      <Drawer.Screen name="SongList" component={SongList} />
      <Drawer.Screen name="ArtistList" component={ArtistList} />
      <Drawer.Screen name="ArtistPage" component={ArtistPage} />
      <Drawer.Screen name="AlbumPage" component={AlbumPage} />
      <Drawer.Screen name="SearchPage" component={SearchPage} />
    </Drawer.Navigator>
  );
}

export default DrawerRouter;