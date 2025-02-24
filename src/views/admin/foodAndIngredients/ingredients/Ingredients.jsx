import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Dropdown } from 'react-bootstrap';
import { getAdminIngredients } from 'services/ingredientService';
import './Ingredients.css';

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getAdminIngredients();
            console.log("API Response:", response); // Log toàn bộ response
            console.log("API Response Data:", response.data); // Log data object

            if (response.data && Array.isArray(response.data)) {
                setIngredients(response.data); // Nếu response.data là mảng
            } else if (response.data && response.data.Ingredients && Array.isArray(response.data.Ingredients)) {
                setIngredients(response.data.Ingredients); // Nếu response.data.Ingredients là mảng
            } else {
                console.error("Unexpected response structure:", response.data);
                setIngredients([]); // Đặt mảng rỗng nếu dữ liệu không đúng
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
            setIngredients([]); // Tránh lỗi khi render UI
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">🥗 Quản lý nguyên liệu 🥗</h2>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Tên nguyên liệu</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ingredients) && ingredients.length > 0 ? (
                        ingredients.map((ingredient, index) => (
                            <tr key={ingredient.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={ingredient.image}
                                        alt={ingredient.name}
                                        className="ingredient-img rounded"
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                </td>
                                <td>{ingredient.name}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            ...
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#">
                                                <Button variant="primary" size="sm">Cập nhật</Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#">
                                                <Button variant="danger" size="sm">Xóa</Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#">
                                                <Button variant="success" size="sm">Thêm</Button>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Không có dữ liệu hoặc đang tải...</td>
                        </tr>
                    )}
                </tbody>

            </Table>
        </Container>
    );
};

export default Ingredients;
