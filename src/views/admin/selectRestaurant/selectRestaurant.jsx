import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const SelectRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const navigate = useNavigate();

  const { auth } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }  
      try {
        const response = await fetch(
          'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants',
          config
        );
        const data = await response.json();
        if (data.isSucess) {
          setRestaurants(data.data);
        } else {
          toast.error('Lấy danh sách nhà hàng thất bại!');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra!');
      }
    };
  
    fetchRestaurants();
  
    const storedRestaurantData = JSON.parse(localStorage.getItem('selectedRestaurant'));
    if (storedRestaurantData) {
      const today = new Date().toISOString().split('T')[0];
      if (storedRestaurantData.date !== today) {
        localStorage.removeItem('selectedRestaurant');
      } else {
        setSelectedRestaurant(storedRestaurantData.id);
      }
    }
  }, []);
  

  const handleConfirm = () => {
    if (!selectedRestaurant) return;

    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('restaurantId', JSON.stringify({ id: selectedRestaurant, date: today }));

    toast.success('Nhà hàng đã được lưu thành công!');
    navigate('/admin/dashboard');
  };

  return (
    <Container fluid className="text-center my-5">
      <h1 className="fw-bold">Chọn nhà hàng</h1>
      <div className="p-4 bg-white text-dark border border-dark rounded" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Form className="d-flex flex-column gap-3">
          <Form.Group className="d-flex justify-content-between align-items-center">
            <Form.Label className="mb-0 me-2">Chọn nhà hàng:</Form.Label>
            <Form.Select className="w-50" value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)}>
              <option value="">-- Chọn nhà hàng --</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedRestaurant}>Xác nhận</Button>
        </Form>
      </div>
    </Container>
  );
};

export default SelectRestaurant;
