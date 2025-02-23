import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { BsRobot, BsClock, BsStickyFill } from 'react-icons/bs';
import menuImage from '../../../assets/images/LogoDishHub.png';
import aiImage from '../../../assets/images/LogoDishHub.png';
import orderImage from '../../../assets/images/LogoDishHub.png';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="text-center my-5">
      <h2 className="fw-bold">Đặc sản bốn phương – Đến là mê, ăn là ghiền!</h2>
      <p className="text-muted">Menu mới ra mắt – Đừng bỏ lỡ cơ hội thưởng thức những hương vị độc đáo chỉ có tại đây</p>

      <Button as={Link} to="/user/menu" variant="warning" size="lg" className="fw-bold px-4 my-3">
        Xem thực đơn →
      </Button>

      <Row className="mt-4">
        <Col md={4} className="text-center">
          <BsStickyFill size={40} color="#FFA500" />
          <h5 className="mt-3">Menu tinh tế</h5>
          <p className="text-muted">Khám phá sự đa dạng của chúng tôi và các món ăn được làm với niềm đam mê</p>
          <Image src={menuImage} fluid rounded />
        </Col>

        <Col md={4} className="text-center">
          <BsRobot size={40} color="#FFA500" />
          <h5 className="mt-3">Trợ lí AI</h5>
          <p className="text-muted">Nhận các đề xuất và câu trả lời ngay lập tức cho các câu hỏi ăn uống của bạn</p>
          <Image src={aiImage} fluid rounded />
        </Col>

        <Col md={4} className="text-center">
          <BsClock size={40} color="#FFA500" />
          <h5 className="mt-3">Gọi món nhanh</h5>
          <p className="text-muted">Quá trình đặt hàng đơn giản, nhanh chóng và tiện lợi cho bữa ăn của bạn</p>
          <Image src={orderImage} fluid rounded />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
