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
      getRequestHistory(orderId, auth.token)
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
    <Container className="mt-5 py-5" style={{ backgroundColor: '#f5f5f5', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)' }}>
      <Row>
        {/* Lịch sử yêu cầu */}
        <Col md={6} className="mb-4">
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              border: 'none',
              background: 'linear-gradient(135deg, #1c2526 0%, #000000 100%)', // Tông đen sang trọng
            }}
          >
            <Card.Header
              style={{
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                backgroundColor: '#FFA500', // Changed color to #FFA500
                color: '#ffffff',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3 className="mb-0" style={{ fontSize: '2rem', fontWeight: '700', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>
                Lịch sử yêu cầu
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: '#ffffff', padding: '2rem', color: '#000000' }}>
              {orderId ? (
                requests.length > 0 ? (
                  <Table responsive hover style={{ color: '#ffffff', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#2c3e50', color: '#ffd700', fontSize: '1.1rem' }}>
                        <th style={{ padding: '1rem', borderRadius: '10px 0 0 10px' }}>Mã đơn</th>
                        <th style={{ padding: '1rem' }}>Loại yêu cầu</th>
                        <th style={{ padding: '1rem' }}>Ghi chú</th>
                        <th style={{ padding: '1rem', borderRadius: '0 10px 10px 0' }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr
                          key={req.id}
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
                          onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
                        >
                          <td style={{ padding: '1rem', borderRadius: '10px 0 0 10px' }}>{orderId}</td>
                          <td style={{ padding: '1rem' }}>
                            {requestOptions.find((option) => option.value === req.typeId)?.name || 'N/A'}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <OverlayTrigger overlay={<Tooltip>{req.note || 'Không có ghi chú'}</Tooltip>}>
                              <span>{req.note || 'Không có ghi chú'}</span>
                            </OverlayTrigger>
                          </td>
                          <td style={{ padding: '1rem', borderRadius: '0 10px 10px 0' }}>
                            <Badge
                              bg={
                                req.status === 'completed'
                                  ? 'success'
                                  : req.status === 'inProgress'
                                    ? 'primary'
                                    : 'warning'
                              }
                              style={{
                                fontSize: '1rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                              }}
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
                  <p className="text-center" style={{ fontSize: '1.2rem', color: '#000000' }}>
                    Không có lịch sử yêu cầu
                  </p>
                )
              ) : (
                <p className="text-center" style={{ fontSize: '1.2rem', color: '#000000' }}>
                  Vui lòng tạo yêu cầu mới
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Form gửi yêu cầu */}
        <Col md={6}>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              border: 'none',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%)', // Tông trắng nhẹ nhàng
            }}
          >
            <Card.Header
              style={{
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                backgroundColor: '#FFA500', // Changed color to #FFA500
                color: '#ffffff',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3 className="mb-0" style={{ fontSize: '2rem', fontWeight: '700', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
                Gửi yêu cầu mới
              </h3>
            </Card.Header>
            <Card.Body style={{ padding: '2rem' }}>
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontSize: '1.2rem', fontWeight: '600', color: '#000000' }}>
                    Chọn loại yêu cầu:
                  </Form.Label>
                  <Form.Select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #ff6200',
                      fontSize: '1.1rem',
                      color: '#000000',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#ffd700')}
                    onBlur={(e) => (e.target.style.borderColor = '#ff6200')}
                  >
                    <option value="">-- Chọn yêu cầu --</option>
                    {requestOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontSize: '1.2rem', fontWeight: '600', color: '#000000' }}>
                    Ghi chú:
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú (nếu có)"
                    style={{
                      borderRadius: '12px',
                      padding: '12px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #ff6200',
                      fontSize: '1.1rem',
                      color: '#000000',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#ffd700')}
                    onBlur={(e) => (e.target.style.borderColor = '#ff6200')}
                  />
                </Form.Group>
                <Button
                  variant="warning"
                  className="w-100 fw-bold"
                  onClick={handleSubmit}
                  style={{
                    fontSize: '1.3rem',
                    padding: '15px',
                    borderRadius: '12px',
                    backgroundColor: '#ff6200',
                    borderColor: '#ff6200',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#ff6200')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#FFA500')}
                >
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
