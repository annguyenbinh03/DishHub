import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import { BsStickyFill, BsRobot, BsClock } from 'react-icons/bs';
import menuImage from '../../assets/images/tasting-menu.jpg';
import aiImage from '../../assets/images/anhChatbot.png';
import orderImage from '../../assets/images/phucvuban.jpg';

const Banner = () => {
    return (
        <Container className="mt-5 py-5" style={{ backgroundColor: '#1c1c1c', borderRadius: '20px', boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)' }}>
            <Carousel interval={2000} indicators={true} controls={true} pause={false} className="text-center">
                <Carousel.Item>
                    <div>
                        <BsStickyFill size={60} color="#FFD700" />
                        <h3 className="mt-3" style={{ color: '#FFA500', fontFamily: "'Arial', sans-serif", textShadow: '2px 2px 5px rgba(255, 215, 0, 0.3)' }}>Menu tinh tế</h3>
                        <p className="text-muted" style={{ color: '#f0f0f0', fontSize: '18px' }}>Khám phá sự đa dạng của chúng tôi và các món ăn được làm với niềm đam mê.</p>
                        <img
                            src={menuImage}
                            alt="Menu tinh tế"
                            className="img-fluid rounded"
                            style={{ maxHeight: '300px', maxWidth: '100%', border: '3px solid #FFD700', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div>
                        <BsRobot size={60} color="#FFD700" />
                        <h3 className="mt-3" style={{ color: '#FFA500', fontFamily: "'Arial', sans-serif", textShadow: '2px 2px 5px rgba(255, 215, 0, 0.3)' }}>Trợ lí AI</h3>
                        <p className="text-muted" style={{ color: '#f0f0f0', fontSize: '18px' }}>Nhận đề xuất và câu trả lời ngay lập tức cho các câu hỏi ăn uống của bạn.</p>
                        <img
                            src={aiImage}
                            alt="Trợ lí AI"
                            className="img-fluid rounded"
                            style={{ maxHeight: '300px', maxWidth: '100%', border: '3px solid #FFD700', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div>
                        <BsClock size={60} color="#FFD700" />
                        <h3 className="mt-3" style={{ color: '#FFA500', fontFamily: "'Arial', sans-serif", textShadow: '2px 2px 5px rgba(255, 215, 0, 0.3)' }}>Gọi món nhanh</h3>
                        <p className="text-muted" style={{ color: '#f0f0f0', fontSize: '18px' }}>Quá trình đặt hàng đơn giản, nhanh chóng và tiện lợi cho bữa ăn của bạn.</p>
                        <img
                            src={orderImage}
                            alt="Gọi món nhanh"
                            className="img-fluid rounded"
                            style={{ maxHeight: '300px', maxWidth: '100%', border: '3px solid #FFD700', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
};

export default Banner;
