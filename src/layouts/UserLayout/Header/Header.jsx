import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsChatLeftDotsFill, BsCartFill } from "react-icons/bs";
import LogoDishHub from "../../../assets/images/LogoDishHub.png";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/user/home">
          <Image src={LogoDishHub} alt="DishHub Logo" width={100} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Menu chính */}
          <Nav>
            <Nav.Link as={Link} to="/user/home">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/user/menu">Thực đơn</Nav.Link>
            <Nav.Link as={Link} to="/user/pay">Thanh toán</Nav.Link>
            <Nav.Link as={Link} to="/user/help">Hỗ trợ</Nav.Link>
          </Nav>

          {/* Menu bên phải */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart">
              <BsCartFill size={20} className="me-1" /> Giỏ hàng
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              <BsChatLeftDotsFill size={20} className="me-1" /> Chat
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
