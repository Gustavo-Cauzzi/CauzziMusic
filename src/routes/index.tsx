import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DrawerRouter from './Drawer';
import Player from '../pages/Player';
import { NavigationContainer } from '@react-navigation/native';
import QueuePage from '../pages/QueuePage';

const Tab = createMaterialTopTabNavigator();

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBarPosition={0}>
        <Tab.Screen name="DrawerRouter" component={DrawerRouter} />
        <Tab.Screen name="Player" component={Player} />
        <Tab.Screen name="QueuePage" component={QueuePage} />
      </Tab.Navigator>
    </NavigationContainer>
  )
};

export default Routes;