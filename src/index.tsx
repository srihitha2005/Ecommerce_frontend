import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress WebSocket connection errors in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Filter out WebSocket connection errors
    if (
      args[0]?.includes?.('WebSocket connection') ||
      args[0]?.message?.includes?.('WebSocket')
    ) {
      return;
    }
    originalError(...args);
  };
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);