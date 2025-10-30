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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
