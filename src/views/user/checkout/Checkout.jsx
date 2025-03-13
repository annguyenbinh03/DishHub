import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getOrderById } from '../../../services/orderService';
import { createRequest } from '../../../services/requestService';
import { formatPrice } from 'utils/formatPrice';

const Checkout = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId'));

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getOrderById(orderId);
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
      const response = await createRequest({
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
    <Container className="mt-5 py-5">
      <Container className="mt-4 text-center">
        <h2>Hoàn thành đơn đặt hàng của bạn</h2>
        <p>Xem lại các món của bạn và xác nhận đơn đặt hàng</p>

        {loading ? (
          <Spinner animation="border" variant="warning" />
        ) : !orderId ? (
          <h5 className="text-danger mt-4">Chưa có đơn hàng</h5>
        ) : order?.dishes?.length > 0 ? (
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
                {order.dishes.map((item, index) => (
                  <tr key={item.id + index}>
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
                      <Badge bg={item.status === 'pending' ? 'warning' : 'success'}>
                        {item.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="text-end mt-4">
              <h4>
                Tổng cộng: <span className="text-danger">{formatPrice(order.totalAmount)}</span>
              </h4>
              <Button 
                variant="warning" 
                className="text-white mt-3"
                onClick={handleCheckout}
              >
                Xác nhận thanh toán
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
        <Modal.Body>
          Nhân viên sẽ đến thanh toán trong giây lát. Vui lòng chờ tại chỗ!
        </Modal.Body>
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