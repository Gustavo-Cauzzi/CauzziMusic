import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SongList from '../../pages/SongList';
import ArtistList from '../../pages/ArtistList';
import DrawerView from './drawerView';
import ArtistPage from '../../pages/ArtistPage';
import AlbumPage from '../../pages/AlbumPage';
import SearchPage from '../../pages/SearchPage';
import PlaylistPage from '../../pages/PlaylistPage';
import PlaylistList from '../../pages/PlaylistList';

const Drawer = createDrawerNavigator();

const DrawerRouter: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName='SongList' drawerContent={props => <DrawerView {...props} />}>
      <Drawer.Screen name="SongList" component={SongList}/>
      <Drawer.Screen name="ArtistList" component={ArtistList}/>
      <Drawer.Screen name="ArtistPage" component={ArtistPage}/>
      <Drawer.Screen name="AlbumPage" component={AlbumPage}/>
      <Drawer.Screen name="SearchPage" component={SearchPage}/>
      <Drawer.Screen name="PlaylistPage" component={PlaylistPage}/>
      <Drawer.Screen name="PlaylistList" component={PlaylistList}/>
    </Drawer.Navigator>
  );
}

export default DrawerRouter;