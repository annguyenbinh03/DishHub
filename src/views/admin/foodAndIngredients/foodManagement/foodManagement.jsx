import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Dropdown, Form, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAdminDishes, createDish, updateDish, deleteDish } from 'services/dishService';
import { formatPrice } from 'utils/formatPrice';
import axios from 'axios';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [dishesPerPage] = useState(10);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(''); // New state for restaurant selection

    useEffect(() => {
        axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants')
            .then(response => {
                setRestaurants(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching restaurants:", error);
            });
    }, []);

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

    // Get current dishes
    const indexOfLastDish = currentPage * dishesPerPage;
    const indexOfFirstDish = indexOfLastDish - dishesPerPage;
    const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    // Save dish (new or update)
    const handleSaveDish = async () => {
        const dishData = {
            name: dishForm.name.trim(),
            description: dishForm.description.trim(),
            categoryId: Number(dishForm.categoryId) || null,
            price: Number(dishForm.price.replace(/\D/g, "")) || null,
            status: dishForm.status,
            restaurantId: Number(dishForm.restaurantId) || null, // Use the restaurantId from the form
            ingredients: dishForm.ingredients.length ? dishForm.ingredients : [],
            image: dishForm.image || null,
        };

        try {
            let newDish;
            if (editingDish) {
                // Update dish if editing
                await updateDish(editingDish.id, dishData);
                newDish = { ...dishData, id: editingDish.id };
                toast.success(`Updated ${dishData.name} successfully!`);
            } else {
                // Create new dish
                const response = await createDish(dishData);
                newDish = response.data.data; // Assuming the response structure has the dish data
                setDishes(prevDishes => [...prevDishes, newDish]);
                toast.success(`Added ${dishData.name} successfully!`);
            }

            setShowModal(false);
            setEditingDish(null);
            setSelectedRestaurant(''); // Reset selected restaurant after saving
        } catch (error) {
            console.error("Error saving dish:", error);
            toast.error(`Error: ${error.message}`);
        }
    };

    // Edit dish
    const handleEdit = (dish) => {
        setEditingDish(dish);
        setDishForm(dish);
        setSelectedRestaurant(dish.restaurantId); // Set the restaurant for editing
        setShowModal(true);
    };

    // Delete dish
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this dish?")) {
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
        setSelectedRestaurant(''); // Reset restaurant selection
        setShowModal(true);
    };

    return (
        <Container className="my-5 food-management">
            <h2 className="text-center mb-4">🍽️ Food Management 🍽️</h2>

            <Form className="mb-3 d-flex gap-3">
                <Form.Control
                    type="text"
                    placeholder="Search dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All statuses</option>
                    <option value="onsale">On sale</option>
                    <option value="soldout">Sold out</option>
                </Form.Select>
            </Form>

            <div className="mb-3 text-end">
                <Button variant="success" size="sm" onClick={handleAddDish}>
                    Add Dish
                </Button>
            </div>

            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Sold</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDishes.length > 0 ? (
                        currentDishes.map((dish, index) => (
                            <tr key={dish.id}>
                                <td>{indexOfFirstDish + index + 1}</td>
                                <td>{dish.image ? <img src={dish.image} alt={dish.name} className="food-img rounded" /> : "No Image"}</td>
                                <td>{dish.name}</td>
                                <td className='text-truncate'>{dish.description}</td>
                                <td>{dish.categoryId}</td>
                                <td>{formatPrice(dish.price)}</td>
                                <td>{dish.soldCount}</td>
                                <td>
                                    <Badge bg={dish.status === 'onsale' ? 'success' : 'secondary'}>{dish.status === 'onsale' ? 'On Sale' : 'Sold Out'}</Badge>
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic"></Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleEdit(dish)}>
                                                <Button variant="primary" size="sm">Update</Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(dish.id)}>
                                                <Button variant="danger" size="sm">Delete</Button>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No data found</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Pagination className="justify-content-center">
                {Array.from({ length: Math.ceil(filteredDishes.length / dishesPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Modal for adding/updating dish */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingDish ? "Update Dish" : "Add New Dish"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" name="name" value={dishForm.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={dishForm.description} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                value={dishForm.price}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="categoryId"
                                value={dishForm.categoryId}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-between align-items-center">
                            <Form.Label className="mb-0 me-2">Select Restaurant:</Form.Label>
                            <Form.Select
                                className="w-50"
                                value={selectedRestaurant}
                                onChange={(e) => {
                                    setSelectedRestaurant(e.target.value);
                                    setDishForm({ ...dishForm, restaurantId: e.target.value });
                                }}
                            >
                                <option value="">-- Select Restaurant --</option>
                                {restaurants.map((restaurant) => (
                                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ingredients (comma-separated)</Form.Label>
                            <Form.Control
                                type="text"
                                name="ingredients"
                                value={dishForm.ingredients.join(',')}
                                onChange={handleIngredientsChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={dishForm.status} onChange={handleInputChange}>
                                <option value="onsale">On sale</option>
                                <option value="soldout">Sold out</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveDish}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FoodManagement;
