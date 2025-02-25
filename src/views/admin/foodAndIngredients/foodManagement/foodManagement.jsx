import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Dropdown, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAdminDishes, createDish, updateDish, deleteDish } from 'services/dishService';
import { formatPrice } from 'utils/formatPrice';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';

const FoodManagement = () => {
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [dishForm, setDishForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        status: '',
        restaurantId: '',
        image: '',
        ingredients: [],
    });

    const ImagePicker = ({ onFileUpload }) => {
        const [file, setFile] = useState(null);

        const handleFileChange = (event) => {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setFile(selectedFile);
                onFileUpload(selectedFile); // Gọi callback để xử lý upload ảnh
            }
        };

        return (
            <div>
                <input type="file" onChange={handleFileChange} />
                {file && <span>{file.name}</span>}
            </div>
        );
    };

    // Fetch all dishes
    const fetchData = async () => {
        const response = await getAdminDishes();
        setDishes(response.data.dishes);
    };

    useEffect(() => {
        fetchData();
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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDishForm({ ...dishForm, [name]: value });
    };

    // Handle ingredients input change
    const handleIngredientsChange = (e) => {
        const { value } = e.target;
        const ingredientsArray = value.split(',').map(Number);
        setDishForm({ ...dishForm, ingredients: ingredientsArray });
    };

    // Upload image to Cloudinary
    const handleUploadImage = async (file) => {
        try {
            const uploadedUrl = await useCloudinaryUpload(file);
            setDishForm({ ...dishForm, image: uploadedUrl });
        } catch (err) {
            toast.error('Có lỗi khi upload ảnh!', {
                position: 'top-right',
                autoClose: 5000,
                theme: 'light',
            });
        }
    };

    // Save dish (new or update)
    const handleSaveDish = async () => {
        const dishData = {
            name: dishForm.name,
            description: dishForm.description,
            categoryId: Number(dishForm.categoryId),
            price: Number(dishForm.price.replace(/\D/g, "")),
            status: dishForm.status,
            restaurantId: Number(dishForm.restaurantId), // Ensure restaurantId is included and converted to number
            ingredients: dishForm.ingredients,
            image: dishForm.image,
        };

        console.log("Dish data to be saved:", dishData); // Log the dish data to be saved

        try {
            let newDish;
            if (editingDish) {
                // Update dish if editing
                await updateDish(editingDish.id, dishData);
                newDish = { ...dishData, id: editingDish.id };
                toast.success(`Đã cập nhật ${dishData.name} thành công!`);
            } else {
                // Create new dish
                const response = await createDish(dishData);
                console.log("Create dish response:", response); // Log the full response to check the structure

                // Check for different response structures
                if (response?.data?.data) {
                    newDish = response.data.data; // Get the dish data from the 'data' field
                } else if (response?.data?.dish) {
                    newDish = response.data.dish; // Fallback to 'dish' field if 'data' is not present
                } else {
                    throw new Error("Dish data is missing in the response");
                }

                setDishes(prevDishes => [...prevDishes, newDish]);
                toast.success(`Đã thêm ${dishData.name} thành công!`);
            }

            setShowModal(false);
            setEditingDish(null);
        } catch (error) {
            console.error("Lỗi khi lưu món ăn:", error);
            if (error.response) {
                console.error("Response data:", error.response.data); // Log the response data
                toast.error(`Có lỗi xảy ra: ${error.response.data.message}`);
            } else {
                toast.error(`Có lỗi xảy ra: ${error.message}`);
            }
        }
    };

    // Edit dish
    const handleEdit = (dish) => {
        setEditingDish(dish);
        setDishForm(dish);
        setShowModal(true);
    };

    // Delete dish
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
            await deleteDish(id);
            fetchData();
        }
    };

    // Add new dish
    const handleAddDish = () => {
        setEditingDish(null);
        setDishForm({
            name: '',
            description: '',
            categoryId: '',
            price: '',
            status: '',
            image: '',
            restaurantId: '',
            ingredients: [],
        });
        setShowModal(true);
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">🍽️ Quản lý đồ ăn 🍽️</h2>

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

            <div className="mb-3 text-end">
                <Button variant="success" size="sm" onClick={handleAddDish}>
                    Thêm món ăn
                </Button>
            </div>

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
                                <td>{dish.image ? <img src={dish.image} alt={dish.name} className="food-img rounded" /> : "No Image"}</td>
                                <td>{dish.name}</td>
                                <td>{dish.description}</td>
                                <td>{dish.categoryId}</td>
                                <td>{formatPrice(dish.price)}</td>
                                <td>{dish.soldCount}</td>
                                <td>
                                    <Badge bg={dish.status === 'onsale' ? 'success' : 'secondary'}>{dish.status === 'onsale' ? 'Đang bán' : 'Hết hàng'}</Badge>
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">...</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleEdit(dish)}>
                                                <Button variant="primary" size="sm">Cập nhật</Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(dish.id)}>
                                                <Button variant="danger" size="sm">Xóa</Button>
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

            {/* Modal thêm/sửa món ăn */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingDish ? "Cập nhật món ăn" : "Thêm món ăn mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tên món</Form.Label>
                            <Form.Control type="text" name="name" value={dishForm.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control as="textarea" name="description" value={dishForm.description} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                value={dishForm.price}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Loại</Form.Label>
                            <Form.Control
                                type="text"
                                name="categoryId"
                                value={dishForm.categoryId}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nhà hàng</Form.Label>
                            <Form.Control
                                type="text"
                                name="restaurantId"
                                value={dishForm.restaurantId}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nguyên liệu (cách nhau bằng dấu phẩy)</Form.Label>
                            <Form.Control
                                type="text"
                                name="ingredients"
                                value={dishForm.ingredients.join(',')}
                                onChange={handleIngredientsChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select name="status" value={dishForm.status} onChange={handleInputChange}>
                                <option value="onsale">Đang bán</option>
                                <option value="soldout">Hết hàng</option>
                            </Form.Select>
                        </Form.Group>
                        {/* Image Picker */}
                        <ImagePicker onFileUpload={handleUploadImage} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSaveDish}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FoodManagement;
