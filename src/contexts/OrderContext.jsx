import useAuth from 'hooks/useAuth';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createOrder } from 'services/orderService';

const OrderContext = createContext({});

export default OrderContext;

export const OrderProvider = ({ children }) => {
  const [orderId, setOrderId] = useState(0); // mặc định lúc chạy provider, chưa tìm trong local storage

  const {auth} = useAuth();

  useEffect(() => {
    getStoragedOrderId();
  }, []);

  const getStoragedOrderId = () => {
    let StoragedOrderId = localStorage.getItem('orderId');
    if (StoragedOrderId) {
      setOrderId(StoragedOrderId);
    } else {
      setOrderId(-1); //Chưa có orderId nào
    }
    console.log(StoragedOrderId);
    console.log(orderId);
  };

  const clearOrderId = () => {
    localStorage.removeItem('orderId');
    setOrderId(-1);
  };

  const createOrderId = async () => {
    let tableId = localStorage.getItem('tableId');
    if (!tableId) {
      toast.error('Chưa chọn bàn, vui lòng chọn bàn trước khi đặt món.');
      return;
    }
    try {
      const orderResponse = await createOrder(auth.token, { tableId });
      console.log('orderResponse', orderResponse);

      var createdOrderId = orderResponse?.data?.orderId;

      if (!createdOrderId) {
        throw new Error('Không lấy được orderId từ API');
      }
      localStorage.setItem('orderId', createdOrderId);
      setOrderId(createdOrderId);
      return createdOrderId;
    } catch (error) {
      toast.error('Không thể tạo đơn hàng, vui lòng thử lại!');
      return;
    }
  };

  return <OrderContext.Provider value={{ orderId, setOrderId, createOrderId, clearOrderId }}>{children}</OrderContext.Provider>;
};
