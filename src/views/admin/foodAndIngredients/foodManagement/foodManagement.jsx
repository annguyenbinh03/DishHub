import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';
import { formatPrice } from 'utils/formatPrice';
const FoodManagement = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]); // Store categories
    const [restaurants, setRestaurants] = useState([]); // Store restaurants
    const [ingredientsList, setIngredientsList] = useState([]); // List of all available ingredients
    const [showModal, setShowModal] = useState(false);
    const [currentFood, setCurrentFood] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: 1,
        price: 0,
        image: '',
        status: 'onsale',
        restaurantId: 1,
        ingredients: [] // Store selected ingredients
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
    const [selectedStatus, setSelectedStatus] = useState(''); // State for selected status
    const [orderId, setOrderId] = useState(''); // State for order ID

    useEffect(() => {
        fetchFoods();
        fetchCategories(); // Fetch categories when component mounts
        fetchRestaurants(); // Fetch restaurants when component mounts
        fetchIngredients(); // Fetch ingredients when component mounts
    }, []);

    const fetchFoods = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dishes?page=1&size=100')
            .then((res) => {
                setFoods(res.data.data.dishes);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data!');
            });
    };

    const fetchCategories = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/categories')
            .then((res) => {
                setCategories(res.data.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories!');
            });
    };

    const fetchRestaurants = () => {
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants')
            .then((res) => {
                setRestaurants(res.data.data);
            })
            .catch((error) => {
                console.error('Error fetching restaurants:', error);
                toast.error('Error fetching restaurants!');
            });
    };

    const fetchIngredients = () => {
        // Assuming you have an endpoint or data for ingredients
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/ingredients') // Replace with actual endpoint
            .then((res) => {
                setIngredientsList(res.data.data); // Assuming the response is a list of ingredients
            })
            .catch((error) => {
                console.error('Error fetching ingredients:', error);
                toast.error('Error fetching ingredients!');
            });
    };

    const handleShowModal = (food = null) => {
        setCurrentFood(food);
        setFormData(food ? { ...food, ingredients: food.ingredients.map(i => i.id) } : {
            name: '',
            description: '',
            categoryId: 1,
            price: 0,
            image: '',
            status: 'onsale',
            restaurantId: 1,
            ingredients: [] // Empty ingredients by default
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

    const handleIngredientChange = (ingredientId) => {
        setFormData(prevData => {
            const ingredients = prevData.ingredients.includes(ingredientId)
                ? prevData.ingredients.filter(id => id !== ingredientId)
                : [...prevData.ingredients, ingredientId];
            return { ...prevData, ingredients };
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleOrderIdChange = (e) => {
        setOrderId(e.target.value);
    };

    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || food.categoryId === parseInt(selectedCategory)) &&
        (selectedStatus === '' || food.status === selectedStatus) &&
        (orderId === '' || food.id.toString() === orderId)
    );

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

    const handleSubmit = async () => {
        if (formData.price < 0) {
            toast.error('Price cannot be less than 0!');
            return;
        }
        setLoading(true);
        const uploadedUrl = await uploadImage();

        if (!uploadedUrl && !currentFood) {
            setLoading(false);
            return;
        }

        const createDishDTO = {
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            price: formData.price,
            image: uploadedUrl || formData.image,
            status: formData.status,
            restaurantId: formData.restaurantId,
            ingredients: formData.ingredients
        };

        try {
            if (currentFood) {
                await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dishes/${currentFood.id}`, createDishDTO);
                fetchFoods();
                handleCloseModal();
                toast.success(`Successfully updated ${createDishDTO.name}!`);
            } else {
                await axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dishes', createDishDTO);
                fetchFoods();
                handleCloseModal();
                toast.success(`Successfully added ${createDishDTO.name}!`);
            }
        } catch (error) {
            console.error('Error creating or updating data:', error);
            toast.error('Error creating or updating data!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
            axios
                .delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dishes/${id}`)
                .then(() => {
                    fetchFoods(); // Tải lại danh sách món ăn sau khi xóa
                    toast.success('Món ăn đã được xóa thành công!');
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa món ăn:', error);
                    toast.error('Không thể xóa món ăn!');
                });
        }
    };


    return (
        <Container className="my-5 food-management">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý món ăn</h2>
            <Form.Control
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
            />
            <Form.Control
                as="select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="mb-3"
            >
                <option value="">All Categories</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </Form.Control>
            <Form.Control
                as="select"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="mb-3"
            >
                <option value="">All Status</option>
                <option value="onsale">On Sale</option>
                <option value="deleted">Off Sale</option>
            </Form.Control>
            <Form.Control
                type="text"
                placeholder="Filter by Order ID"
                value={orderId}
                onChange={handleOrderIdChange}
                className="mb-3"
            />
            <Button variant="success" className="mb-3" onClick={() => handleShowModal()}>Tạo món mới</Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Ảnh</th>
                        <th>Tên món ăn</th>
                        <th>Mô tả</th>
                        <th>Loại</th>
                        <th>Giá</th>
                        <th>Trạng thái</th>
                        <th>Nhà hàng</th>
                        <th>Nguyên liệu</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFoods.length > 0 ? (
                        filteredFoods.map((food, index) => (
                            <tr key={food.id}>
                                <td>{index + 1}</td>
                                <td><img src={food.image} alt={food.name} className="food-img rounded" /></td>
                                <td>{food.name}</td>
                                <td
                                    title={food.description}
                                    className="text-start"
                                    style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {food.description}
                                </td>


                                <td>{food.categoryId}</td>
                                <td>{formatPrice(food.price)}</td>
                                <td>
                                    <Badge bg={food.status === 'onsale' ? 'success' : 'danger'}>
                                        {food.status === 'onsale' ? 'On Sale' : 'Off Sale'}
                                    </Badge>
                                </td>
                                <td>{food.restaurantId}</td>
                                <td
                                    title={food.ingredients.map(ingredient => ingredient.name).join(', ')}
                                    className="text-start"
                                    style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {food.ingredients.map(ingredient => ingredient.name).join(', ')}
                                </td>


                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal(food)}>Cập nhật</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(food.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">No matching data found...</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentFood ? 'Cập nhật món ăn' : 'Tạo món mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên</Form.Label>
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
                            <Form.Label>Loại</Form.Label>
                            <Form.Control
                                as="select"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ảnh</Form.Label>
                            <ImagePicker setFile={setFile} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="onsale">On Sale</option>
                                <option value="offsale">Off Sale</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhà hàng</Form.Label>
                            <Form.Control
                                as="select"
                                name="restaurantId"
                                value={formData.restaurantId}
                                onChange={handleChange}
                            >
                                {restaurants.map(restaurant => (
                                    <option key={restaurant.id} value={restaurant.id}>
                                        {restaurant.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nguyên liệu</Form.Label>
                            {/* Create a container with fixed height and scrolling */}
                            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                                {ingredientsList.map(ingredient => (
                                    <Form.Check
                                        key={ingredient.id}
                                        type="checkbox"
                                        label={ingredient.name}
                                        checked={formData.ingredients.includes(ingredient.id)}
                                        onChange={() => handleIngredientChange(ingredient.id)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Uploading...' : currentFood ? 'Update' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FoodManagement;
