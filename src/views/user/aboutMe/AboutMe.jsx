import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { BsRobot, BsClock, BsStickyFill } from 'react-icons/bs';



import { Link } from 'react-router-dom';
import Banner from 'components/Banner/Banner';

const AboutMe = () => {
  return (
    <Container
      fluid
      className="text-center py-5"
      style={{
        background: '#1c1c1c', // Màu đen toàn màn hình
        color: '#FFFFFF',
        borderBottom: '2px solid #FFD700', // Viền vàng ánh kim
        minHeight: '150vh',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {/* Tiêu đề chính với font chữ sang trọng */}
      <h2
        className="fw-bold mb-3"
        style={{
          fontFamily: "'Arial', serif",
          fontSize: '3rem',
          color: '#FFA500',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          lineHeight: '3.0',
        }}
      >
        Đặc sản bốn phương – Đến là mê, ăn là ghiền!
      </h2>
      <h4
        className="fw-bold mb-4"
        style={{
          fontFamily: "'Arial', sans-serif",
          fontSize: '1.5rem',
          color: '#E5E7EB',
          letterSpacing: '1px',
          lineHeight: '1.3',
        }}
      >
        Menu mới ra mắt – Đừng bỏ lỡ cơ hội thưởng thức những hương vị độc đáo chỉ có tại đây
      </h4>

      {/* Nút CTA với hiệu ứng hover */}
      <Button
        as={Link}
        to="/user/home"
        variant="warning"
        size="lg"
        className="fw-bold px-5 py-3 my-4"
        style={{
          backgroundColor: '#FFA500',
          borderColor: '#FFA500',
          color: '#1C2526',
          fontFamily: "'Arial', sans-serif",
          letterSpacing: '1px',
          boxShadow: '0 4px 15px rgba(255, 165, 0, 0.5)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#FFD700';
          e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.7)';
          e.target.style.transform = 'translateY(-5px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FFA500';
          e.target.style.boxShadow = '0 4px 15px rgba(255, 165, 0, 0.5)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Xem thực đơn →
      </Button>

      <Banner />
    </Container>
  );

};

export default AboutMe;
