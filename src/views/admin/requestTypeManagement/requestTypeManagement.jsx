import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice } from 'utils/formatPrice';

const RequestTypeManagement = () => {
    const [requestTypes, setRequestTypes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Quản lý Loại Yêu Cầu</h2>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên yêu cầu</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="2" className="text-center">Đang tải...</td>
                        </tr>
                    ) : requestTypes.length > 0 ? (
                        requestTypes.map((requestType) => (
                            <tr key={requestType.id}>
                                <td>{requestType.id}</td>
                                <td>{requestType.name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center">Không có loại yêu cầu nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default RequestTypeManagement;
