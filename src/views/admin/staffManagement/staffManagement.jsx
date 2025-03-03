import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';
import './staffManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '', fullName: '', email: '', dob: '', phoneNumber: '',
        address: '', avatar: '', status: 'true'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users?page=1&size=10');
            console.log(res.data.data.users);
            setUsers(res.data.data.users || []);
        } catch (error) {
            toast.error('Lỗi khi fetch dữ liệu!');
        }
    };

    const handleShowModal = (user) => {
        setCurrentUser(user);
        setFormData(user ? { ...user, dob: user.dob?.split('T')[0], status: user.status.toString() } : {
            username: '', fullName: '', email: '', dob: '', phoneNumber: '',
            address: '', avatar: '', status: 'true'
        });
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let uploadedUrl = formData.avatar;
            if (file) {
                const uploadResult = await useCloudinaryUpload(file);
                if (!uploadResult?.secure_url) throw new Error('Upload thất bại!');
                uploadedUrl = uploadResult.secure_url;
                toast.success('Upload thành công!', { autoClose: 3000, transition: Bounce });
            }
            
            const updatedFormData = { 
                username: formData.username, 
                fullName: formData.fullName, 
                email: formData.email, 
                dob: formData.dob, 
                phoneNumber: formData.phoneNumber, 
                address: formData.address, 
                status: formData.status === 'true', 
                avatar: uploadedUrl 
            };
            if (currentUser) {
                await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users/${currentUser.id}`, updatedFormData);
                toast.success(`Đã cập nhật ${formData.username} thành công!`);
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            toast.error(err.message || 'Lỗi khi upload ảnh!', { autoClose: 5000, transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users/${id}`);
            fetchUsers();
            toast.success('Đã xóa thành công!');
        } catch (error) {
            toast.error('Lỗi khi xóa dữ liệu!');
        }
    };

    return (
        <Container>
            <ToastContainer />
            <h2 className="text-center mb-4"> Quản lý nhân viên</h2>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th><th>Avatar</th><th>Tên đăng nhập</th><th>Họ và tên</th>
                        <th>Email</th><th>Ngày sinh</th><th>Số điện thoại</th><th>Vai trò</th>
                        <th>Địa chỉ</th><th>Trạng thái</th><th>Ngày tạo</th><th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length ? users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td><img src={user.avatar} alt={user.username} className="user-avatar rounded" /></td>
                            <td className="table-cell-truncate" data-fulltext={user.username}>{user.username}</td>
                            <td className="table-cell-truncate" data-fulltext={user.fullName}>{user.fullName}</td>
                            <td className="table-cell-truncate" data-fulltext={user.email}>{user.email}</td>
                            <td>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</td>
                            <td className="table-cell-truncate" data-fulltext={user.phoneNumber}>{user.phoneNumber}</td>
                            <td>{user.roleId}</td>
                            <td className="table-cell-truncate" data-fulltext={user.address}>{user.address}</td>
                            <td><Badge bg={user.status ? 'success' : 'danger'}>{user.status ? 'Hoạt động' : 'Không hoạt động'}</Badge></td>
                            <td>{user.createAt ? new Date(user.createAt).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleShowModal(user)}>Sửa</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Xóa</Button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="12" className="text-center">Không có dữ liệu.</td></tr>}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {[
                            { key: 'username', label: 'Tên đăng nhập' },
                            { key: 'fullName', label: 'Họ và tên' },
                            { key: 'email', label: 'Email' },
                            { key: 'dob', label: 'Ngày sinh' },
                            { key: 'phoneNumber', label: 'Số điện thoại' },
                            { key: 'address', label: 'Địa chỉ' },
                            { key: 'status', label: 'Trạng thái' }
                        ].map(({ key, label }) => (
                            <Form.Group className="mb-3" key={key}>
                                <Form.Label>{label}</Form.Label>
                                {key === 'status' ? (
                                    <Form.Control as="select" name={key} value={formData[key]} onChange={handleChange}>
                                        <option value="true">Hoạt động</option>
                                        <option value="false">Không hoạt động</option>
                                    </Form.Control>
                                ) : (
                                    <Form.Control type={key === 'dob' ? 'date' : 'text'} name={key} value={formData[key]} onChange={handleChange} />
                                )}
                            </Form.Group>
                        ))}
                        <Form.Group className="mb-3">
                            <Form.Label>Avatar</Form.Label>
                            <ImagePicker setFile={setFile} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Uploading...' : 'Cập nhật'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;




