import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { getDishDetail } from 'services/dishService';
import { formatPrice } from 'utils/formatPrice';
import ToastNotification from '../../../components/Toast/ToastNotification';
import { useCart } from 'contexts/CartContext';
import useAuth from 'hooks/useAuth';

const FoodDetail = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const [toast, setToast] = useState({ show: false, message: '' });
  const { auth } = useAuth();
  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await getDishDetail(id, auth.token);
        setDish(response.data);
      } catch (error) {
        setError('Không thể tải thông tin món ăn.');
        console.error('Error fetching dish detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleAddToCart = (dish, e) => {
    e.preventDefault();
    try {
      addToCart(dish);
      setToast({ show: true, message: `Đã thêm ${dish.name} vào giỏ hàng!`, variant: 'success' });
    } catch (error) {
      setToast({ show: true, message: 'Lỗi khi thêm vào giỏ hàng!', variant: 'error' });
    }
  };

  if (loading) {
    return <p className="text-center">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <Container className="my-5 food-detail-container py-5 bg-dark text-white rounded shadow-lg" style={{
      border: '2px solid #FFA500',
      background: 'linear-gradient(145deg, #1a1a1a 0%, #333333 100%)', // Gradient nền đen sang trọng
      boxShadow: '0 8px 30px rgba(255, 98, 0, 0.3)' // Hiệu ứng bóng cam nhẹ
    }}>
      <Row className="align-items-center p-4">
        <Col md={4} className="text-center">
          <Card className="bg-secondary text-white shadow-lg rounded-lg overflow-hidden" style={{
            border: '3px solid #FFA500',
            transition: 'transform 0.3s ease-in-out'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <Card.Img
              variant="top"
              src={dish?.image || 'https://via.placeholder.com/300'}
              alt={dish?.name || 'Tên món ăn'}
              className="food-detail-image rounded-top"
              style={{
                borderBottom: '2px solid #FFA500',
                objectFit: 'cover',
                height: '250px',
                filter: 'brightness(90%)', // Tăng độ sáng nhẹ cho ảnh món ăn
                borderRadius: '15px' // Bo tròn khung ảnh
              }}
            />
          </Card>
        </Col>
        <Col md={8}>
          <h2 className="food-detail-title text-warning font-weight-bold" style={{
            fontFamily: "'Arial', serif", // Font chữ sang trọng
            color: '#ff6200',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Hiệu ứng bóng chữ
            borderBottom: '1px solid #FFA500',
            paddingBottom: '10px'
          }}>{dish?.name || 'Không có tên'}</h2>
          <p className="food-detail-description text-light mt-3" style={{
            fontFamily: "'Roboto', sans-serif",
            lineHeight: '1.6',
            color: '#d3d3d3'
          }}>{dish?.description || 'Không có mô tả'}</p>
          <h4 className="text-danger font-weight-bold" style={{
            color: '#ff4500', // Cam đậm hơn một chút để nổi bật
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)'
          }}>{dish?.price ? formatPrice(dish.price) : 'Giá không có sẵn'}</h4>
          <div className="quantity-control d-flex align-items-center mt-3">
            <Button variant="outline-light" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} style={{
              borderColor: '#ff6200',
              color: '#ff6200',
              transition: 'all 0.3s ease',
              padding: '5px 15px'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff6200';
              e.currentTarget.style.color = '#fff';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff6200';
            }}>
              -
            </Button>
            <span className="mx-3 h4" style={{ color: '#fff', fontWeight: 'bold' }}>{quantity}</span>
            <Button variant="outline-light" onClick={() => setQuantity(quantity + 1)} style={{
              borderColor: '#ff6200',
              color: '#ff6200',
              transition: 'all 0.3s ease',
              padding: '5px 15px'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff6200';
              e.currentTarget.style.color = '#fff';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff6200';
            }}>
              +
            </Button>
          </div>
          <Button variant="warning" className="mt-3 px-4 py-2 font-weight-bold shadow-lg" onClick={(e) => handleAddToCart(dish, e)} style={{
            backgroundColor: '#FFA500',
            borderColor: '#FFA500',
            color: '#fff',
            fontFamily: "'Roboto', sans-serif",
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 98, 0, 0.5)'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e65b00';
            e.currentTarget.style.transform = 'scale(1.05)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff6200';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <h5 className="text-warning font-weight-bold" style={{
          fontFamily: "'Arial', serif",
          color: '#ff6200',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
          borderLeft: '4px solid #FFA500',
          paddingLeft: '10px'
        }}>Thành phần:</h5>
        {dish?.ingredients?.length > 0 ? (
          <Row className="menu-items mt-3">
            {dish.ingredients.map((ingredient) => (
              <Col key={ingredient.id} xs={12} sm={6} md={4} lg={3} className="menu-item mb-3">
                <Card className="bg-light text-dark shadow rounded d-flex flex-row align-items-center p-2" style={{
                  background: 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)', // Gradient nền sáng nhẹ
                  border: '2px solid #FFA500',
                  transition: 'transform 0.3s ease-in-out'
                }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <Card.Img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="ingredient-image rounded-circle border border-warning"
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      border: '2px solid #FFA500',
                      boxShadow: '0 2px 8px rgba(255, 98, 0, 0.3)'
                    }}
                  />
                  <Card.Body className="p-2">
                    <Card.Title className="ingredient-name mb-0 font-weight-bold" style={{
                      fontFamily: "'Roboto', sans-serif",
                      color: '#333',
                      fontSize: '1rem'
                    }}>{ingredient.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted" style={{ fontStyle: 'italic', color: '#b0b0b0' }}>Không có thành phần nào</p>
        )}
      </Row>

      <ToastNotification show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
    </Container>
  );

};

export default FoodDetail;
