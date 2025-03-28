import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import routes, { renderRoutes } from './routes';
import SelectTableChecker from './components/SelectTableChecker';
import { AuthProvider } from 'contexts/AuthContext';
import { OrderProvider } from 'contexts/OrderContext';

const RoutesWrapper = () => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/user/');

  return (
    <>
      {isStaffRoute && <SelectTableChecker />}
      {renderRoutes(routes)}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <RoutesWrapper />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
