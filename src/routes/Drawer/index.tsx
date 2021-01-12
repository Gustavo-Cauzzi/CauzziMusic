import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SongList from '../../pages/SongList';
import ArtistList from '../../pages/ArtistList';
import DrawerView from './drawerView';
import ArtistPage from '../../pages/ArtistPage';

const Drawer = createDrawerNavigator();

const DrawerRouter: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName='ArtistList' drawerContent={props => <DrawerView {...props} />}>
      <Drawer.Screen name="SongList" component={SongList} />
      <Drawer.Screen name="ArtistList" component={ArtistList} />
      <Drawer.Screen name="ArtistPage" component={ArtistPage} />
    </Drawer.Navigator>
  );
}

export default DrawerRouter;