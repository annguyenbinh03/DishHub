import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getTables } from 'services/tableService';
import useAuth from 'hooks/useAuth';

const TableSetting = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => { 
    getTables(auth.token)
      .then(data => {
        if (data.isSucess) {
          setRestaurants(data.data);
        }
      });
  
    const storedTableData = JSON.parse(localStorage.getItem('selectedTable'));
    if (storedTableData) {
      const today = new Date().toISOString().split('T')[0];
      if (storedTableData.date !== today) {
        localStorage.removeItem('selectedTable');
        localStorage.removeItem('tableId');
      } else {
        setSelectedTable(storedTableData.id); 
        localStorage.setItem('tableId', storedTableData.id);
      }
    }
  }, []);

  const handleRestaurantChange = (e) => {
    const restaurantId = e.target.value;
    setSelectedRestaurant(restaurantId);
    const selectedRest = restaurants.find(r => r.id.toString() === restaurantId);
    setTables(selectedRest ? selectedRest.tables : []);
    setSelectedTable('');
  };

  const handleConfirm = () => {
    if (!selectedTable) return;
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('selectedTable', JSON.stringify({ id: selectedTable, date: today }));
    localStorage.setItem('tableId', selectedTable);

    toast.success('Bàn đã được lưu thành công!');
    navigate('/user/about-me');   
  };

  return (
    <Container fluid className="text-center my-5">
      <h1 className="fw-bold">Cài đặt bàn</h1>
      <div className="p-4 bg-white text-dark border border-dark rounded">
        <Form className="d-flex flex-column gap-3">
          <Form.Group className="d-flex justify-content-between align-items-center">
            <Form.Label className="mb-0 me-2">Chọn nhà hàng:</Form.Label>
            <Form.Select className="w-50" value={selectedRestaurant} onChange={handleRestaurantChange}>
              <option value="">-- Chọn nhà hàng --</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="d-flex justify-content-between align-items-center">
            <Form.Label className="mb-0 me-2">Chọn bàn:</Form.Label>
            <Form.Select 
              className="w-50"
              value={selectedTable} 
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">-- Chọn bàn --</option>
              {tables.map((table) => (
                <option 
                  key={table.id} 
                  value={table.id} 
                  disabled={table.status === 'occupied'}
                  style={{ color: table.status === 'occupied' ? 'red' : 'green' }}
                >
                  {table.name} ({table.status === 'occupied' ? 'Đã có người' : 'Trống'})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" onClick={handleConfirm} disabled={!selectedTable}>Xác nhận</Button>
        </Form>
      </div>
    </Container>
  );
};

export default TableSetting;
