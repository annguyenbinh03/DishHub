import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ToastNotification = ({ show, message, onClose, variant = 'success' }) => {
  const bgColor = variant === 'success' ? 'rgba(76, 175, 80, 0.9)' : variant === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(255, 193, 7, 0.9)';
  const textColor = 'white';
  const icon = variant === 'success' ? '✅' : variant === 'error' ? '❌' : '⚠️';

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{
        zIndex: 10000,
        position: 'fixed', 
        top: '10px',      
        right: '10px',     
      }}
    >
      <Toast show={show} onClose={onClose} delay={3000} autohide
        style={{
          backgroundColor: bgColor,
          color: textColor,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toast.Header style={{ backgroundColor: 'transparent', color: textColor, borderBottom: 'none' }}>
          <strong className="me-auto">{icon} {variant === 'success' ? 'Thành công' : variant === 'error' ? 'Lỗi' : 'Cảnh báo'}</strong>
          <small>Vừa xong</small>
        </Toast.Header>
        <Toast.Body style={{ color: textColor }}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
