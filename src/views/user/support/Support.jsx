import React, { useState } from 'react';
import { Container, Table, Form, Button, Badge } from 'react-bootstrap';

const Support = () => {
  const [requestType, setRequestType] = useState('');
  const [note, setNote] = useState('');
  const requestOptions = [
    'Khăn ăn bổ sung',
    'Đổi bàn',
    'Dụng cụ đặc biệt',
    'Trang trí sinh nhật',
    'Thêm ghế',
    'Dọn bàn',
    'Yêu cầu góp ý',
    'Thực đơn trẻ em',
    'Đổi ánh sáng',
    'Trợ giúp khẩn cấp',
    'Khác'
  ];

  return (
    <Container className="d-flex justify-content-between align-items-start mt-5 ">
      {/* Lịch sử yêu cầu */}
      <div className="p-4 bg-primary text-white rounded" style={{ width: '50%' }}>
        <h3 className="text-center">Lịch sử yêu cầu</h3>
        <Table striped bordered hover variant="primary" className="text-center">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Loại yêu cầu</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A123</td>
              <td>Đổi bàn</td>
              <td>Cần bàn gần cửa sổ</td>
              <td>
                <Badge bg="warning">Đang xử lý</Badge>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Gửi yêu cầu mới */}
      <div className="p-4" style={{ width: '40%' }}>
        <h3>Gửi yêu cầu mới</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Chọn loại yêu cầu:</Form.Label>
            <Form.Select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
              <option>-- Chọn yêu cầu --</option>
              {requestOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ghi chú:</Form.Label>
            <Form.Control type="text" value={note} onChange={(e) => setNote(e.target.value)} />
          </Form.Group>

          <Button variant="warning" className="w-100">
            Gửi yêu cầu
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Support;
