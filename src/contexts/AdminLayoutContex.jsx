import { createContext, useContext, useState } from "react";
// Tạo Context
const RestaurantContext = createContext();

export const useAdminLayoutContext = () => {
    return useContext(RestaurantContext);
};

// Provider cho AdminLayout
export const AdminLayoutContex = ({ children }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState({});

  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};