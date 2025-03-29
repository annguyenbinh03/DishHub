import React, { useEffect, useMemo, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import { Bounce, toast } from 'react-toastify';
import { getOrderById } from '../../../services/orderService';
import { createRequest } from '../../../services/requestService';
import { formatPrice } from 'utils/formatPrice';
import useAuth from 'hooks/useAuth';
import useOrder from 'hooks/useOrder';
import * as signalR from '@microsoft/signalr';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { orderId, createOrderId, clearOrderId } = useOrder();
  const { auth } = useAuth();

    const navigate = useNavigate();

  useEffect(() => {
    if (orderId !== -1 && orderId !== 0) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/hub/order-details?orderId=${orderId}`)
        .withAutomaticReconnect()
        .build();
        //https://localhost:7097
      //https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net
      connection
        .start()  
        .then(() => console.log('Connected to SignalR'))
        .catch((err) => console.error('Connection failed: ', err));

      // Nhận danh sách đơn hàng khi mới kết nối
      connection.on('LoadCurrentDishes', (data) => {
        console.log(data);
        setOrder(data);
        setLoading(false);
      });
      connection.on('UpdateOrderDetailStatus', (updatedOrderDetail) => {
        console.log('Update order status:', updatedOrderDetail);
        setOrder((prevOrders) =>
          prevOrders.map((order) => (order.id === updatedOrderDetail.id ? { ...order, status: updatedOrderDetail.status } : order))
        );
      });

      connection.on('PaidComplete', (id) => {
        console.log('PaidCompleteId:', id);
        localStorage.setItem("paymentId", id);
        navigate('/user/payment-info');
      });

      return () => {
        connection.stop();
      };
    }else{
      setLoading(false);
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

      // Sửa chỗ này
      if (response.isSucess) {
        setShowModal(true);
        toast.success('Yêu cầu thanh toán thành công!');
      } else {
        toast.error(response.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      toast.error('Lỗi kết nối hệ thống');
    }
  };

  const orderTotal = useMemo(() => {
    if (order.length > 0) {
      return order.reduce((total, item) => total + item.price * item.quantity, 0);
    }
    return 0;
  }, [order]);

  const statusMap = {
    pending: { text: 'Chờ xác nhận', color: 'warning' },
    confirmed: { text: 'Đã xác nhận', color: 'primary' },
    preparing: { text: 'Đang chế biến', color: 'info' },
    delivered: { text: 'Đã giao', color: 'success' },
    rejected: { text: 'Đã hủy', color: 'danger' }
  };

  return (
    <Container
      fluid
      className="text-center py-5"
      style={{
        background: '#1c1c1c', // Màu đen toàn màn hình
        color: '#FFFFFF',
        borderBottom: '2px solid #FFD700', // Viền vàng ánh kim
        minHeight: '150vh',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      {' '}
      <Container className="mt-4 text-center" style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ color: '#FFA500', fontFamily: 'Arial, serif' }}>Hoàn thành đơn đặt hàng của bạn</h2>
        <p style={{ color: '#fff' }}>Xem lại các món của bạn và xác nhận đơn đặt hàng</p>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Spinner animation="border" variant="warning" />
          </div>
        ) : !orderId ? (
          <h5 className="text-danger mt-4">Chưa có đơn hàng</h5>
        ) : order?.length > 0 ? (
          <>
            <Table striped bordered hover className="mt-3" style={{ color: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: '#2C2C2C', color: '#FFD700' }}>
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
                  <tr key={item.id + index} style={{ backgroundColor: '#1C2526' }}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.dishImage}
                          alt={item.dishName}
                          style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                        />
                        {item.dishName}
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                    <td>
                      <Badge
                        bg={statusMap[item.status]?.color || 'secondary'}
                        style={{ fontSize: '1rem', padding: '0.5rem 1rem', borderRadius: '12px' }}
                      >
                        {statusMap[item.status]?.text || 'Không xác định'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-end mt-4">
              <h4>
                <span style={{ color: '#fff' }}>Tổng cộng: </span>
                <span className="text-danger">{formatPrice(orderTotal)}</span>
              </h4>

              <Button
                variant="warning"
                className="text-white mt-3"
                onClick={handleCheckout}
                style={{
                  backgroundColor: '#FF6347', // Màu cam
                  borderColor: '#FF6347', // Màu viền cam
                  padding: '10px 30px', // Tăng khoảng đệm
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFA500'; // Vàng ánh kim khi hover
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FF6347'; // Màu cam khi không hover
                }}
              >
                Yêu cầu thanh toán
              </Button>
            </div>
          </>
        ) : (
          <h5 className="text-danger mt-4">Không có món nào trong đơn hàng</h5>
        )}
      </Container>
      {/* Modal thông báo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#2C2C2C', color: '#fff' }}>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1C2526', color: '#fff' }}>
          Nhân viên sẽ đến thanh toán trong giây lát. Vui lòng chờ tại chỗ!
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#2C2C2C' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)} style={{ color: '#fff' }}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;
