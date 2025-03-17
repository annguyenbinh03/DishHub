import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';
import './staffManagement.css';
import useAuth from 'hooks/useAuth';

const UserManagement = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '', fullName: '', email: '', dob: '', phoneNumber: '',
        address: '', avatar: '', isDeleted: 'false', password: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    
    const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users?page=1&size=10', config);
            setUsers(res.data.data.users || []);
        } catch (error) {
            toast.error('Lỗi khi fetch dữ liệu!');
        }
    };

    const handleShowModal = (user = null, viewOnly = false) => {
        setSelectedUser(user);
        setIsEditing(!!user && !viewOnly);
        setIsViewing(viewOnly);
        setFormData(user ? { ...user, dob: user.dob?.split('T')[0], isDeleted: user.isDeleted ? 'true' : 'false' } : {
            username: '', fullName: '', email: '', dob: '', phoneNumber: '',
            address: '', avatar: '', isDeleted: 'false', password: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFile(null);
        setIsViewing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        // Validate form data
        if (!formData.username || !formData.fullName || !formData.email || !formData.dob || !formData.phoneNumber || !formData.address) {
            toast.error('Vui lòng điền đầy đủ thông tin!', { autoClose: 3000, transition: Bounce });
            return;
        }

        // Validate phone number
        const phoneNumberPattern = /^[0-9]+$/;
        if (!phoneNumberPattern.test(formData.phoneNumber)) {
            toast.error('Số điện thoại chỉ được chứa số!', { autoClose: 3000, transition: Bounce });
            return;
        }

        setLoading(true);
        try {
            let uploadedUrl = formData.image; // Use existing image URL if no new file is selected
    
            // Kiểm tra xem file có tồn tại không
            if (file) {
                // Upload file lên Cloudinary
                const uploadResult = await useCloudinaryUpload(file);
    
                if (!uploadResult || !uploadResult) {
                    throw new Error('Upload thất bại!');
                }
    
                uploadedUrl = uploadResult;
    
                // Hiển thị thông báo thành công
                toast.success(`Upload thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                    transition: Bounce
                });
            }
            
            const updatedFormData = { ...formData, avatar: uploadedUrl, isDeleted: formData.isDeleted === 'true' };
            if (isEditing) {
                await axios.put(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users/${selectedUser.id}`, updatedFormData),  config;
                toast.success(`Cập nhật ${formData.username} thành công!`);
            } else {
                await axios.post('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users', updatedFormData,  config);
                toast.success(`Thêm ${formData.username} thành công!`);
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            toast.error(err.message || 'Lỗi khi cập nhật!', { autoClose: 5000, transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/users/${id}`, config);
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
            <Table striped bordered hover responsive className="text-center custom-table">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Avatar</th>
                        <th>Tên đăng nhập</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length ? users.map((user, index) => (
                        <tr key={user.id} onClick={() => handleShowModal(user, true)} style={{ cursor: 'pointer' }}>
                            <td className="table-cell-truncate" data-fulltext={index + 1}>{index + 1}</td>
                            <td className="table-cell-truncate" data-fulltext={user.avatar}><img src={user.avatar} alt={user.username} className="user-avatar rounded" /></td>
                            <td className="table-cell-truncate" data-fulltext={user.username}>{user.username}</td>
                            <td className="table-cell-truncate" data-fulltext={user.fullName}>{user.fullName}</td>
                            <td className="table-cell-truncate" data-fulltext={user.phoneNumber}>{user.phoneNumber}</td>
                            <td className="table-cell-truncate" data-fulltext={user.roleId}>{user.roleId}</td>
                            <td className="table-cell-truncate" data-fulltext={user.isDeleted ? 'Không hoạt động' : 'Hoạt động'}>
                                <Badge bg={user.isDeleted ? 'danger' : 'success'}>
                                    {user.isDeleted ? 'Không hoạt động' : 'Hoạt động'}
                                </Badge>
                            </td>
                            <td className="table-cell-truncate" data-fulltext="Sửa / Xóa">
                                <Button variant="warning" size="sm" onClick={(e) => { e.stopPropagation(); handleShowModal(user); }}>
                                    Sửa
                                </Button>
                                <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="8" className="text-center">Không có dữ liệu.</td></tr>}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Cập nhật nhân viên' : isViewing ? 'Chi tiết nhân viên' : 'Thêm nhân viên'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isViewing ? (
                        <div className="details-view text-left">
                            <div className="details-row">
                                <strong>Tên đăng nhập:</strong> <span>{formData.username}</span>
                            </div>
                            <div className="details-row">
                                <strong>Họ và tên:</strong> <span>{formData.fullName}</span>
                            </div>
                            <div className="details-row">
                                <strong>Email:</strong> <span>{formData.email}</span>
                            </div>
                            <div className="details-row">
                                <strong>Ngày sinh:</strong> <span>{formData.dob}</span>
                            </div>
                            <div className="details-row">
                                <strong>Số điện thoại:</strong> <span>{formData.phoneNumber}</span>
                            </div>
                            <div className="details-row">
                                <strong>Địa chỉ:</strong> <span>{formData.address}</span>
                            </div>
                            <div className="details-row">
                                <strong>Avatar:</strong> <img src={formData.avatar} alt="Avatar" className="details-avatar" />
                            </div>
                            <div className="details-row">
                                <strong>Trạng thái:</strong> <span>{formData.isDeleted === 'true' ? 'Không hoạt động' : 'Hoạt động'}</span>
                            </div>
                        </div>
                    ) : (
                        <Form>
                            {[
                                { key: 'username', label: 'Tên đăng nhập' },
                                { key: 'fullName', label: 'Họ và tên' },
                                { key: 'email', label: 'Email' },
                                { key: 'dob', label: 'Ngày sinh' },
                                { key: 'phoneNumber', label: 'Số điện thoại' },
                                { key: 'address', label: 'Địa chỉ' },
                                { key: 'password', label: 'Mật khẩu' } // Add password field
                            ].map(({ key, label }) => (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{label}</Form.Label>
                                    <Form.Control type={key === 'dob' ? 'date' : key === 'password' ? 'password' : 'text'} name={key} value={formData[key]} onChange={handleChange} readOnly={isViewing} />
                                </Form.Group>
                            ))}
                            <Form.Group className="mb-3">
                                <Form.Label>Avatar</Form.Label>
                                <ImagePicker setFile={setFile} disabled={isViewing} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select name="isDeleted" value={formData.isDeleted} onChange={handleChange} disabled={isViewing}>
                                    <option value="false">Hoạt động</option>
                                    <option value="true">Không hoạt động</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                    {!isViewing && <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Đang cập nhật...' : isEditing ? 'Cập nhật' : 'Thêm'}</Button>}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;
