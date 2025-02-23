import React, { useState } from 'react';
import { Offcanvas, Button, ListGroup, Image, Row, Col } from 'react-bootstrap';
import { BsCartFill, BsXCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

const Cart = () => {
  const [show, setShow] = useState(false);
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Button variant="light" onClick={handleShow} className="d-flex align-items-center">
        <BsCartFill size={20} className="me-1" />
        Giỏ hàng ({cartItems.length})
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Giỏ hàng của bạn</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>{cartItems.length} món trong giỏ hàng</p>
          <ListGroup>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex align-items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    rounded
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div>{item.name}</div>
                    <div>{item.price} VND</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <BsXCircle />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Giỏ hàng trống</ListGroup.Item>
            )}
          </ListGroup>
          <div className="mt-3">
            <Row>
              <Col>Tổng</Col>
              <Col className="text-end">{totalPrice} VND</Col>
            </Row>
          </div>
          <div className="d-grid gap-2 mt-3">
            <Button variant="warning" as={Link} to="/checkout">
              Đặt hàng
            </Button>
            <Button variant="success" onClick={handleClose}>
              Tiếp tục đặt món
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Cart;