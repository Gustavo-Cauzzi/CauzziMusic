import React from 'react';

import { Text } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import { Container } from './styles';

const PopupMenu: React.FC = () => {
  return (
    <Container>
      <Text>PopupMenu</Text>
      <Menu>
      <MenuTrigger text='Select action' />
      <MenuOptions>
        <MenuOption onSelect={() => console.log(`Save`)} text='Save' />
        <MenuOption onSelect={() => console.log(`Delete`)} >
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={() => console.log(`Not called`)} disabled={true} text='Disabled' />
      </MenuOptions>
    </Menu>
    </Container>
  );
};

export default PopupMenu;
