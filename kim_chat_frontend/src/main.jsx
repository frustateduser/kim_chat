/**
 * @fileoverview Entry point for Kim Chat frontend.
 * Mounts the React app to the DOM root and sets up global providers.
 * @author
 * Koustubh Badshah <www.github.com/frustateduser>
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { store } from '@/store/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
