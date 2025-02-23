import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Dropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import './FoodManagement.css';
import { getAdminDishes } from 'services/dishService';
import { contains } from 'jquery';

const FoodManagement = () => {
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const fetchdata = async () => {
        const response = await getAdminDishes();
        setDishes(response.data.dishes);
        console.log(response.data.dishes);
    }
    useEffect(() => {
        fetchdata();
    }, []);

    useEffect(() => {
        let filtered = dishes;
        if (searchTerm) {
            filtered = filtered.filter(dish =>
                dish.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(dish => dish.status === statusFilter);
        }
        setFilteredDishes(filtered);
    }, [searchTerm, statusFilter, dishes]);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">🍽️ Quản lý đồ ăn 🍽️</h2>

            {/* Bộ lọc */}
            <Form className="mb-3 d-flex gap-3">
                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="onsale">Đang bán</option>
                    <option value="soldout">Hết hàng</option>
                </Form.Select>
            </Form>

            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Tên món</th>
                        <th>Mô tả</th>
                        <th>Loại</th>
                        <th>Giá</th>
                        <th>Đã bán</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDishes.length > 0 ? (
                        filteredDishes.map((dish, index) => (
                            <tr key={dish.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={dish.image} alt={dish.name} className="food-img rounded" />
                                </td>
                                <td>{dish.name}</td>
                                <td>{dish.description}</td>
                                <td>{dish.categoryId}</td>
                                <td>{dish.price} đ</td>
                                <td>{dish.soldCount}</td>
                                <td>
                                    <Badge bg={dish.status === 'onsale' ? 'success' : 'secondary'}>
                                        {dish.status === 'onsale' ? 'Đang bán' : 'Hết hàng'}
                                    </Badge>
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            ...
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#">
                                                <Button variant="primary" size="sm">Cập nhật</Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#">
                                                <Button variant="danger" size="sm">Xóa</Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#">
                                                <Button variant="success" size="sm">Thêm</Button>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">Không tìm thấy dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default FoodManagement;
