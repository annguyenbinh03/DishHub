import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ToastNotification = ({ show, message, onClose, variant = 'success' }) => {
  const bgColor = variant === 'success' ? 'success' : variant === 'error' ? 'danger' : 'warning';

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} delay={3000} autohide bg={bgColor}>
        <Toast.Header>
          <strong className="me-auto">
            {variant === 'success' ? '✅ Thành công' : variant === 'error' ? '❌ Lỗi' : '⚠️ Cảnh báo'}
          </strong>
          <small>Vừa xong</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
