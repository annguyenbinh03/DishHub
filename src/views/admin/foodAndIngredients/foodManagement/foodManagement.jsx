import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';

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
        const uploadedUrl = await uploadImage();

        if (!uploadedUrl) {
            setLoading(false);
            return;
        }

        const createDishDTO = {
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            price: formData.price,
            image: uploadedUrl,
            status: formData.status,
            restaurantId: formData.restaurantId,
            ingredients: formData.ingredients
        };

        try {
            if (currentFood) {
                const response = await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dishes/${currentFood.id}`, createDishDTO);
                fetchFoods();
                handleCloseModal();
                toast.success(`Successfully updated ${createDishDTO.name}!`);
            } else {
                const response = await axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/dishes', createDishDTO);
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
        axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/foods/${id}`)
            .then(() => {
                fetchFoods();
                toast.success('Successfully deleted!');
            })
            .catch((error) => {
                toast.error('Error deleting data!');
            });
    };

    return (
        <Container className="my-5 food-management">
            <ToastContainer />
            <h2 className="text-center mb-4">Food Management</h2>
            <Button variant="success" className="mb-3" onClick={() => handleShowModal()}>Add Food</Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Restaurant</th>
                        <th>Ingredients</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.length > 0 ? (
                        foods.map((food, index) => (
                            <tr key={food.id}>
                                <td>{index + 1}</td>
                                <td><img src={food.image} alt={food.name} className="food-img rounded" /></td>
                                <td>{food.name}</td>
                                <td>{food.description}</td>
                                <td>{food.categoryId}</td>
                                <td>{food.price}</td>
                                <td>
                                    <Badge bg={food.status === 'onsale' ? 'success' : 'danger'}>
                                        {food.status === 'onsale' ? 'On Sale' : 'Off Sale'}
                                    </Badge>
                                </td>
                                <td>{food.restaurantId}</td>
                                <td>{food.ingredients.map(ingredient => ingredient.name).join(', ')}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal(food)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(food.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">Loading data...</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentFood ? 'Update Food' : 'Add Food'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
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
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <ImagePicker setFile={setFile} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
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
                            <Form.Label>Restaurant</Form.Label>
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
                            <Form.Label>Ingredients</Form.Label>
                            {ingredientsList.map(ingredient => (
                                <Form.Check
                                    key={ingredient.id}
                                    type="checkbox"
                                    label={ingredient.name}
                                    checked={formData.ingredients.includes(ingredient.id)}
                                    onChange={() => handleIngredientChange(ingredient.id)}
                                />
                            ))}
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
