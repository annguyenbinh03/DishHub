import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const PaySuccess = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center py-4">
        <FaCheckCircle size={80} color="green" className="mb-3" />
        <h4 className="mb-3">Thanh toán thành công!</h4>
        <div className="mb-3">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</div>
      </div>
    </Container>
  );
};

export default PaySuccess;
