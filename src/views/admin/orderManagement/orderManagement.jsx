import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Badge, Form, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice } from 'utils/formatPrice';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/orders')
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

    const fetchOrderDetails = (orderId) => {
        axios.get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/orders/${orderId}/details`)
            .then((res) => {
                if (res.data.isSucess) {
                    setOrderDetails(res.data.data.orderDetails);
                } else {
                    toast.error('Không thể lấy chi tiết đơn hàng!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                toast.error('Lỗi khi lấy chi tiết đơn hàng!');
            });
    };

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        fetchOrderDetails(order.id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setOrderDetails([]);
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý Đơn Hàng</h2>
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
                        <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
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
                        <tr><td colSpan="7" className="text-center">Không có đơn hàng nào.</td></tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <p><strong>ID:</strong> {selectedOrder.id}</p>
                            <p><strong>Bàn:</strong> {selectedOrder.tableName || `Bàn ${selectedOrder.tableId}`}</p>
                            <p><strong>Tổng tiền:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                            <p><strong>Thanh toán:</strong> {selectedOrder.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                            <h5>Món ăn trong đơn hàng:</h5>
                            {orderDetails.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <th>Món ăn</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetails.map((dish) => (
                                            <tr key={dish.id}>
                                                <td><Image src={dish.image} alt={dish.dishName} width={50} height={50} rounded /></td>
                                                <td>{dish.dishName}</td>
                                                <td>{dish.quantity}</td>
                                                <td>{formatPrice(dish.price)}</td>
                                                <td>{dish.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : <p>Không có món ăn trong đơn hàng này.</p>}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderManagement;