import React, { useState } from 'react';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { toast } from 'react-toastify';

const Signin1 = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        toast.success('Đăng nhập thành công!');
        navigate('/admin/select-restaurant');
      } else {
        toast.error('Đăng nhập thất bại!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicUserName">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Đăng nhập
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
