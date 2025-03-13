import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Form, InputGroup, Spinner } from 'react-bootstrap';
import { BsCartPlusFill, BsSearch } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { getDishes } from 'services/dishService';
import { formatPrice } from 'utils/formatPrice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { get } from 'jquery';
import { getCategories } from 'services/categoryService';

const Home = () => {
  const [dishes, setDishes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('default'); // Bộ lọc sắp xếp
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Lỗi lấy danh mục món ăn:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await getDishes();
        setDishes(response.data);
      } catch (error) {
        console.error('Lỗi lấy danh sách món ăn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const categoriesTab = [
    { label: 'Tất cả', value: 'all' },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.id
    }))
  ];

  const handleAddToCart = (dish, e) => {
    e.preventDefault();
    try {
      addToCart(dish);
      toast.success(`Đã thêm ${dish.name} vào giỏ hàng!`);
    } catch (error) {
      toast.error('Lỗi khi thêm vào giỏ hàng!');
    }
  };

  // Lọc món ăn theo danh mục và tìm kiếm
  let filteredDishes = dishes.filter((dish) => {
    const matchesCategory = filter === 'all' || dish.categoryId == filter;
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sắp xếp danh sách theo tiêu chí đã chọn
  if (sortOrder === 'priceAsc') {
    filteredDishes.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'priceDesc') {
    filteredDishes.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'soldCount') {
    filteredDishes.sort((a, b) => b.soldCount - a.soldCount);
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status" variant="warning">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="my-5 py-5">
      <h2 className="text-center mb-4">🍽️ Thực đơn nhà hàng 🍽️</h2>

      {/* Ô tìm kiếm */}
      <Form className="mb-3">
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

      {/* Bộ lọc danh mục */}
      <Nav variant="pills" activeKey={filter} onSelect={(selectedKey) => setFilter(selectedKey)} className="justify-content-center mb-3">
        {categoriesTab.map((cat) => (
          <Nav.Item key={cat.value}>
            <Nav.Link eventKey={cat.value} className="category-tab">
              {cat.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Bộ lọc sắp xếp */}
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Form.Label className="mb-0 fw-bold">Sắp xếp theo:</Form.Label>
        </Col>
        <Col xs={8} sm={6} md={4}>
          <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border-dark shadow-sm">
            <option value="default">Mặc định</option>
            <option value="priceAsc">Giá thấp đến cao</option>
            <option value="priceDesc">Giá cao đến thấp</option>
            <option value="soldCount">Bán chạy nhất</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Danh sách món ăn */}
      <Row>
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <Col key={dish.id} sm={6} md={4} lg={3} className="mb-4">
              <Card className="menu-card">
                <Card.Img
                  variant="top"
                  src={dish.image || 'https://via.placeholder.com/300'}
                  alt={dish.name}
                  className="menu-card-img"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-dark">{dish.name}</Card.Title>
                  <Card.Text className="text-muted text-truncate">{dish.description}</Card.Text>
                  <h5 className="text-danger text-left mt-auto">{formatPrice(dish.price)}</h5>
                  <div className="d-flex justify-content-between mt-2">
                    <Link to={`/user/dish/${dish.id}`} className="btn btn-warning w-75">
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

export default Home;
