import React from 'react';

import { SongProvider } from './songs';
import { MenuProvider } from 'react-native-popup-menu';

const AppProvider: React.FC = ({ children }) => (
  <MenuProvider>
    <SongProvider>
      {children}
    </SongProvider>
  </MenuProvider>
);

export default AppProvider;
