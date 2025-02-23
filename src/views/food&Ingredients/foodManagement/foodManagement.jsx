import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Dropdown, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAdminDishes, createDish, updateDish, deleteDish } from 'services/dishService';

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
        status: 'onsale',
        image: '', // Lưu URL ảnh thay vì file
    });

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

    const handleInputChange = (e) => {
        setDishForm({ ...dishForm, [e.target.name]: e.target.value });
    };

    const handleSaveDish = async () => {
        const dishData = {
            name: dishForm.name,
            description: dishForm.description,
            categoryId: Number(dishForm.categoryId), // Chuyển đổi categoryId thành số
            price: Number(dishForm.price), // Chuyển đổi price thành số
            image: dishForm.image, // Giữ nguyên URL hình ảnh
            status: dishForm.status,
            restaurantId: 1, // 🔹 Cập nhật ID nhà hàng hợp lệ (hoặc lấy từ state)
            ingredients: [], // 🔹 Cập nhật danh sách nguyên liệu (nếu có)
        };

        try {
            if (editingDish) {
                await updateDish(editingDish.id, dishData);
            } else {
                await createDish(dishData);
            }
            setShowModal(false);
            setEditingDish(null);
            fetchData();
            toast.success(`Đã ${editingDish ? 'cập nhật' : 'thêm'} ${dishData.name} thành công!`);
        } catch (error) {
            console.error("Lỗi khi lưu món ăn:", error);
            toast.error(`Có lỗi xảy ra khi ${editingDish ? 'cập nhật' : 'thêm'} ${dishData.name}!`);
        }
    };

    const handleEdit = (dish) => {
        setEditingDish(dish);
        setDishForm(dish);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
            await deleteDish(id);
            fetchData();
        }
    };

    const handleAddDish = () => {
        setEditingDish(null);
        setDishForm({
            name: '',
            description: '',
            categoryId: '',
            price: '',
            status: 'onsale',
            image: '',
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
                                <td>
                                    <img src={dish.image} alt={dish.name} className="food-img rounded" />
                                </td>
                                <td>{dish.name}</td>
                                <td>{dish.description}</td>
                                <td>{dish.categoryId}</td>
                                <td>{dish.price} đ</td>
                                <td>{dish.soldCount}</td>
                                <td>
                                    <Badge bg={dish.status === 'onsale' ? 'success' : 'secondary'}>
                                        {dish.status === 'onsale' ? 'Đang bán' : 'Hết hàng'}
                                    </Badge>
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            ...
                                        </Dropdown.Toggle>
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
                            <Form.Control type="number" name="price" value={dishForm.price} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select name="status" value={dishForm.status} onChange={handleInputChange}>
                                <option value="onsale">Đang bán</option>
                                <option value="soldout">Hết hàng</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>URL Hình ảnh</Form.Label>
                            <Form.Control type="text" name="image" value={dishForm.image} onChange={handleInputChange} />
                        </Form.Group>
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
