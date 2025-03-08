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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

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
            let uploadedUrl = formData.image; // Use existing image URL if no new file is selected
    
            // Kiểm tra xem file có tồn tại không
            if (file) {
                // Upload file lên Cloudinary
                const uploadResult = await useCloudinaryUpload(file);
    
                if (!uploadResult || !uploadResult) {
                    throw new Error('Upload thất bại!');
                }
    
                uploadedUrl = uploadResult;
    
                // Hiển thị thông báo thành công
                toast.success(`Upload thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                    transition: Bounce
                });
            }

            // Gán ảnh vào formData
            const updatedFormData = {
                ...formData,
                image: uploadedUrl,
                isDeleted: formData.isDeleted
            };

            console.log('Sending data:', updatedFormData); // Log dữ liệu gửi lên
            if (currentCategory) {
                // Update category
                const response = await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dish-categories/${currentCategory.id}`, updatedFormData);
                console.log('Update response:', response);
                fetchCategories();
                handleCloseModal();
                toast.success(`Đã cập nhật ${formData.name} thành công!`);
            } else {
                // Create category
                const response = await axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dish-categories', updatedFormData);
                console.log('Create response:', response);
                fetchCategories();
                handleCloseModal();
                toast.success(`Đã thêm ${formData.name} thành công!`);
            }
        } catch (err) {
            // Hiển thị lỗi nếu có
            toast.error(err.message || 'Lỗi khi upload ảnh!', {
                position: 'top-right',
                autoClose: 5000,
                theme: 'light',
                transition: Bounce
            });
        } finally {
            // Luôn tắt loading
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const filteredCategories = categories.filter((category) => {
        return (
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedStatus === '' || (selectedStatus === 'true' ? category.isDeleted : !category.isDeleted))
        );
    });

    return (
        <Container >
            <ToastContainer />
            <h2 className="text-center mb-4"> Quản lý danh mục </h2>
            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo tên danh mục"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="me-2"
                    />
                    <Form.Select value={selectedStatus} onChange={handleStatusChange}>
                        <option value="">Lọc theo trạng thái</option>
                        <option value="true">Không hoạt động</option>
                        <option value="false">Hoạt động</option>
                    </Form.Select>
                </div>
                <Button variant="success" onClick={() => handleShowModal()}>Thêm danh mục</Button>
            </div>
            <Table striped bordered hover responsive className="text-center fixed-table">
                <thead className="table-dark">
                    <tr>
                        <th className="fixed-column-id">Id</th>
                        <th className="fixed-column">Hình ảnh</th>
                        <th className="fixed-column">Tên danh mục</th>
                        <th className="fixed-column">Trạng thái</th>
                        <th className="fixed-column">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, index) => (
                            <tr key={category.id}>
                                <td className="fixed-column-id">{index + 1}</td>
                                <td className="fixed-column">
                                    <img src={category.image} alt={category.name} className="category-img rounded" />
                                </td>
                                <td className="fixed-column">{category.name}</td>
                                <td className="fixed-column">
                                    <Badge bg={category.isDeleted ? 'danger' : 'success'}>
                                        {category.isDeleted ? 'Không hoạt động' : 'Hoạt động'}
                                    </Badge>
                                </td>
                                <td className="fixed-column">
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
                                    value={formData.isDeleted.toString()}
                                    onChange={(e) => setFormData({ ...formData, isDeleted: e.target.value === 'true' })}
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
