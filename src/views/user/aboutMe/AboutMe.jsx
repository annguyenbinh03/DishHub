import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { BsRobot, BsClock, BsStickyFill } from 'react-icons/bs';
import menuImage from '../../../assets/images/menuTinhTe.webp';
import aiImage from '../../../assets/images/troLyAi.webp';
import orderImage from '../../../assets/images/goiMonNhanh.webp';


import { Link } from 'react-router-dom';

const AboutMe = () => {
  return (
    <Container
      fluid
      className="text-center py-5"
      style={{
        background: '#000000', // Màu đen
        color: '#FFFFFF',
        borderBottom: '2px solid #FFD700', // Viền vàng ánh kim
        minHeight: '100vh',
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
          lineHeight: '2.0',
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

      {/* Các mục đặc trưng */}
      <Row className="mt-5 justify-content-center">
        <Col md={4} className="text-center mb-4">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
          >
            <BsStickyFill size={50} color="#FFA500" />
            <h5
              className="mt-3"
              style={{
                fontFamily: "'Arial', serif",
                color: '#1C2526',
                fontSize: '1.5rem',
                lineHeight: '1.3',
              }}
            >
              Menu tinh tế
            </h5>
            <p
              className="text-muted"
              style={{
                fontFamily: "'Arial', sans-serif",
                color: '#6B7280',
                lineHeight: '1.5',
              }}
            >
              Khám phá sự đa dạng của chúng tôi và các món ăn được làm với niềm đam mê
            </p>
            <Image
              src={menuImage}
              fluid
              rounded
              style={{
                border: '2px solid #FFD700',
                maxHeight: '200px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        </Col>

        <Col md={4} className="text-center mb-4">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
          >
            <BsRobot size={50} color="#FFA500" />
            <h5
              className="mt-3"
              style={{
                fontFamily: "'Arial', serif",
                color: '#1C2526',
                fontSize: '1.5rem',
                lineHeight: '1.3',
              }}
            >
              Trợ lí AI
            </h5>
            <p
              className="text-muted"
              style={{
                fontFamily: "'Arial', sans-serif",
                color: '#6B7280',
                lineHeight: '1.5',
              }}
            >
              Nhận các đề xuất và câu trả lời ngay lập tức cho các câu hỏi ăn uống của bạn
            </p>
            <Image
              src={aiImage}
              fluid
              rounded
              style={{
                border: '2px solid #FFD700',
                maxHeight: '200px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        </Col>

        <Col md={4} className="text-center mb-4">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
          >
            <BsClock size={50} color="#FFA500" />
            <h5
              className="mt-3"
              style={{
                fontFamily: "'Arial', serif",
                color: '#1C2526',
                fontSize: '1.5rem',
                lineHeight: '1.3',
              }}
            >
              Gọi món nhanh
            </h5>
            <p
              className="text-muted"
              style={{
                fontFamily: "'Arial', sans-serif",
                color: '#6B7280',
                lineHeight: '1.5',
              }}
            >
              Quá trình đặt hàng đơn giản, nhanh chóng và tiện lợi cho bữa ăn của bạn
            </p>
            <Image
              src={orderImage}
              fluid
              rounded
              style={{
                border: '2px solid #FFD700',
                maxHeight: '200px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );

};

export default AboutMe;
