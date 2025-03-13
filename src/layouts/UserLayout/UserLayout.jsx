import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import Header from './Header/Header';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const ROLES = {
  STAFF: '1',
  MANAGER: '2'
};

const UserLayout = ({ children }) => {
  const { auth, authLoading } = useAuth(); // Lấy authLoading từ context
  if (authLoading) {
    return <p>Loading...</p>; // Hoặc spinner đẹp hơn
  }

  const location = useLocation();

  return ROLES.STAFF === auth?.roleId ? (
    <React.Fragment>
      <Header /> {/* Header hiển thị ở tất cả các trang */}
      <Container className="py-4">
        {children} {/* Nội dung trang con sẽ hiển thị ở đây */}
      </Container>
    </React.Fragment>
  ) : auth?.username ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

UserLayout.propTypes = {
  children: PropTypes.node
};

export default UserLayout;
