import axios from 'axios';
import useAuth from 'hooks/useAuth';
import useOrder from 'hooks/useOrder';
import { useEffect, useState } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { formatPrice } from 'utils/formatPrice';
import { useNavigate } from 'react-router-dom';

const paymentInfo = () => {
  const { orderId, createOrderId, clearOrderId } = useOrder();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  console.log(orderId);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId !== -1 && orderId !== 0) {
      fetchDataPayment();
    } else {
      navigate('/user/about-me');
    }
  }, []);

  const fetchDataPayment = async () => {
    const paymentId = localStorage.getItem('paymentId');
    console.log(paymentId);
    if (paymentId) {
      try {
        const response = await axios.get(
          `https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/payments/pay/info/${paymentId}`
        );
        setData(response.data.data);
        setLoading(false);
        localStorage.removeItem('paymentId');
      } catch (error) {
        console.error('Lỗi lấy thông tin thanh toán:', error);
      }
    } else {
      navigate('/user/about-me');
    }
  };

  const handleClickClose = () =>{
    clearOrderId();
    navigate('/user/about-me');
  }

  return (
    <>
      {loading || !data ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <Container
          fluid
          className="text-center py-5"
          style={{
            background: '#1c1c1c', // Màu đen toàn màn hình
            color: '#FFFFFF',
            borderBottom: '2px solid #FFD700', // Viền vàng ánh kim
            minHeight: '150vh',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <Container className="d-flex justify-content-center mt-5">
            <Card className="rounded" style={{ width: '36rem' }}>
              <Card.Body>
                <Card.Title>
                  <FaCheckCircle size={80} color="green" className="mb-3" />
                  <h4 className="mb-3">Thanh toán thành công!</h4>
                </Card.Title>
                <Card.Text>Thông tin giao dịch của bạn đã được ghi nhận. Vui lòng kiểm tra chi tiết bên dưới.</Card.Text>
              </Card.Body>
              <Card.Body className="fs-5">
                <div className="d-flex justify-content-between">
                  <div>Mã đơn hàng:</div>
                  <div>{data.id ? data.id : ''}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Hình thức thanh toán:</div>
                  <div>{data.methodName ? data.methodName : ''}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Mã giao dịch:</div>
                  <div>{data.transactionCode ? data.transactionCode : ''}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Thời gian thanh toán:</div>
                  <div>{data.createdAt ? data.createdAt : ''}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Số tiền:</div>
                  <div>{data.amount ? formatPrice(data.amount) : '0'}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Mô tả:</div>
                  <div>{data.description ? data.description : ''}</div>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="mb-3">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</div>
                <button
                  style={{
                    backgroundColor: '#FF6347', // Màu cam
                    borderColor: '#FF6347', // Màu viền cam
                    padding: '10px 30px', // Tăng khoảng đệm
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  className="btn-primary"
                  onClick={handleClickClose}
                >
                  Đóng
                </button>
              </Card.Footer>
            </Card>
          </Container>
        </Container>
      )}
    </>
  );
};

export default paymentInfo;
