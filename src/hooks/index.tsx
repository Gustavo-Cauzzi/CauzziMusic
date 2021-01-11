import React from 'react';

import { SongProvider } from './songs';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppProvider: React.FC = ({ children }) => (
  <MenuProvider>
    <SongProvider>
      <SafeAreaProvider>
        {children}
      </SafeAreaProvider>
    </SongProvider>
  </MenuProvider>
);

export default AppProvider;
