import React from 'react';
import { View, Button } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

interface DrawerViewProps{
  props: any;
  children: any;
}

const DrawerView: React.FC<DrawerViewProps> = ({props}) => {
  return (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props}/>
    <View>
      <Button title="aaaaaaaaaaaaaa" onPress={() => props.navigation.toggleDrawer()}>
      </Button>
    </View>
  </DrawerContentScrollView>
  );
}

export default DrawerView;