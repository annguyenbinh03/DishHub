import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice } from 'utils/formatPrice';

const PaymentsByRestaurant = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [restaurantId, setRestaurantId] = useState(1);

    useEffect(() => {
        fetchPayments();
    }, [restaurantId]);

    const fetchPayments = () => {
        setLoading(true);
        axios.get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/payments/by-restaurant?restaurantId=${restaurantId}`)
            .then((res) => {
                if (res.data.isSucess) {
                    setPayments(res.data.data);
                } else {
                    toast.error('Lỗi tải danh sách thanh toán!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu thanh toán:', error);
                toast.error('Không thể tải danh sách thanh toán!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleShowModal = (payment) => {
        setSelectedPayment(payment);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPayment(null);
    };

    return (
        <Container>
            <ToastContainer />
            <h2 className="text-center mb-4">Thanh toán theo nhà hàng</h2>
            {/* <Form.Group controlId="restaurantId" className="mb-3" style={{ maxWidth: '300px' }}>
                <Form.Label>ID Nhà hàng</Form.Label>
                <Form.Control
                    type="number"
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                />
            </Form.Group> */}
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Mã giao dịch</th>
                        <th>Phương thức thanh toán</th>
                        <th>Số tiền</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Thời gian tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="8" className="text-center">Đang tải...</td></tr>
                    ) : payments.length > 0 ? (
                        payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.transactionCode}</td>
                                <td>{payment.methodName}</td>
                                <td>{formatPrice(payment.amount)}</td>
                                <td>{payment.description}</td>
                                <td>
                                    <Badge bg={payment.status ? 'success' : 'warning'}>
                                        {payment.status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </Badge>
                                </td>
                                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleShowModal(payment)}>
                                        Xem
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" className="text-center">Không có thanh toán nào.</td></tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPayment && (
                        <>
                            <p><strong>ID:</strong> {selectedPayment.id}</p>
                            <p><strong>Mã giao dịch:</strong> {selectedPayment.transactionCode}</p>
                            <p><strong>Phương thức thanh toán:</strong> {selectedPayment.methodName}</p>
                            <p><strong>Số tiền:</strong> {formatPrice(selectedPayment.amount)}</p>
                            <p><strong>Mô tả:</strong> {selectedPayment.description}</p>
                            <p><strong>Trạng thái:</strong> {selectedPayment.status ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                            <p><strong>Thời gian tạo:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>
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

export default PaymentsByRestaurant;
