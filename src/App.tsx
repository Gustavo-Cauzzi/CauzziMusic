import React from 'react';
import { StatusBar } from 'react-native';

import AppProvider from './hooks';
import SongList from './pages/SongList';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      <AppProvider>
        <Routes />
      </AppProvider>
    </>
  );
};

export default App;
