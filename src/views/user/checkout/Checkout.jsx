import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getOrderById } from '../../../services/orderService';
import { createRequest } from '../../../services/requestService';
import { formatPrice } from 'utils/formatPrice';
import useAuth from 'hooks/useAuth';

const Checkout = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId'));
  const { auth } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getOrderById(orderId, auth.token);
        console.log('API Response:', response);

        if (response.isSucess) {
          setOrder(response.data);
        } else {
          toast.error(response.message || 'Lỗi khi lấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error('Lỗi lấy thông tin đơn hàng:', error);
        toast.error('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
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
        localStorage.removeItem('orderId');
        setOrderId(null);
        toast.success('Yêu cầu thanh toán thành công!');
      } else {
        toast.error(response.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      toast.error('Lỗi kết nối hệ thống');
    }
  };

  return (
    <div style={{ backgroundColor: '#1c1c1c', minHeight: '100vh' }}>
      <Container className="mt-5 py-5" style={{ color: '#fff', position: 'relative' }}>
        <Container className="mt-4 text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: '#FFA500', fontFamily: 'Arial, serif' }}>Hoàn thành đơn đặt hàng của bạn</h2>
          <p style={{ color: '#fff' }}>Xem lại các món của bạn và xác nhận đơn đặt hàng</p>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
              <Spinner animation="border" variant="warning" />
            </div>
          ) : !orderId ? (
            <h5 className="text-danger mt-4">Chưa có đơn hàng</h5>
          ) : order?.dishes?.length > 0 ? (
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
                  {order.dishes.map((item, index) => (
                    <tr key={item.id + index} style={{ backgroundColor: '#1C2526' }}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                      <td>
                        <Badge bg={item.status === 'pending' ? 'warning' : 'success'} style={{ fontSize: '1rem', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                          {item.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end mt-4">
                <h4>
                  <span style={{ color: '#fff' }}>Tổng cộng: </span>
                  <span className="text-danger">{formatPrice(order.totalAmount)}</span>
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
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#D4AF37'; // Vàng ánh kim khi hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FF6347'; // Màu cam khi không hover
                  }}
                >
                  Xác nhận thanh toán
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
    </div>
  );

};

export default Checkout;