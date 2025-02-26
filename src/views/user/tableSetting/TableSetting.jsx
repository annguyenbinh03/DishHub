import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const TableSetting = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/restaurants/tables')
      .then(response => response.json())
      .then(data => {
        if (data.isSucess) {
          setRestaurants(data.data);
        }
      });

    // Kiểm tra dữ liệu trong localStorage
    const storedTable = JSON.parse(localStorage.getItem('selectedTable'));
    if (storedTable) {
      const today = new Date().toISOString().split('T')[0];
      if (storedTable.date !== today) {
        localStorage.removeItem('selectedTable');
      } else {
        setSelectedTable(storedTable.id);
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
  
    // Lưu cả ID bàn vào localStorage với key "tableId"
    localStorage.setItem('selectedTable', JSON.stringify({ id: selectedTable, date: today }));
    localStorage.setItem('tableId', selectedTable);  // Thêm dòng này để đảm bảo key tableId có giá trị
  
    alert('Bàn đã được lưu thành công!');
  };
  

  return (
    <Container fluid className="text-center my-5">
      <h1 className="fw-bold">Cài đặt bàn</h1>
      <div className="p-4 bg-white text-dark border border-dark rounded">
        <Form className="d-flex flex-column gap-3">
          {/* Chọn nhà hàng */}
          <Form.Group className="d-flex justify-content-between align-items-center">
            <Form.Label className="mb-0 me-2">Chọn nhà hàng:</Form.Label>
            <Form.Select className="w-50" value={selectedRestaurant} onChange={handleRestaurantChange}>
              <option value="">-- Chọn nhà hàng --</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          
          {/* Chọn bàn */}
          <Form.Group className="d-flex justify-content-between align-items-center">
            <Form.Label className="mb-0 me-2">Chọn bàn:</Form.Label>
            <Form.Select className="w-50" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
              <option value="">-- Chọn bàn --</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>{table.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Nút xác nhận */}
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedTable}>Xác nhận</Button>
        </Form>
      </div>
    </Container>
  );
};

export default TableSetting;
