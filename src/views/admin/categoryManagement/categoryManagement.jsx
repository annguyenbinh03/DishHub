import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './categoryManagement.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        status: false,
        image: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/categories')
            .then((res) => {
                setCategories(res.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu:', error);
                toast.error('Lỗi khi fetch dữ liệu!');
            });
    };

    const handleShowModal = (category = null) => {
        setCurrentCategory(category);
        setFormData(category ? { ...category } : {
            name: '',
            status: false,
            image: ''
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
        if (currentCategory) {
            // Update category
            axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/categories/${currentCategory.id}`, formData)
                .then(() => {
                    fetchCategories();
                    handleCloseModal();
                    toast.success(`Đã cập nhật ${formData.name} thành công!`);
                })
                .catch((error) => {
                    console.error('Lỗi khi cập nhật dữ liệu:', error);
                    toast.error('Lỗi khi cập nhật dữ liệu!');
                });
        } else {
            // Create category
            axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/categories', formData)
                .then(() => {
                    fetchCategories();
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
        axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/categories/${id}`)
            .then(() => {
                fetchCategories();
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
            <h2 className="text-center mb-4"> Quản lý danh mục </h2>
            <Button variant="success" className="mb-3" onClick={() => handleShowModal()}>Thêm danh mục</Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Hình ảnh</th>
                        <th>Tên danh mục</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <tr key={category.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={category.image} alt={category.name} className="category-img rounded" />
                                </td>
                                <td>{category.name}</td>
                                <td>
                                    <Badge bg={category.status ? 'success' : 'danger'}>
                                        {category.status ? 'Hoạt động' : 'Không hoạt động'}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal(category)}>Sửa</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Đang tải dữ liệu...</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentCategory ? 'Cập nhật danh mục' : 'Thêm danh mục'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={formData.status ? 'true' : 'false'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                            >
                                <option value="true">Hoạt động</option>
                                <option value="false">Không hoạt động</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {currentCategory ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CategoryManagement;
