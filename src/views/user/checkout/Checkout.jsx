import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { formatPrice } from 'utils/formatPrice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId'));

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    axios
      .get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/orders/${orderId}`)
      .then((response) => {
        if (response.data.isSucess) {
          setOrder(response.data.data); // Dữ liệu API mới không có `order`, mà trả về trực tiếp trong `data`
        }
      })
      .catch((error) => console.error('Lỗi lấy thông tin đơn hàng:', error))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCheckout = async () => {
    try {
      // Gọi API yêu cầu nhân viên đến thanh toán
      const response = await axios.post(
        'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests',
        {
          orderId: parseInt(orderId, 10), // Chuyển orderId sang số nguyên
          typeId: 7, // typeId = 7 là yêu cầu thanh toán
          note: 'Thanh toán', // Ghi chú
        }
      );

      if (response.data.isSucess) {
        // Hiển thị modal thông báo
        setShowModal(true);

        // Xóa orderId khỏi localStorage và state
        localStorage.removeItem('orderId');
        setOrderId(null);

        // Thông báo thành công
        toast.success('Yêu cầu thanh toán đã được gửi thành công!');
      } else {
        toast.error('Gửi yêu cầu thanh toán thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thanh toán:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <Container className="mt-5 py-5">
      <Container className="mt-4 text-center">
        <h2>Hoàn thành đơn đặt hàng của bạn</h2>
        <p>Xem lại các món của bạn và xác nhận đơn đặt hàng</p>

        {loading ? (
          <Spinner animation="border" role="status" variant="warning">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : !orderId ? (
          <h5 className="text-danger mt-4">Bạn chưa có đơn đặt món ăn nào</h5>
        ) : (
          order && (
            <>
              <Table striped bordered hover className="mt-3 text-center">
                <thead>
                  <tr>
                    <th>Stt</th>
                    <th>Tên món</th>
                    <th>SL</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {order.dishes.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                        {item.name}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{formatPrice(item.quantity * item.price)}</td>
                      <td>
                        <Badge bg={item.status === 'pending' ? 'warning' : 'success'}>
                          {item.status === 'pending' ? 'Chờ duyệt' : 'Hoàn thành'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h4 className="mt-3 text-end text-bold text-danger">
                Tổng tiền: {formatPrice(order.totalAmount)}
              </h4>
              <Button
                className="mt-3"
                style={{ backgroundColor: 'orange', border: 'none', padding: '10px 20px' }}
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </Button>
            </>
          )
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Vui lòng đợi trong giây lát, nhân viên sẽ đến và thanh toán cho bạn.</Modal.Body>
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