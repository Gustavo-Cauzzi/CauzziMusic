import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SongList from '../../pages/SongList';
import ArtistList from '../../pages/ArtistList';
import DrawerView from './drawerView';

const Drawer = createDrawerNavigator();

const DrawerRouter: React.FC = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerView {...props} />}>
      <Drawer.Screen name="SongList" component={SongList} />
      <Drawer.Screen name="ArtistList" component={ArtistList} />
    </Drawer.Navigator>
  );
}

export default DrawerRouter;