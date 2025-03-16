import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './tableManagement.css'; 
import useAuth from 'hooks/useAuth';
import { useAdminLayoutContext } from 'contexts/AdminLayoutContex'; // Import context

const TableManagement = () => {
    const { auth } = useAuth();
    const { selectedRestaurant } = useAdminLayoutContext(); // Lấy selectedRestaurant từ context

    const [tables, setTables] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentTable, setCurrentTable] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        restaurantId: '',
        isDeleted: false
    });

    const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
    };

    useEffect(() => {
        fetchTables();
    }, [selectedRestaurant]); // Fetch lại dữ liệu khi thay đổi nhà hàng

    const fetchTables = () => {
        axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables', config)
            .then((res) => setTables(res.data.data))
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu:', error);
                toast.error('Lỗi khi fetch dữ liệu!');
            });
    };

    const filteredTables = tables.filter((table) => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedRestaurant?.id ? table.restaurantId.toString() === selectedRestaurant.id.toString() : true) &&
        (selectedStatus === '' || (selectedStatus === 'true' ? table.isDeleted : !table.isDeleted))
    );

    return (
        <Container>
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý bàn</h2>
            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo tên bàn"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="me-2 search-input" // Add class name
                    />
                    <Form.Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="status-select" // Add class name
                    >
                        <option value="">Lọc theo trạng thái</option>
                        <option value="true">Không hoạt động</option>
                        <option value="false">Hoạt động</option>
                    </Form.Select>
                </div>
                <Button variant="success" onClick={() => setShowModal(true)}>Thêm bàn</Button>
            </div>

            <Table striped bordered hover responsive className="text-center fixed-table">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Tên bàn</th>
                        <th>Mô tả</th>
                        <th>Nhà hàng</th>
                        <th>Hình ảnh</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTables.length > 0 ? (
                        filteredTables.map((table, index) => (
                            <tr key={table.id}>
                                <td>{index + 1}</td>
                                <td>{table.name}</td>
                                <td>{table.description}</td>
                                <td>{table.restaurantName}</td>
                                <td><img src={table.restaurantImage} alt={table.restaurantName} className="restaurant-img rounded"/></td>
                                <td>
                                    <Badge bg={table.isDeleted ? 'danger' : 'success'}>
                                        {table.isDeleted ? 'Không hoạt động' : 'Hoạt động'}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => setCurrentTable(table)}>Sửa</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(table.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center">Không có dữ liệu.</td></tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default TableManagement;
