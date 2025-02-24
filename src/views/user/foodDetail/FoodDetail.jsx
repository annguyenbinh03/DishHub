import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { getDishDetail } from 'services/dishService';
import { formatPrice } from 'utils/formatPrice';
import ToastNotification from '../../../components/Toast/ToastNotification';
import './FoodDetail.css';
import { useCart } from 'contexts/CartContext';

const FoodDetail = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await getDishDetail(id);
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
    <Container className="my-5 food-detail-container">
      <Row className="align-items-center">
        <Col md={3} className="text-center">
          <Card.Img
            variant="top"
            src={dish?.image || 'https://via.placeholder.com/300'}
            alt={dish?.name || 'Tên món ăn'}
            className="food-detail-image"
          />
        </Col>
        <Col md={9}>
          <h2 className="food-detail-title">{dish?.name || 'Không có tên'}</h2>
          <p className="food-detail-description">{dish?.description || 'Không có mô tả'}</p>
          <h4 className="text-danger">{dish?.price ? formatPrice(dish.price) : 'Giá không có sẵn'}</h4>
          <div className="quantity-control">
            <Button variant="light" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
              -
            </Button>
            <span className="mx-2">{quantity}</span>
            <Button variant="light" onClick={() => setQuantity(quantity + 1)}>
              +
            </Button>
          </div>
          <Button variant="warning" className="mt-3" onClick={(e) => handleAddToCart(dish, e)}>
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <h5>Thành phần:</h5>
        {dish?.ingredients?.length > 0 ? (
          <Row className="menu-items">
            {dish.ingredients.map((ingredient) => (
              <Col key={ingredient.id} xs={12} sm={4} md={2} className="menu-item mb-3">
                <Card className="ingredient-list border-0 shadow-none">
                  <Row className="ingredient-card align-items-center">
                    <Col xs={4} className="text-left">
                      <Card.Img variant="top" src={ingredient.image} alt={ingredient.name} className="ingredient-image" />
                    </Col>
                    <Col xs={8}>
                      <Card.Body>
                        <Card.Title className="ingredient-name">{ingredient.name}</Card.Title>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>Không có thông tin thành phần.</p>
        )}
      </Row>
      <ToastNotification show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
    </Container>
  );
};

export default FoodDetail;
