import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsChatLeftDotsFill, BsCartFill } from "react-icons/bs";
import LogoDishHub from "../../../assets/images/LogoDishHub.png";
import Cart from "views/user/cart/Cart";
import './Header.css';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm fixed-top">
      <Container className="user-header">
        {/* Logo */}
        <Navbar.Brand as={Link} to="/user/home">
          <Image src={LogoDishHub} alt="DishHub Logo" width={100} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Menu chính */}
          <Nav >
            <NavLink className= "nav-link "  to="/user/about-me">Giới thiệu</NavLink>
            <NavLink className= "nav-link"  to="/user/home">Trang chủ</NavLink>
            <NavLink className= "nav-link"  to="/user/checkout">Thanh toán</NavLink>
            <NavLink className= "nav-link"  to="/user/support">Hỗ trợ</NavLink>
          </Nav>

          {/* Menu bên phải */}
          <Nav className="ms-auto">
            <Cart />
            <Nav.Link as={Link} to="/user/chatbot">
              <BsChatLeftDotsFill size={20} className="me-1" /> Chat
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
