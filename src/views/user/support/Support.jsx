import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Badge,
  Card,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createRequest, getRequestHistory, getRequestTypes } from 'services/requestService';
import { createOrder } from 'services/orderService';
import useAuth from 'hooks/useAuth';

const Support = () => {
  const [requestType, setRequestType] = useState('');
  const [note, setNote] = useState('');
  const [requests, setRequests] = useState([]);
  const [requestOptions, setRequestOptions] = useState([]);
  const [orderId, setOrderId] = useState(() => {
    const stored = localStorage.getItem('orderId');
    return stored ? parseInt(stored, 10) : null;
  });
  const { auth } = useAuth();

  // Lấy danh sách loại yêu cầu
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getRequestTypes(auth.token);
        if (response.isSucess) {
          setRequestOptions(response.data.map((item) => ({ value: item.id, name: item.name })));
        }
      } catch (error) {
        toast.error('Lỗi tải loại yêu cầu');
      }
    };
    fetchTypes();
  }, [auth.token]);

  // Lấy lịch sử yêu cầu nếu có orderId
  useEffect(() => {
    if (orderId) {
      getRequestHistory( orderId, auth.token)
        .then((response) => {
          if (response.isSucess) {
            setRequests(response.data); 
          }
        })
        .catch(() => toast.error('Lỗi tải lịch sử yêu cầu'));
    }
  }, [auth.token, orderId]);

  const handleSubmit = async () => {
    if (!requestType) {
      toast.warning('Vui lòng chọn loại yêu cầu!');
      return;
    }

    let currentOrderId = orderId;
    const tableId = localStorage.getItem('tableId');

    try {
      if (!currentOrderId) {
        if (!tableId) {
          toast.error('Không xác định được bàn!');
          return;
        }
        const orderResponse = await createOrder(auth.token, { tableId: parseInt(tableId, 10) });
        if (!orderResponse.isSucess) throw new Error('Tạo order thất bại');

        currentOrderId = orderResponse.data.orderId;
        localStorage.setItem('orderId', currentOrderId);
        setOrderId(currentOrderId);
      }

      const requestResponse = await createRequest(auth.token, {
        orderId: currentOrderId,
        typeId: parseInt(requestType, 10),
        note,
      });
      if (requestResponse.isSucess) {
        toast.success('Gửi yêu cầu thành công!');
        setRequests((prev) => [requestResponse.data, ...prev]);
        setRequestType('');
        setNote('');
      } else {
        toast.error('Gửi yêu cầu thất bại!');
      }
    } catch (error) {
      toast.error(error.message || 'Lỗi hệ thống!');
    }
  };

  return (
    <Container className="mt-5 py-5">
      <Row>
        {/* Lịch sử yêu cầu */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Lịch sử yêu cầu</h3>
            </Card.Header>
            <Card.Body>
              {orderId ? (
                requests.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Loại yêu cầu</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.id}>
                          <td>{orderId}</td>
                          <td>
                            {requestOptions.find((option) => option.value === req.typeId)?.name || 'N/A'}
                          </td>
                          <td>
                            <OverlayTrigger
                              overlay={<Tooltip>{req.note || 'Không có ghi chú'}</Tooltip>}
                            >
                              <span>{req.note || 'Không có ghi chú'}</span>
                            </OverlayTrigger>
                          </td>
                          <td>
                            <Badge
                              bg={
                                req.status === 'completed'
                                  ? 'success'
                                  : req.status === 'inProgress'
                                  ? 'primary'
                                  : 'warning'
                              }
                            >
                              {req.status === 'completed'
                                ? 'Hoàn thành'
                                : req.status === 'inProgress'
                                ? 'Đang xử lý'
                                : 'Đang chờ'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center">Không có lịch sử yêu cầu</p>
                )
              ) : (
                <p className="text-center">Vui lòng tạo yêu cầu mới</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Form gửi yêu cầu */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Gửi yêu cầu mới</h3>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn loại yêu cầu:</Form.Label>
                  <Form.Select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="">-- Chọn yêu cầu --</option>
                    {requestOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </Form.Group>
                <Button variant="warning" className="w-100 fw-bold" onClick={handleSubmit}>
                  Gửi yêu cầu
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Support;
