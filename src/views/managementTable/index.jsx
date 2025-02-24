import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './TableManagement.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableManagement = () => {
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

    useEffect(() => {
        fetchTables();
        fetchRestaurants();
    }, []);

    const fetchTables = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables')
            .then((res) => {
                setTables(res.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu:', error);
                toast.error('Lỗi khi fetch dữ liệu!');
            });
    };

    const fetchRestaurants = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants')
            .then((res) => {
                setRestaurants(res.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu nhà hàng:', error);
                toast.error('Lỗi khi fetch dữ liệu nhà hàng!');
            });
    };

    const toggleStatus = (id) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === id
                    ? { ...table, status: table.status === "Available" ? "Occupied" : "Available" }
                    : table
            )
        );
    };

    const handleShowModal = (table = null) => {
        setCurrentTable(table);
        setFormData(table ? { ...table } : {
            name: '',
            description: '',
            restaurantId: '',
            isDeleted: false
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (currentTable) {
            // Update table
            axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/${currentTable.id}`, formData)
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
            // Create table
            axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables', formData)
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
        axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/tables/${id}`)
            .then(() => {
                fetchTables();
                toast.success('Đã xóa thành công!');
            })
            .catch((error) => {
                console.error('Lỗi khi xóa dữ liệu:', error);
                toast.error('Lỗi khi xóa dữ liệu!');
            });
    };

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4"> Quản lý bàn </h2>
            <Button variant="success" className="mb-3" onClick={() => handleShowModal()}>Thêm bàn</Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Tên bàn</th>
                        <th>Mô tả</th>
                        <th>Nhà hàng</th>
                        <th>Hình ảnh nhà hàng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.length > 0 ? (
                        tables.map((table, index) => (
                            <tr key={table.id}>
                                <td>{index + 1}</td>
                                <td>{table.name}</td>
                                <td>{table.description}</td>
                                <td>{table.restaurantName}</td>
                                <td>
                                    <img src={table.restaurantImage} alt={table.restaurantName} className="restaurant-img rounded" />
                                </td>
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
                        <tr>
                            <td colSpan="7" className="text-center">Đang tải dữ liệu...</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentTable ? 'Cập nhật bàn' : 'Thêm bàn'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên bàn</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhà hàng</Form.Label>
                            <Form.Control
                                as="select"
                                name="restaurantId"
                                value={formData.restaurantId}
                                onChange={handleChange}
                            >
                                <option value="">Chọn nhà hàng</option>
                                {restaurants.map((restaurant) => (
                                    <option key={restaurant.id} value={restaurant.id}>
                                        {restaurant.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {currentTable && (
                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="isDeleted"
                                    value={formData.isDeleted ? 'false' : 'true'}
                                    onChange={(e) => setFormData({ ...formData, isDeleted: e.target.value === 'false' })}
                                >
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Không hoạt động</option>
                                </Form.Control>
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {currentTable ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TableManagement;