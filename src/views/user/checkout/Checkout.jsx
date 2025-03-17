import React, { useEffect, useMemo, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import { Bounce, toast } from 'react-toastify';
import { getOrderById } from '../../../services/orderService';
import { createRequest } from '../../../services/requestService';
import { formatPrice } from 'utils/formatPrice';
import useAuth from 'hooks/useAuth';
import * as signalR from '@microsoft/signalr';

const Checkout = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId'));
  const { auth } = useAuth();

  const handleStatusNoti = (status) =>{
    if(status === 'confirmed'){
        return 'đã được nhân viên xác nhận'
    } else if(status === 'preparing') {
      return 'đang được chế biến'
    }else if(status === 'delivered') {
      return 'đang được giao'
    }else if(status === 'rejected') {
      return 'đang bị từ chối'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "preparing":
        return "Đang chuẩn bị";
      case "delivered":
        return "Đã giao";
      case "rejected":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary"; // Xám - Chờ xác nhận
      case "confirmed":
        return "success"; // Xanh lá - Đã xác nhận
      case "preparing":
        return "warning"; // Vàng - Đang chuẩn bị
      case "delivered":
        return "primary"; // Xanh dương - Đã giao
      case "rejected":
        return "danger"; // Đỏ - Đã hủy
      default:
        return "dark"; // Mặc định
    }
  };

  useEffect(() => {
    if (orderId !== null) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/hub/order-details?orderId=${orderId}`)
        .withAutomaticReconnect()
        .build();

      connection
        .start()
        .then(() => console.log('Connected to SignalR'))
        .catch((err) => console.error('Connection failed:', err));

      connection.on('LoadCurrentDishes', (data) => {
        console.log('Received LoadCurrentDishes:', data);
        setOrder(data);
        setLoading(false);
      });
      // Nhận thông báo đơn hàng mới
      connection.on('ReceiveNewOrder', (orderDetail) => {
        console.log(orderDetail);
        setOrder((prev) => [orderDetail, ...prev]);
      });

      connection.on('UpdateOrderDetailStatus', (updatedOd) => {
        preOrderDetails.forEach((od) => {
          if (od.id === updatedOd.id) {
            toast(`Món ${od.name}` + handleStatusNoti(updatedOd.status), {
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
          }
        });
        setOrder((preOrderDetails) => preOrderDetails.map((od) => (od.id === updatedOd.id ? { ...od, status: updatedOd.status } : od)));
      });

      return () => {
        console.log('SignalR connection closed');
        connection.stop();
      };
    }
  }, [orderId]);

  const handleCheckout = async () => {
    if (!orderId) return;

    try {
      const response = await createRequest(auth.token, {
        orderId: parseInt(orderId, 10),
        typeId: 7,
        note: 'Thanh toán'
      });
      setShowModal(true)
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      toast.error('Lỗi kết nối hệ thống');
    }
  };

  const handleTotalMoney = useMemo(() => {
    var totalMoney = 0;
    order?.map((item) => {
      totalMoney += item.price * item.quantity;
    });
    return totalMoney;
  }, [order]);

  return (
    <Container className="mt-5 py-5">
      <Container className="mt-4 text-center">
        <h2>Hoàn thành đơn đặt hàng của bạn</h2>
        <p>Xem lại các món của bạn và xác nhận đơn đặt hàng</p>

        {loading ? (
          <Spinner animation="border" variant="warning" />
        ) : !orderId ? (
          <h5 className="text-danger mt-4">Chưa có đơn hàng</h5>
        ) : order?.length > 0 ? (
          <>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên món</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.dishImage}
                          alt={item.dishImage}
                          style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                        />
                        {item.dishName}
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                    <td>
                    <Badge pill bg={getStatusVariant(item.status)}>{getStatusText(item.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-end mt-4">
              <h4>
                Tổng cộng: <span className="text-danger">{formatPrice(handleTotalMoney)}</span>
              </h4>
              <Button variant="warning" className="text-white mt-3" onClick={handleCheckout}>
                Yêu cầu thanh toán
              </Button>
            </div>
          </>
        ) : (
          <h5 className="text-danger mt-4">Không có món nào trong đơn hàng</h5>
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Nhân viên sẽ đến thanh toán trong giây lát. Vui lòng chờ tại chỗ!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;
