import React from 'react';
import { createDrawerNavigator, DrawerView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import SongList from '../../pages/SongList';
import ArtistList from '../../pages/ArtistList';

const Drawer = createDrawerNavigator();

const DrawerRouter: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName="SongList" drawerContent={props => <DrawerView {...props} />}>
      <Drawer.Screen name="SongList" component={SongList} />
      <Drawer.Screen name="ArtistList" component={ArtistList} />
    </Drawer.Navigator>
  );
}

export default DrawerRouter;