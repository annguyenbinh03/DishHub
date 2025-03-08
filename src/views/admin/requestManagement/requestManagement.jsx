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
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTableName, setSearchTableName] = useState(''); // New state for search
    const [filterRestaurant, setFilterRestaurant] = useState('all'); // New state for restaurant filter

    useEffect(() => {
        fetchRequests();
    }, [filterRestaurant]); // Add filterRestaurant as a dependency

    const fetchRequests = () => {
        setLoading(true);
        axios
            .get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests?restaurantId=${filterRestaurant}`)
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
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const filteredRequests = requests.filter(request =>
        (filterStatus === 'all' || request.status === filterStatus) &&
        request.tableName.toLowerCase().includes(searchTableName.toLowerCase()) // Filter by table name
    );

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

            {/* Dropdown lọc nhà hàng */}
            <Form.Group className="mb-3">
                <Form.Label><strong>Lọc theo nhà hàng:</strong></Form.Label>
                <Form.Select value={filterRestaurant} onChange={(e) => setFilterRestaurant(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="1">Nhà hàng 1</option>
                    <option value="2">Nhà hàng 2</option>
                    <option value="3">Nhà hàng 3</option>
                </Form.Select>
            </Form.Group>

            {/* Search by table name */}
            <Form.Group className="mb-3">
                <Form.Label><strong>Tìm kiếm theo tên bàn:</strong></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nhập tên bàn"
                    value={searchTableName}
                    onChange={(e) => setSearchTableName(e.target.value)}
                />
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
                        <th>Bàn</th> {/* New column for table name */}
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="text-center">Đang tải...</td> {/* Update colspan */}
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
                                <td>{request.tableName}</td> {/* New data for table name */}
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleShowModal(request)}>
                                        Xem
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">Không có yêu cầu nào.</td> {/* Update colspan */}
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Chi Tiết */}
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
                            <p><strong>Bàn:</strong> {selectedRequest.tableName}</p> {/* New data for table name */}
                        </div>
                    ) : (
                        <p>Không có thông tin yêu cầu.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RequestOrders;
