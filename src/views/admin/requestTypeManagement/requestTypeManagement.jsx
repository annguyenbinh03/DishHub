import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestTypeManagement = () => {
    const [requestTypes, setRequestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newRequestTypeName, setNewRequestTypeName] = useState('');
    const [editRequestTypeId, setEditRequestTypeId] = useState(null);

    useEffect(() => {
        fetchRequestTypes();
    }, []);

    const fetchRequestTypes = () => {
        setLoading(true);
        axios
            .get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/request-types')
            .then((res) => {
                if (res.data.isSucess) {
                    setRequestTypes(res.data.data);
                } else {
                    toast.error('Lỗi tải danh sách loại yêu cầu!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu:', error);
                toast.error('Không thể tải danh sách loại yêu cầu!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddRequestType = () => {
        if (!newRequestTypeName.trim()) {
            toast.error('Vui lòng nhập tên yêu cầu.');
            return;
        }

        const url = editRequestTypeId
            ? `https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/request-types/${editRequestTypeId}`
            : 'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/request-types';

        const method = editRequestTypeId ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            data: JSON.stringify(newRequestTypeName),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.data.isSucess) {
                    toast.success(editRequestTypeId ? 'Cập nhật loại yêu cầu thành công!' : 'Thêm loại yêu cầu thành công!');
                    fetchRequestTypes(); // Reload the request types
                    setShowModal(false); // Close modal
                    setNewRequestTypeName(''); // Clear input field
                    setEditRequestTypeId(null); // Clear edit ID
                } else {
                    toast.error(editRequestTypeId ? 'Cập nhật loại yêu cầu thất bại!' : 'Thêm loại yêu cầu thất bại!');
                }
            })
            .catch((error) => {
                console.error(editRequestTypeId ? 'Lỗi khi cập nhật loại yêu cầu:' : 'Lỗi khi thêm loại yêu cầu:', error);
                if (error.response && error.response.status === 400) {
                    toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                } else {
                    toast.error(editRequestTypeId ? 'Không thể cập nhật loại yêu cầu!' : 'Không thể thêm loại yêu cầu!');
                }
            });
    };

    const handleEditRequestType = (id, name) => {
        setEditRequestTypeId(id);
        setNewRequestTypeName(name);
        setShowModal(true);
    };

    const handleDeleteRequestType = (id) => {
        axios
            .delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/request-types/${id}`)
            .then((res) => {
                if (res.data.isSucess) {
                    toast.success(`Loại yêu cầu ID ${id} đã xóa thành công!`);
                    fetchRequestTypes(); // Reload the request types
                } else {
                    toast.error('Xóa loại yêu cầu thất bại!');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi xóa loại yêu cầu:', error);
                toast.error('Không thể xóa loại yêu cầu!');
            });
    };

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý Loại Yêu Cầu</h2>
            <Button variant="primary" onClick={() => setShowModal(true)} className="mb-4">
                Thêm loại yêu cầu mới
            </Button>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên yêu cầu</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="3" className="text-center">Đang tải...</td>
                        </tr>
                    ) : requestTypes.length > 0 ? (
                        requestTypes.map((requestType) => (
                            <tr key={requestType.id}>
                                <td>{requestType.id}</td>
                                <td>{requestType.name}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditRequestType(requestType.id, requestType.name)} className="me-2">
                                        Sửa
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteRequestType(requestType.id)}>
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">Không có loại yêu cầu nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Thêm loại yêu cầu mới */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editRequestTypeId ? 'Cập nhật loại yêu cầu' : 'Thêm loại yêu cầu mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formNewRequestType">
                        <Form.Label>Tên loại yêu cầu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên loại yêu cầu"
                            value={newRequestTypeName}
                            onChange={(e) => setNewRequestTypeName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddRequestType}>
                        {editRequestTypeId ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RequestTypeManagement;
