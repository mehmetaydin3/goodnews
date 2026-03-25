import React from 'react';
import ReactDOM from 'react-dom/client';
import GoodNewsApp from './GoodNewsApp';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoodNewsApp />
  </React.StrictMode>
);
