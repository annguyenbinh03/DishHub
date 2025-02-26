import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './restaurantManagement.css'; 
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';

const RestaurantManagement = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        image: '',
        isDeleted: false
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants')
            .then((res) => {
                setRestaurants(res.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi fetch dữ liệu:', error);
                toast.error('Lỗi khi fetch dữ liệu!');
            });
    };

    const handleShowModal = (restaurant = null) => {
        setCurrentRestaurant(restaurant);
        setFormData(restaurant ? { ...restaurant } : {
            name: '',
            address: '',
            phoneNumber: '',
            image: '',
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

    const handleSubmit = async () => {
        setLoading(true);
        if (file) {
            try {
                const uploadedUrl = await useCloudinaryUpload(file);
                if (uploadedUrl) {
                    formData.image = uploadedUrl;
                    toast.success(`Upload thành công! ${uploadedUrl}`, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'light',
                        transition: Bounce
                    });
                } else {
                    throw new Error('Upload thất bại!');
                }
            } catch (err) {
                toast.error(err.message || 'Lỗi khi upload ảnh!', {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: 'light',
                    transition: Bounce
                });
                setLoading(false);
                return;
            }
        }

        try {
            console.log('Sending data:', formData); // Log dữ liệu gửi lên
            if (currentRestaurant) {
                // Update restaurant
                const response = await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants/${currentRestaurant.id}`, formData);
                console.log('Update response:', response);
                fetchRestaurants();
                handleCloseModal();
                toast.success(`Đã cập nhật ${formData.name} thành công!`);
            } else {
                // Create restaurant
                const response = await axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants', formData);
                console.log('Create response:', response);
                fetchRestaurants();
                handleCloseModal();
                toast.success(`Đã thêm ${formData.name} thành công!`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo hoặc cập nhật dữ liệu:', error.response || error.message);
            if (error.response && error.response.data) {
                console.error('Chi tiết lỗi:', error.response.data); // Log chi tiết lỗi từ phản hồi máy chủ
            }
            toast.error('Lỗi khi tạo hoặc cập nhật dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants/${id}`)
            .then(() => {
                fetchRestaurants();
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
            <h2 className="text-center mb-4"> Quản lý nhà hàng </h2>
            <Button variant="success" className="mb-3" onClick={() => handleShowModal()}>Thêm nhà hàng</Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Hình ảnh</th>
                        <th>Tên nhà hàng</th>
                        <th>Địa chỉ</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.length > 0 ? (
                        restaurants.map((restaurant, index) => (
                            <tr key={restaurant.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={restaurant.image} alt={restaurant.name} className="restaurant-img rounded" />
                                </td>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address}</td>
                                <td>{restaurant.phoneNumber}</td>
                                <td>
                                    <Badge bg={restaurant.isDeleted ? 'danger' : 'success'}>
                                        {restaurant.isDeleted ? 'Không hoạt động' : 'Hoạt động'}
                                    </Badge>
                                </td>
                                <td>{new Date(restaurant.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal(restaurant)}>Sửa</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(restaurant.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">Đang tải dữ liệu...</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentRestaurant ? 'Cập nhật nhà hàng' : 'Thêm nhà hàng'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên nhà hàng</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <ImagePicker setFile={setFile} />
                        </Form.Group>
                        {currentRestaurant && (
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
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Uploading...' : currentRestaurant ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RestaurantManagement;
