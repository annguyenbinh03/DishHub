import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker'; // Import ImagePicker
import useCloudinaryUpload from 'hooks/useCloudinaryUpload'; // Import hook for Cloudinary upload

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        image: '' // Image will be updated after uploading
    });
    const [file, setFile] = useState(null); // Store file selected from ImagePicker

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        setLoading(true);
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/ingredients')
            .then((res) => {
                setIngredients(res.data.data);
            })
            .catch((error) => {
                console.error('Error fetching ingredients:', error);
                toast.error('Error fetching ingredients!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) {
            axios
                .delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/ingredients/${id}`)
                .then(() => {
                    fetchIngredients(); // Tải lại danh sách nguyên liệu sau khi xóa
                    toast.success('Nguyên liệu đã được xóa thành công!');
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa nguyên liệu:', error);
                    toast.error('Không thể xóa nguyên liệu!');
                });
        }
    };


    const handleShowModal = (ingredient = null) => {
        if (ingredient) {
            setFormData({
                id: ingredient.id,
                name: ingredient.name,
                image: ingredient.image,
            });
        } else {
            setFormData({
                id: null,
                name: '',
                image: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Upload image to Cloudinary
    const uploadImage = async () => {
        if (file) {
            try {
                const uploadedUrl = await useCloudinaryUpload(file);
                if (uploadedUrl) {
                    toast.success(`Upload successful! ${uploadedUrl}`);
                    return uploadedUrl;
                } else {
                    throw new Error('Upload failed!');
                }
            } catch (err) {
                toast.error(err.message || 'Error uploading image!');
                setLoading(false);
                return;
            }
        }
    };

    // Handle form submission (both create and update)
    const handleSubmit = async () => {
        setLoading(true);
        const uploadedUrl = await uploadImage();

        // If no image is uploaded and there's no existing image, stop submission
        if (!uploadedUrl && !formData.image) {
            setLoading(false);
            return;
        }

        // Prepare data to send to API
        const ingredientData = {
            name: formData.name,
            image: uploadedUrl || formData.image, // Use the uploaded image URL or the one provided in form
        };

        const apiUrl = formData.id
            ? `https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/ingredients/${formData.id}` // Update if there's an ID
            : 'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/ingredients'; // Create if no ID

        const method = formData.id ? 'put' : 'post'; // Use PUT for update, POST for create

        axios[method](apiUrl, ingredientData)
            .then((res) => {
                fetchIngredients(); // Reload ingredient list
                setShowModal(false); // Close the modal
                toast.success(formData.id ? 'Cập nhật nguyên liệu thành công!' : 'Tạo nguyên liệu thành công!');
            })
            .catch((error) => {
                toast.error(formData.id ? 'Cập nhật nguyên liệu thất bại!' : 'Tạo nguyên liệu thất bại!');
                console.error('Error creating/updating ingredient:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý nguyên liệu</h2>
            <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
                Thêm nguyên liệu
            </Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Ảnh</th>
                        <th>Tên nguyên liệu</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" className="text-center">Loading...</td>
                        </tr>
                    ) : (
                        ingredients.length > 0 ? (
                            ingredients.map((ingredient) => (
                                <tr key={ingredient.id}>
                                    <td>{ingredient.id}</td>
                                    <td>
                                        <img
                                            src={ingredient.image}
                                            alt={ingredient.name}
                                            className='ingredient-image rounded'
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{ingredient.name}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleShowModal(ingredient)}
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(ingredient.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Không có nguyên liệu có sẵn</td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>

            {/* Modal để tạo hoặc cập nhật nguyên liệu */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{formData.id ? 'Cập nhật nguyên liệu' : 'Thêm nguyên liệu'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên nguyên liệu</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên nguyên liệu"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ảnh nguyên liệu</Form.Label>
                            {/* Image Picker component */}
                            <ImagePicker setFile={setFile} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang tạo...' : formData.id ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Ingredients;
