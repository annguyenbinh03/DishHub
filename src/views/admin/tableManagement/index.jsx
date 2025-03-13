import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './tableManagement.css'; 
import useAuth from 'hooks/useAuth';

const TableManagement = () => {
    const { auth } = useAuth();
    const [tables, setTables] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentTable, setCurrentTable] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        restaurantId: '',
        isDeleted: false
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
    };

    useEffect(() => {
        fetchTables();
        fetchRestaurants();
    }, []);

    const fetchTables = () => {
        axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables', config)
            .then((res) => setTables(res.data.data))
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu:', error);
                toast.error('Lỗi khi fetch dữ liệu!');
            });
    };

    const fetchRestaurants = () => {
        axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants', config)
            .then((res) => setRestaurants(res.data.data))
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu nhà hàng:', error);
                toast.error('Lỗi khi fetch dữ liệu nhà hàng!');
            });
    };

    const handleShowModal = (table = null) => {
        setCurrentTable(table);
        setFormData(table ? { ...table } : { name: '', description: '', restaurantId: '', isDeleted: false });
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (currentTable) {
            axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables/${currentTable.id}`, formData, config)
                .then(() => {
                    fetchTables();
                    handleCloseModal();
                    toast.success(`Đã cập nhật ${formData.name} thành công!`);
                })
                .catch((error) => {
                    console.error('Lỗi khi cập nhật dữ liệu:', error);
                    toast.error('Lỗi khi cập nhật dữ liệu!');
                });
        } else {
            axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables', formData, config)
                .then(() => {
                    fetchTables();
                    handleCloseModal();
                    toast.success(`Đã thêm ${formData.name} thành công!`);
                })
                .catch((error) => {
                    console.error('Lỗi khi tạo dữ liệu:', error);
                    toast.error('Lỗi khi tạo dữ liệu!');
                });
        }
    };

    const handleDelete = (id) => {
        axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables/${id}`, config)
            .then(() => {
                fetchTables();
                toast.success('Đã xóa thành công!');
            })
            .catch((error) => {
                console.error('Lỗi khi xóa dữ liệu:', error);
                toast.error('Lỗi khi xóa dữ liệu!');
            });
    };

    const filteredTables = tables.filter((table) => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedRestaurant === '' || table.restaurantId.toString() === selectedRestaurant) &&
        (selectedStatus === '' || (selectedStatus === 'true' ? table.isDeleted : !table.isDeleted))
    );

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý bàn</h2>
            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex">
                    <Form.Control type="text" placeholder="Tìm kiếm theo tên bàn" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="me-2"/>
                    <Form.Select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)} className="me-2">
                        <option value="">Lọc theo nhà hàng</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">Lọc theo trạng thái</option>
                        <option value="true">Không hoạt động</option>
                        <option value="false">Hoạt động</option>
                    </Form.Select>
                </div>
                <Button variant="success" onClick={() => handleShowModal()}>Thêm bàn</Button>
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
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal(table)}>Sửa</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(table.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center">Không có dữ liệu.</td></tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentTable ? 'Cập nhật bàn' : 'Thêm bàn'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên bàn</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                    <Button variant="primary" onClick={handleSubmit}>{currentTable ? 'Cập nhật' : 'Thêm'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TableManagement;
