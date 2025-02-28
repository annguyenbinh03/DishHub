import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestOrders = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [status, setStatus] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        setLoading(true);
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests')
            .then((res) => {
                if (res.data.isSucess) {
                    const sortedRequests = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setRequests(sortedRequests);
                } else {
                    toast.error('Lỗi tải danh sách yêu cầu!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu:', error);
                toast.error('Không thể tải danh sách yêu cầu!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleShowModal = (request) => {
        setSelectedRequest(request);
        setStatus(request.status);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const handleUpdateStatus = () => {
        if (!selectedRequest) return;

        axios
            .patch(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests/${selectedRequest.id}`, {
                status: status
            })
            .then(() => {
                toast.success('Cập nhật trạng thái thành công!');
                fetchRequests();
                handleCloseModal();
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật trạng thái:', error);
                toast.error('Không thể cập nhật trạng thái!');
            });
    };

    const filteredRequests = filterStatus === 'all' ? requests : requests.filter(request => request.status === filterStatus);

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Danh sách yêu cầu</h2>

            {/* Dropdown lọc trạng thái */}
            <Form.Group className="mb-3">
                <Form.Label><strong>Lọc theo trạng thái:</strong></Form.Label>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="inProgress">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </Form.Select>
            </Form.Group>

            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Mã đơn hàng</th>
                        <th>Loại yêu cầu</th>
                        <th>Ghi chú</th>
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
                    ) : filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.orderId}</td>
                                <td>{request.typeName}</td>
                                <td>{request.note}</td>
                                <td>
                                    <Badge bg={
                                        request.status === 'pending' ? 'warning' :
                                            request.status === 'inProgress' ? 'primary' :
                                                request.status === 'completed' ? 'success' :
                                                    'danger'
                                    }>
                                        {request.status}
                                    </Badge>
                                </td>
                                <td>{new Date(request.createdAt).toLocaleString()}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleShowModal(request)}>
                                        Xem / Cập nhật
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">Không có yêu cầu nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Chi Tiết & Cập Nhật Trạng Thái */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết yêu cầu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest ? (
                        <div>
                            <p><strong>ID:</strong> {selectedRequest.id}</p>
                            <p><strong>Mã đơn hàng:</strong> {selectedRequest.orderId}</p>
                            <p><strong>Loại yêu cầu:</strong> {selectedRequest.typeName}</p>
                            <p><strong>Ghi chú:</strong> {selectedRequest.note}</p>
                            <p><strong>Thời gian tạo:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                            {selectedRequest.processedAt && (
                                <p><strong>Thời gian xử lý:</strong> {new Date(selectedRequest.processedAt).toLocaleString()}</p>
                            )}

                            {/* Dropdown chọn trạng thái */}
                            <Form.Group className="mt-3">
                                <Form.Label><strong>Trạng thái:</strong></Form.Label>
                                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="inProgress">Đang xử lý</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    ) : (
                        <p>Không có thông tin yêu cầu.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateStatus} disabled={!selectedRequest}>
                        Cập nhật trạng thái
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RequestOrders;
