import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './categoryManagement.css'; 
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        isDeleted: false,
        image: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
            isDeleted: false,
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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let uploadedUrl = formData.image;
            if (file) {
                const uploadResult = await useCloudinaryUpload(file);
                console.log('Upload Result:', uploadResult); // Add this line to log the upload result
                if (!uploadResult?.secure_url) throw new Error('Upload thất bại!');
                uploadedUrl = uploadResult.secure_url;
                toast.success('Upload thành công!', { autoClose: 3000, transition: Bounce });
            }

            const updatedFormData = { 
                name: formData.name, 
                isDeleted: currentCategory ? formData.isDeleted : false, 
                image: uploadedUrl 
            };
            if (currentCategory) {
                await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dish-categories/${currentCategory.id}`, updatedFormData);
                toast.success(`Đã cập nhật ${formData.name} thành công!`);
            } else {
                await axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dish-categories', updatedFormData);
                toast.success(`Đã thêm ${formData.name} thành công!`);
            }
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            toast.error(err.message || 'Lỗi khi upload ảnh!', { autoClose: 5000, transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dish-categories/${id}`)
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
        <Container >
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
                                    <Badge bg={category.isDeleted ? 'danger' : 'success'}>
                                        {category.isDeleted ? 'Không hoạt động' : 'Hoạt động'}
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
                        {currentCategory && (
                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="isDeleted"
                                    value={formData.isDeleted ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, isDeleted: e.target.value === 'false' })}
                                >
                                    <option value="false">Hoạt động</option>
                                    <option value="true">Không hoạt động</option>
                                </Form.Control>
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <ImagePicker setFile={setFile} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Uploading...' : (currentCategory ? 'Cập nhật' : 'Thêm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CategoryManagement;
