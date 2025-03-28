import React, { useState } from 'react';
import { Offcanvas, Button, ListGroup, Image, Row, Col } from 'react-bootstrap';
import { BsCartFill, BsXCircle } from 'react-icons/bs';
import { useCart } from '../../../contexts/CartContext';
import { formatPrice } from 'utils/formatPrice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { createOrder, addOrderDetails } from '../../../services/orderService';
import useAuth from 'hooks/useAuth';
import useOrder from 'hooks/useOrder';


const Cart = () => {
  const [show, setShow] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, cleanCart } = useCart();
  const { auth } = useAuth();

  const {orderId, createOrderId, clearOrderId} = useOrder();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrder = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        toast.error('Bạn chưa thêm món ăn vào giỏ hàng!');
        return;
      }
      console.log(orderId);
      if(orderId == -1){
         const newOrderId = await createOrderId();
         console.log(newOrderId);
         if(newOrderId){
          const orderDetails = cartItems.map(item => ({
            dishId: item.id,
            quantity: item.quantity
          }));
    
          await addOrderDetails(newOrderId, orderDetails, auth.token);
    
          cleanCart();
          toast.success('Đặt món thành công!');
         }
      }else{
        const orderDetails = cartItems.map(item => ({
          dishId: item.id,
          quantity: item.quantity
        }));
  
        await addOrderDetails(orderId, orderDetails, auth.token);
  
        cleanCart();
        toast.success('Đặt món thành công!');
      }
    } catch (error) {
      console.error('Lỗi đặt món:', error);
      toast.error('Đặt món thất bại, vui lòng thử lại!');
    }
  };

  return (
    <>
      <Button
        variant="light"
        onClick={handleShow}
        className="d-flex align-items-center"
      >
        <BsCartFill size={24} className="me-2" />
        <span>
          Giỏ hàng ({cartItems.length})
        </span>
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{
          width: '600px',
          background: 'linear-gradient(135deg, #1c2526 0%, #000000 100%)', // Tông đen sang trọng
          color: '#ffffff',
          borderRadius: '0 0 0 20px',
        }}
      >
        <Offcanvas.Header
          closeButton
          style={{
            borderBottom: '1px solidrgb(255, 166, 0)',
            padding: '1.5rem',
            backgroundColor: '#1c2526',
          }}
        >
          <Offcanvas.Title
            className="fw-bold"
            style={{
              fontSize: '2rem',
              color: '#FFA500', // Changed color to #ff6200
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            }}
          >
            Giỏ hàng của bạn
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body style={{ padding: '2rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem' }}>
            {cartItems.length} món trong giỏ hàng
          </p>
          <ListGroup>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex align-items-center"
                  style={{
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #FFA500',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    rounded
                    style={{
                      width: '80px',
                      height: '80px',
                      marginRight: '20px',
                      border: '2px solid #FFA500',
                      borderRadius: '10px',
                    }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#000000' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '1.2rem', color: '#FFA500', fontWeight: '500' }}>
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="md"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        fontSize: '1.2rem',
                        padding: '0.5rem 1rem',
                        borderColor: '#ff6200',
                        color: '#FFA500',
                        borderRadius: '8px',
                        marginRight: '0.5rem',
                      }}
                    >
                      -
                    </Button>
                    <span
                      className="mx-2"
                      style={{ fontSize: '1.2rem', color: '#ffffff', backgroundColor: '#FFA500', padding: '0.5rem 1rem', borderRadius: '8px' }}
                    >
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="md"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        fontSize: '1.2rem',
                        padding: '0.5rem 1rem',
                        borderColor: '#FFA500',
                        color: '#FFA500',
                        borderRadius: '8px',
                        marginLeft: '0.5rem',
                      }}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      className="ms-2"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        fontSize: '1.2rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#d32f2f',
                        borderColor: '#d32f2f',
                        borderRadius: '8px',
                      }}
                    >
                      <BsXCircle />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item
                style={{
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                Giỏ hàng trống
              </ListGroup.Item>
            )}
          </ListGroup>
          <div
            className="mt-4"
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#ffffff',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)', // Enhanced shadow effect
            }}
          >
            <Row>
              <Col>Tổng: </Col>
              <Col className="text-end" style={{ color: '#ffffff' }}>
                {formatPrice(totalPrice)}
              </Col>
            </Row>
          </div>
          <div className="d-grid gap-2 mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="warning"
              onClick={handleOrder}
              style={{
                fontSize: '1.5rem',
                padding: '1rem',
                backgroundColor: '#ff6200',
                borderColor: '#FFA500',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)', // Enhanced shadow effect
                transition: 'all 0.3s ease',
                color: '#000000',
                width: '250px' // Adjusted width
              }}
              disabled={!cartItems || cartItems.length === 0}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#e65500')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#FFA500')}
            >
              Đặt hàng
            </Button>
            <Button
              variant="warning"
              as={Link}
              to="/user/home"
              onClick={handleClose}
              style={{
                fontSize: '1.5rem',
                padding: '1rem',
                backgroundColor: '#ff6200',
                borderColor: '#FFA500',
                color: '#000000',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)', // Enhanced shadow effect
                transition: 'all 0.3s ease',
                width: '250px' // Adjusted width
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#e65500')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#FFA500')}
            >
              Tiếp tục đặt món
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Cart;
