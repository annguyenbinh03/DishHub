import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Form, InputGroup } from 'react-bootstrap';
import { BsCartPlusFill, BsSearch } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import './Menu.css';
import { getDishes } from 'services/dishService';
import Spinner from 'components/Loader/Spinner';
import { formatPrice } from 'utils/formatPrice';
import { toast } from 'react-toastify';

const categories = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Món chính', value: 1 },
  { label: 'Món khai vị', value: 2 },
  { label: 'Món tráng miệng', value: 3 },
  { label: 'Đồ uống', value: 7 }
];

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  const fetchDishes = async () => {
    try {
      const response = await getDishes();
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleAddToCart = (dish, e) => {
    e.preventDefault();
    try {
      addToCart(dish);
      toast.success(`Đã thêm ${dish.name} vào giỏ hàng!`);
    } catch (error) {
      toast.error('Lỗi khi thêm vào giỏ hàng!');
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = filter === 'all' || dish.categoryId === Number(filter);
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">🍽️ Thực đơn nhà hàng 🍽️</h2>

      <Form className="mb-4">
        <InputGroup>
          <InputGroup.Text className="bg-light border-dark">
            <BsSearch className="text-dark" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-dark shadow-sm"
          />
        </InputGroup>
      </Form>

      <Nav
        variant="pills"
        activeKey={filter}
        onSelect={(selectedKey) => setFilter(selectedKey === 'all' ? 'all' : Number(selectedKey))}
        className="justify-content-center mb-4"
      >
        {categories.map((cat) => (
          <Nav.Item key={cat.value}>
            <Nav.Link eventKey={cat.value} className="category-tab">
              {cat.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row>
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <Col key={dish.id} sm={2} md={4} lg={3} className="mb-4">
                <Card className="menu-card">
                  <Card.Img variant="top" src={dish.image} alt={dish.name} className="menu-card-img" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-left text-dark">{dish.name}</Card.Title>
                    <Card.Text className="text-muted text-truncate">{dish.description}</Card.Text>
                    <h5 className="text-danger text-left mt-auto">{formatPrice(dish.price)}</h5>
                    <div className="d-flex justify-content-between mt-2">
                      <Link to={`/user/menu/${dish.id}`} className="btn btn-warning w-75">
                        Xem chi tiết
                      </Link>
                      <Button
                        variant="outline-danger"
                        className="d-flex align-items-center justify-content-center"
                        onClick={(e) => handleAddToCart(dish, e)}
                      >
                        <BsCartPlusFill />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Không tìm thấy món ăn phù hợp.</p>
        )}
      </Row>
    </Container>
  );
};

export default Menu;