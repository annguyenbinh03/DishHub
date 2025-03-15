import React, { useState } from 'react';
import { Offcanvas, Button, ListGroup, Image, Row, Col } from 'react-bootstrap';
import { BsCartFill, BsXCircle } from 'react-icons/bs';
import { useCart } from '../../../contexts/CartContext';
import { formatPrice } from 'utils/formatPrice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { createOrder, addOrderDetails } from '../../../services/orderService';
import useAuth from 'hooks/useAuth';


const Cart = () => {
  const [show, setShow] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, cleanCart } = useCart();
  const {auth} = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrder = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        toast.error('Bạn chưa thêm món ăn vào giỏ hàng!');
        return;
      }

      let tableId = localStorage.getItem('tableId');

      if (!tableId) {
        toast.error('Chưa chọn bàn, vui lòng chọn bàn trước khi đặt món.');
        return;
      }

      console.log('Mã bàn:', tableId);

      let orderId = localStorage.getItem('orderId');

      if (!orderId) {
        const orderResponse = await createOrder(auth.token, { tableId });
        orderId = orderResponse?.data?.orderId;
        if (!orderId) {
          throw new Error('Không lấy được orderId từ API');
        }
        localStorage.setItem('orderId', orderId);
      }

      const orderDetails = cartItems.map(item => ({
        dishId: item.id,
        quantity: item.quantity
      }));

      await addOrderDetails(orderId, orderDetails, auth.token);

      cleanCart();
      toast.success('Đặt món thành công!');
    } catch (error) {
      console.error('Lỗi đặt món:', error);
      toast.error('Đặt món thất bại, vui lòng thử lại!');
    }
  };

  return (
    <>
      <Button variant="light" onClick={handleShow} className="d-flex align-items-center">
        <BsCartFill size={24} className="me-2" />
        <span style={{ fontSize: '1.2rem' }}>Giỏ hàng ({cartItems.length})</span>
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
            Giỏ hàng của bạn
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p style={{ fontSize: '1.1rem' }}>{cartItems.length} món trong giỏ hàng</p>
          <ListGroup>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex align-items-center" style={{ padding: '1rem' }}>
                  <Image src={item.image} alt={item.name} rounded style={{ width: '70px', height: '70px', marginRight: '15px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '1.2rem' }}>{item.name}</div>
                    <div style={{ fontSize: '1.1rem' }}>{formatPrice(item.price)}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="md"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
                    >
                      -
                    </Button>
                    <span className="mx-2" style={{ fontSize: '1.2rem' }}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="md"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      className="ms-2"
                      onClick={() => removeFromCart(item.id)}
                      style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
                    >
                      <BsXCircle />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item style={{ fontSize: '1.1rem' }}>Giỏ hàng trống</ListGroup.Item>
            )}
          </ListGroup>
          <div className="mt-3" style={{ fontSize: '1.2rem' }}>
            <Row>
              <Col>Tổng</Col>
              <Col className="text-end text-danger">{formatPrice(totalPrice)}</Col>
            </Row>
          </div>
          <div className="d-grid gap-2 mt-3">
            <Button
              variant="warning"
              onClick={handleOrder}
              style={{ fontSize: '1.3rem', padding: '0.75rem' }}
              disabled={!cartItems || cartItems.length === 0}
            >
              Đặt hàng
            </Button>
            <Button variant="success" as={Link} to="/user/home" onClick={handleClose} style={{ fontSize: '1.3rem', padding: '0.75rem' }}>
              Tiếp tục đặt món
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Cart;
