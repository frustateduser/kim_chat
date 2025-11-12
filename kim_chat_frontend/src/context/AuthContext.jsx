// src/context/AuthContext.jsx
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';

export const AuthProvider = ({ children }) => {
  // Wrap with PersistGate so persisted state is rehydrated before UI mounts
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  );
};
