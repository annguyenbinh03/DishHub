import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Bounce, toast } from 'react-toastify';
import { index } from 'd3';

const testSignalR = () => {
  const [orders, setOrders] = useState([]);
  const restaurantId = 1; // Thay bằng ID thực tế của nhà hàng

  useEffect(() => {
    // Tạo kết nối với SignalR Hub
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/hub/order-details?restaurantId=${restaurantId}`)
      .withAutomaticReconnect()
      .build();
    //https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net
    // Xử lý khi nhận danh sách đơn hàng
    connection.on('LoadCurrentOrders', (orderData) => {
      console.log('Received orders:', orderData);
      setOrders(orderData);
    });

    // Nhận đơn hàng mới khi có thông báo từ server
    connection.on('ReceiveNewOrder', (newOrder) => {
      console.log('New order received:', newOrder);
      toast( "new order"+  newOrder.id + " : " +  newOrder.status, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      });
      setOrders((prevOrders) => [newOrder, ...prevOrders]); // Thêm đơn hàng mới vào danh sách
    });

    connection.on('UpdateOrderDetailStatus', (updatedOrderDetail) => {
      console.log('Update order status:', updatedOrderDetail);
      toast(updatedOrderDetail.id + " : " + updatedOrderDetail.status, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      });
      setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrderDetail.id ? { ...order, status: updatedOrderDetail.status } : order
          )
      );
    
    });


    // Kết nối tới Hub
    connection
      .start()
      .then(() => console.log('Connected to SignalR'))
      .catch((err) => console.error('Connection failed:', err));

    // Cleanup khi component unmount
    return () => {
      connection.stop();  
    };
  }, []);

  return (
    <div style={{ marginTop: '200px' }}>
      <h2>Danh sách đơn hàng</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
             <strong> order detail id:</strong> {order.id}  |<strong> Món ăn:</strong> {order.dishId} |<strong> Số lượng:</strong>{' '}
            {order.quantity} | <strong>Order ID:</strong> {order.orderId} |<strong> price:</strong> {order.price} |<strong> status:</strong>{' '}
            {order.status} |
          </li>
        ))}
      </ul>
    </div>
  );
};

export default testSignalR;
