import axiosClient from './axiosClient';

const END_POINTS = {
  GET_ORDERS: 'admin/orders',
  CREATE_ORDER: 'orders',
  ORDER_BY_ID: 'orders',
};

export const getAdminOrders = async () => {
  const url = `${END_POINTS.GET_ORDERS}`;
  return axiosClient.get(url);
};

export const createOrder = async (data) => {
  const url = `${END_POINTS.CREATE_ORDER}`;
  return axiosClient.post(url, data);
};

export const addOrderDetails = async (orderId, details) => {
  const url = `${END_POINTS.CREATE_ORDER}/${orderId}/details`;
  return axiosClient.post(url, details);
};

export const getOrderById = (orderId) => {
    const url = `${END_POINTS.ORDER_BY_ID}/${orderId}`;
    return axiosClient.get(url);
};