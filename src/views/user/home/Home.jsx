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
import useAuth from 'hooks/useAuth';



const Home = () => {
  const [dishes, setDishes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const { addToCart } = useCart();

  const { auth } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(auth.token);
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
        const response = await getDishes(auth.token);
        setDishes(response.data);
      } catch (error) {
        console.error('Lỗi lấy danh sách món ăn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = '#1c1c1c';
    document.body.style.color = '#fff';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
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
    <Container className="my-5 py-5" style={{ backgroundColor: '#1c1c1c', color: '#fff' }}>
      <h2 className="text-center mb-4" style={{ color: '#FFA500', fontFamily: 'Arial, serif' }}>🍽️ Thực đơn nhà hàng 🍽️</h2>

      {/* Ô tìm kiếm */}
      <Form className="mb-4">
        <InputGroup
          style={{
            maxWidth: '600px', // Giới hạn chiều rộng để không quá dài
            margin: '0 auto', // Căn giữa ô tìm kiếm
            borderRadius: '25px', // Bo tròn góc cho toàn bộ InputGroup
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)', // Bóng đổ tinh tế
            overflow: 'hidden', // Đảm bảo bo tròn không bị cắt
            background: 'linear-gradient(90deg, #2C2C2C 0%, #1C2526 100%)', // Gradient nền nhẹ
          }}
        >
          <InputGroup.Text
            style={{
              backgroundColor: 'transparent', // Nền trong suốt để hòa với gradient
              border: 'none', // Bỏ viền mặc định
              color: '#FFA500', // Màu biểu tượng tìm kiếm là cam
              padding: '10px 15px', // Khoảng cách hợp lý
              transition: 'all 0.3s ease', // Hiệu ứng mượt mà
            }}
          >
            <BsSearch size={22} style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))' }} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-none" // Bỏ bóng mặc định của Bootstrap
            style={{
              backgroundColor: '#333', // Nền tối nhẹ
              color: '#fff', // Chữ trắng
              border: 'none', // Bỏ viền mặc định
              borderRadius: '0 25px 25px 0', // Bo tròn góc bên phải
              padding: '12px 20px', // Tăng khoảng đệm để dễ nhập
              fontFamily: "'Arial', sans-serif", // Font hiện đại
              fontSize: '1.1rem', // Kích thước chữ lớn hơn một chút
              transition: 'all 0.3s ease', // Hiệu ứng mượt mà
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#3C3C3C'; // Sáng hơn khi focus
              e.target.style.color = '#FFA500'; // Chữ chuyển thành màu cam
              e.target.style.boxShadow = 'inset 0 0 5px rgba(255, 165, 0, 0.5)'; // Hiệu ứng sáng bên trong
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = '#333'; // Trở lại màu ban đầu
              e.target.style.color = '#fff';
              e.target.style.boxShadow = 'none';
            }}
          />
        </InputGroup>
      </Form>

      {/* Bộ lọc danh mục */}
      <Nav
        variant="pills"
        activeKey={filter} // Đồng bộ với filter state
        onSelect={(selectedKey) => setFilter(selectedKey)} // Cập nhật trạng thái filter khi chọn tab
        className="justify-content-center mb-4"
        style={{
          backgroundColor: '#2C2C2C', // Nền tối để làm nổi bật các tab
          padding: '10px 0', // Thêm khoảng đệm để thoáng hơn
          borderRadius: '12px', // Bo tròn góc cho toàn bộ Nav
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Bóng đổ tinh tế
        }}
      >
        {categoriesTab.map((cat) => (
          <Nav.Item key={cat.value}>
            <Nav.Link
              eventKey={cat.value}
              className="category-tab"
              style={{
                color: filter === cat.value ? '#1C2526' : '#FFA500', // Màu chữ thay đổi khi active
                backgroundColor: filter === cat.value ? '#FFA500' : 'transparent', // Nền cam khi active
                fontWeight: '600',
                fontFamily: "'Arial', serif", // Font sang trọng
                borderRadius: '20px', // Bo tròn góc cho từng tab
                margin: '0 8px', // Khoảng cách giữa các tab
                padding: '10px 20px', // Kích thước tab rộng rãi hơn
                transition: 'all 0.3s ease', // Hiệu ứng mượt mà
                border: filter === cat.value ? 'none' : '1px solid #FFA500', // Viền cam khi không active
                boxShadow: filter === cat.value ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none', // Bóng đổ khi active
              }}
              onMouseEnter={(e) => {
                if (filter !== cat.value) {
                  e.target.style.backgroundColor = '#D4AF37'; // Vàng ánh kim khi hover
                  e.target.style.color = '#1C2526';
                  e.target.style.border = 'none';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== cat.value) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFA500';
                  e.target.style.border = '1px solid #FFA500';
                }
              }}
            >
              {cat.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>


      {/* Bộ lọc sắp xếp */}
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Form.Label className="mb-0 fw-bold" style={{ color: '#fff' }}>Sắp xếp theo:</Form.Label>
        </Col>
        <Col xs={8} sm={6} md={4}>
          <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border-dark shadow-sm" style={{ backgroundColor: '#333', color: '#fff' }}>
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
            <Col key={dish.id} sm={6} md={4} lg={3} className="mb-5">
              <Card
                className="menu-card"
                style={{
                  backgroundColor: '#2C2C2C', // Nền tối sang trọng
                  border: '1px solid #FFA500', // Viền cam nhẹ
                  borderRadius: '12px', // Bo tròn góc mềm mại
                  overflow: 'hidden', // Đảm bảo bo tròn không bị cắt
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)', // Bóng đổ tinh tế
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Hiệu ứng phóng to và bóng đổ khi hover
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'; // Phóng to nhẹ khi hover
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)'; // Tăng bóng đổ
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Card.Img
                    variant="top"
                    src={dish.image || 'https://via.placeholder.com/300'}
                    alt={dish.name}
                    className="menu-card-img"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '12px 12px 0 0', // Bo tròn góc trên
                      filter: 'brightness(90%)', // Làm tối nhẹ để nổi bật nội dung
                      transition: 'filter 0.3s ease', // Hiệu ứng sáng lên khi hover
                    }}
                    onMouseEnter={(e) => (e.target.style.filter = 'brightness(100%)')} // Sáng hơn khi hover
                    onMouseLeave={(e) => (e.target.style.filter = 'brightness(90%)')}
                  />
                  {/* Hiệu ứng overlay khi hover */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      borderRadius: '12px 12px 0 0',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = '1')}
                    onMouseLeave={(e) => (e.target.style.opacity = '0')}
                  />
                </div>
                <Card.Body
                  className="d-flex flex-column"
                  style={{
                    color: '#ffff',
                    padding: '1.5rem', // Tăng khoảng đệm để thoáng hơn
                    background: 'linear-gradient(180deg, #2C2C2C 0%, #1C2526 100%)', // Gradient nhẹ cho nền
                  }}
                >
                  <Card.Title
                    style={{
                      color: '#FFA500', // Màu cam cho tên món ăn
                      fontFamily: "'Arial', serif", // Font sang trọng
                      fontSize: '1.25rem',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', // Bóng chữ nhẹ
                    }}
                  >
                    {dish.name}
                  </Card.Title>
                  <Card.Text
                    className="text-muted text-truncate"
                    style={{
                      fontFamily: "'Arial', sans-serif", // Font hiện đại
                      fontSize: '0.9rem',
                      color: '#ffff !important', // Đổi màu chữ thành trắng và thêm !important
                      marginBottom: '1rem',
                    }}
                  >
                    {dish.description}
                  </Card.Text>
                  <h5
                    className="text-danger text-left mt-auto"
                    style={{
                      color: '#FF6347', // Đỏ đậm cho giá
                      fontFamily: "'Arial', sans-serif",
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    {formatPrice(dish.price)}
                  </h5>
                  <h5>
                    <span
                      className="badge"
                      style={{
                        background: 'linear-gradient(135deg, #FFA500 0%, #D4AF37 100%)', // Gradient từ cam đến vàng ánh kim
                        color: '#1C2526', // Chữ đen đậm để nổi bật trên nền sáng
                        fontSize: '0.9rem', // Kích thước chữ nhỏ gọn nhưng dễ đọc
                        fontFamily: "'Montserrat', sans-serif", // Font hiện đại
                        fontWeight: '600', // Chữ đậm vừa phải
                        padding: '6px 12px', // Khoảng đệm hợp lý
                        borderRadius: '20px', // Bo tròn góc để sang trọng
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Bóng đổ nhẹ
                        transition: 'all 0.3s ease', // Hiệu ứng mượt mà
                        display: 'inline-flex', // Đảm bảo căn chỉnh tốt
                        alignItems: 'center', // Căn giữa nội dung
                        gap: '5px', // Khoảng cách giữa biểu tượng và chữ
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)'; // Phóng to nhẹ khi hover
                        e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      <span style={{ fontSize: '1rem', color: '#FF6347' }}>🔥</span> {/* Biểu tượng lửa để thêm phần hấp dẫn */}
                      Lượt bán: {dish.soldCount} {/* Hiển thị số lượng đã bán với từ "Lượt bán:" */}
                    </span>
                  </h5>
                  <div className="d-flex justify-content-between mt-3">
                    <Link
                      to={`/user/dish/${dish.id}`}
                      className="btn btn-warning w-75"
                      style={{
                        backgroundColor: '#FFA500', // Màu cam
                        borderColor: '#FFA500',
                        color: '#1C2526', // Chữ đen đậm để nổi bật
                        fontFamily: "'Arial', sans-serif",
                        fontWeight: '600',
                        borderRadius: '8px', // Bo tròn góc
                        padding: '8px 12px', // Kích thước nút hợp lý
                        transition: 'all 0.3s ease', // Hiệu ứng mượt mà
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Bóng đổ nhẹ
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#D4AF37'; // Vàng ánh kim khi hover
                        e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#FFA500';
                        e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      Xem chi tiết
                    </Link>
                    <Button
                      variant="outline-danger"
                      className="d-flex align-items-center justify-content-center"
                      onClick={(e) => handleAddToCart(dish, e)}
                      style={{
                        borderColor: '#FF6347', // Viền đỏ đậm
                        color: '#FF6347', // Màu biểu tượng đỏ đậm
                        backgroundColor: 'transparent',
                        borderRadius: '8px', // Bo tròn góc
                        width: '40px', // Kích thước nút hợp lý
                        height: '40px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Bóng đổ nhẹ
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#FF6347'; // Đổi màu nền khi hover
                        e.target.style.color = '#fff'; // Đổi màu biểu tượng khi hover
                        e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#FF6347'; // Đổi lại màu biểu tượng khi không hover
                        e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      🛒 {/* Sử dụng biểu tượng Unicode giỏ hàng */}
                    </Button>


                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p
            className="text-center"
            style={{
              color: '#fff',
              fontFamily: "'Arial', serif",
              fontSize: '1.2rem',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', // Bóng chữ nhẹ
            }}
          >
            Không tìm thấy món ăn phù hợp.
          </p>
        )}
      </Row>
    </Container>
  );

};

export default Home;
