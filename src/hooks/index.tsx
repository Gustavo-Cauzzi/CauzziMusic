import React from 'react';

import { SongProvider } from './songs';

const AppProvider: React.FC = ({ children }) => (
  <SongProvider>{children}</SongProvider>
);

export default AppProvider;
