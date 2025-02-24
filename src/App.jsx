import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext'; 
import routes, { renderRoutes } from './routes';

const App = () => {
  return (
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
         <CartProvider>        
        {renderRoutes(routes)}
        </CartProvider>
      </BrowserRouter>

 
  );
};

export default App;