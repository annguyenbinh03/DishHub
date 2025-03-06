import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice } from 'utils/formatPrice';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/orders')
            .then((res) => {
                if (res.data.isSucess) {
                    const sortedOrders = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(sortedOrders);
                } else {
                    toast.error('Lỗi tải danh sách đơn hàng!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu:', error);
                toast.error('Không thể tải danh sách đơn hàng!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status); // Đặt trạng thái ban đầu khi mở modal
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleUpdateOrder = () => {
        if (!newStatus) {
            toast.error('Vui lòng chọn trạng thái mới.');
            return;
        }

        const updatedOrder = {
            ...selectedOrder,
            status: newStatus
        };

        axios
            .put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/orders?orderId=${selectedOrder.id}`, updatedOrder)
            .then((response) => {
                if (response.data.isSucess) {
                    toast.success('Cập nhật đơn hàng thành công!');
                    fetchOrders(); // Cập nhật lại danh sách đơn hàng
                    handleCloseModal();
                } else {
                    toast.error('Cập nhật đơn hàng thất bại!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật:', error);
                toast.error('Có lỗi xảy ra khi cập nhật đơn hàng!');
            });
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredOrders = orders.filter(order =>
        statusFilter === '' || order.status === statusFilter
    );

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý Đơn Hàng</h2>
            <Form.Group controlId="statusFilter" className="mb-3">
                <Form.Label>Lọc theo trạng thái</Form.Label>
                <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange}>
                    <option value="">Tất cả</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </Form.Control>
            </Form.Group>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Bàn</th>
                        <th>Tổng tiền</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Thời gian tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center">Đang tải...</td>
                        </tr>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.tableName || `Bàn ${order.tableId}`}</td>
                                <td>{formatPrice(order.totalAmount)}</td>
                                <td>
                                    <Badge bg={order.paymentStatus ? 'success' : 'warning'}>
                                        {order.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge bg={order.status === 'confirmed' ? 'info' : order.status === 'preparing' ? 'primary' : order.status === 'completed' ? 'success' : 'danger'}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleShowModal(order)}>
                                        Xem
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">Không có đơn hàng nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Chi Tiết Đơn Hàng */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder ? (
                        <div>
                            <p><strong>ID:</strong> {selectedOrder.id}</p>
                            <p><strong>Bàn:</strong> {selectedOrder.tableName || `Bàn ${selectedOrder.tableId}`}</p>
                            <p><strong>Tổng tiền:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                            <p><strong>Thanh toán:</strong> {selectedOrder.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                            <p><strong>Trạng thái:</strong>
                                <Form.Control as="select" value={newStatus} onChange={handleStatusChange}>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="preparing">Đang chuẩn bị</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </Form.Control>
                            </p>
                            <p><strong>Thời gian tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

                            <h5 className="mt-3">Món ăn trong đơn hàng:</h5>
                            {selectedOrder.dishes.length > 0 ? (
                                <ul>
                                    {selectedOrder.dishes.map((dish, index) => (
                                        <li key={index}>
                                            {dish.name} - {formatPrice(dish.price)} x {dish.quantity}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có món ăn nào trong đơn hàng này.</p>
                            )}
                        </div>
                    ) : (
                        <p>Không có thông tin đơn hàng.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateOrder}>
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderManagement;
