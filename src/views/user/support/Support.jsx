import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Form, Button, Badge, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Support = () => {
  const [requestType, setRequestType] = useState('');
  const [note, setNote] = useState('');
  const [requests, setRequests] = useState([]);
  const [requestOptions, setRequestOptions] = useState([]);
  const [orderId, setOrderId] = useState(() => {
    return localStorage.getItem('orderId') ? parseInt(localStorage.getItem('orderId'), 10) : null;
  });

  useEffect(() => {
    if (orderId) {
      fetchRequestHistory(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/request-types')
      .then((response) => {
        if (response.data.isSucess) {
          const options = response.data.data.map(item => ({
            value: item.id,
            name: item.name
          }));
          setRequestOptions(options);
        }
      })
      .catch((error) => console.error('Error fetching request types:', error));
  }, []);

  const fetchRequestHistory = async (orderId) => {
    try {
      const response = await axios.get(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests/history?orderId=${orderId}`);
      if (response.data.isSucess) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching request history:', error);
    }
  };

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
          toast.error('Không xác định được bàn, vui lòng thử lại.');
          return;
        }

        const orderResponse = await axios.post(
          'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/orders',
          { tableId }
        );

        currentOrderId = orderResponse.data?.data?.orderId;
        if (!currentOrderId) {
          throw new Error('Không lấy được orderId từ API');
        }

        localStorage.setItem('orderId', currentOrderId);
        setOrderId(currentOrderId);
      }

      const requestBody = {
        orderId: currentOrderId,
        typeId: parseInt(requestType, 10),
        note: note,
      };

      const response = await axios.post(
        'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/requests',
        requestBody
      );

      if (response.data.isSucess) {
        toast.success('Yêu cầu đã được gửi thành công!');
        setRequestType('');
        setNote('');
        setRequests(prev => [...prev, response.data.data]);
      } else {
        toast.error('Gửi yêu cầu thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <Container className="mt-5 py-5">
      <Row className="d-flex flex-wrap">
        <Col md={6} xs={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Lịch sử yêu cầu</h3>
            </Card.Header>
            <Card.Body>
              {orderId ? (
                requests.length > 0 ? (
                  <Table responsive hover className="mb-0">
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
                          <td>{requestOptions.find(option => option.value === req.typeId)?.name || 'N/A'}</td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-${req.id}`}>
                                  {req.note || 'Không có ghi chú'}
                                </Tooltip>
                              }
                            >
                              <span>{req.note || 'Không có ghi chú'}</span>
                            </OverlayTrigger>
                          </td>
                          <td>
                            <Badge bg={req.status === 'pending' ? 'warning' : 'success'}>
                              {req.status === 'pending' ? 'Đang xử lý' : 'Hoàn thành'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center mb-0">Không có lịch sử yêu cầu</p>
                )
              ) : (
                <p className="text-center mb-0">Không có lịch sử yêu cầu</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xs={12}>
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
                    aria-label="Chọn loại yêu cầu"
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

                <Button 
                  variant="warning" 
                  className="w-100 fw-bold"
                  onClick={handleSubmit}
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