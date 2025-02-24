import React, { useEffect, useState } from 'react';
import { Container, Table, Navbar, Nav, Badge, Button, Spinner } from 'react-bootstrap';
import { BsCart, BsChat } from 'react-icons/bs';
import axios from 'axios';
import { formatPrice } from 'utils/formatPrice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = localStorage.getItem('orderId');
    if (!orderId) return;
  
    axios
      .get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/details?orderId=${orderId}`)
      .then(response => {
        if (response.data.isSucess) {
          setOrder(response.data.data.order);
        }
      })
      .catch(error => console.error('Lỗi lấy thông tin đơn hàng:', error))
      .finally(() => setLoading(false));
  }, []);
  

  const handleCheckout = async () => {
    toast.success('Thanh toán thành công!');
    localStorage.removeItem('orderId');
  };

  return (
    <Container className="mt-5">
      <Container className="mt-4 text-center ">
        <h2>Hoàn thành đơn đặt hàng của bạn</h2>
        <p>Xem lại các món của bạn và xác nhận đơn đặt hàng của bạn</p>

        {loading ? (
          <Spinner animation="border" />
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
                  {order.orderDetails.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                        {item.name}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price).toLocaleString()} </td>
                      <td>{formatPrice(item.quantity * item.price).toLocaleString()} </td>
                      <td>
                        <Badge
                          bg={
                            item.status === 'pending'
                              ? 'warning'
                              : item.status === 'confirmed'
                                ? 'primary'
                                : item.status === 'preparing'
                                  ? 'info'
                                  : item.status === 'delivered'
                                    ? 'success'
                                    : 'danger'
                          }
                        >
                          {item.status === 'pending'
                            ? 'Chờ duyệt'
                            : item.status === 'confirmed'
                              ? 'Đã xác nhận'
                              : item.status === 'preparing'
                                ? 'Đang chuẩn bị'
                                : item.status === 'delivered'
                                  ? 'Đã giao'
                                  : 'Đã hủy'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h4 className="mt-3 text-end text-bold text-danger">Tổng tiền: {formatPrice(order.totalAmount).toLocaleString()}</h4>
              <Button className="mt-3" style={{ backgroundColor: 'orange', border: 'none', padding: '10px 20px' }} onClick={handleCheckout}>
                Tiến hành thanh toán
              </Button>
            </>
          )
        )}
      </Container>
    </Container>
  );
};

export default Checkout;
