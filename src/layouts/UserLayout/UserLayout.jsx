import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import Header from "./Header/Header";

const UserLayout = ({ children }) => {
  return (
    <>
      <Header /> {/* Header hiển thị ở tất cả các trang */}
      <Container className="py-4">
        {children} {/* Nội dung trang con sẽ hiển thị ở đây */}
      </Container>
    </>
  );
};

UserLayout.propTypes = {
  children: PropTypes.node
};

export default UserLayout;
