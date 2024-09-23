import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './components/context/CartContext.jsx'; // Import the CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      {' '}
      {/* Wrap your App with the CartProvider */}
      <App />
    </CartProvider>
  </React.StrictMode>
);
