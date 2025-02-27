import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestsOrder = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        note: '',
        status: 'pending',
        createdAt: '',
    });

    const fetchRequests = (orderId) => {
        setLoading(true);
        axios
            .get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests/history?orderID=${orderId}`)
            .then((res) => {
                if (res.data.isSucess) {
                    setRequests(res.data.data);
                } else {
                    toast.error('No requests found for this Order ID');
                    setRequests([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching requests:', error);
                toast.error('Error fetching requests!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearch = () => {
        if (searchOrderId.trim()) {
            fetchRequests(searchOrderId);
        } else {
            toast.error('Please enter a valid Order ID');
        }
    };

    const handleShowModal = (request = null) => {
        if (request) {
            setFormData({
                id: request.id,
                note: request.note,
                status: request.status,
                createdAt: request.createdAt,
            });
        } else {
            setFormData({
                id: null,
                note: '',
                status: 'pending',
                createdAt: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        setLoading(true);

        // Prepare data to send to API
        const requestData = {
            note: formData.note,
            status: formData.status,
            createdAt: formData.createdAt,
        };

        const apiUrl = formData.id
            ? `https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests/history/${formData.id}` // Update if there's an ID
            : 'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests/history'; // Create if no ID

        const method = formData.id ? 'put' : 'post'; // Use PUT for update, POST for create

        axios[method](apiUrl, requestData)
            .then((res) => {
                fetchRequests(searchOrderId); // Reload requests list
                setShowModal(false); // Close the modal
                toast.success(formData.id ? 'Request updated successfully!' : 'Request created successfully!');
            })
            .catch((error) => {
                toast.error(formData.id ? 'Update request failed!' : 'Create request failed!');
                console.error('Error creating/updating request:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Request Order Management</h2>

            {/* Search Input */}
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Enter Order ID"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                />
                <Button variant="primary" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </InputGroup>

            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Type Id</th>
                        <th>Created At</th>
                        <th>Note</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center">Loading...</td>
                        </tr>
                    ) : (
                        requests.length > 0 ? (
                            requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.typeId}</td>
                                    <td>{request.createdAt}</td>
                                    <td>{request.note}</td>
                                    <td>{request.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No requests found for this Order ID</td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>

            {/* Modal to create or update request */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{formData.id ? 'Update Request' : 'Add Request'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                type="text"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Enter note"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Created At</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="createdAt"
                                value={formData.createdAt}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : formData.id ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RequestsOrder;
