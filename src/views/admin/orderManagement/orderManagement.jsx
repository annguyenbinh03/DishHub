import React, { useState, useEffect } from 'react';
import { Table, Container, Badge } from 'react-bootstrap';
import { getAdminOrders } from 'services/orderService';
import { formatPrice } from 'utils/formatPrice';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    // Fetch all orders
    const fetchOrders = async () => {
        const response = await getAdminOrders();
        setOrders(response?.data || []); // Set empty array if data is undefined or not available
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">📋 Quản lý đơn hàng 📋</h2>

            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Table Id</th>
                        <th>Table Name</th>
                        <th>Total Amount</th>
                        <th>Payment Status</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.tableId}</td>
                                <td>{order.tableName || 'N/A'}</td> {/* Handle null or empty tableName */}
                                <td>{formatPrice(order.totalAmount)}</td>
                                <td>
                                    <Badge bg={order.paymentStatus ? 'success' : 'secondary'}>
                                        {order.paymentStatus ? 'Paid' : 'Unpaid'}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge bg={order.status === 'completed' ? 'success' : 'secondary'}>
                                        {order.status === 'completed' ? 'Completed' : 'Pending'}
                                    </Badge>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Không tìm thấy dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default OrderManagement;
