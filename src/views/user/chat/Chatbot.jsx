import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Spinner, Card, Image, Row, Col } from 'react-bootstrap';
import { FaPaperPlane, FaVolumeUp, FaVolumeMute, FaMicrophone } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import botSmile from '../../../assets/animation/tinywow_smile_72887038.gif';
import botTalking from '../../../assets/animation/tinywow_talking_72887143.gif';

const ELEVENLABS_API_KEY = 'sk_1710ec4d0e428d2e87c14c1ec923f401351b4f0d3a2c489e';
const VOICE_ID = 'rCmVtv8cYU60uhlsOo1M';
const API_URL = 'https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/gemini/message';

const fetchAudioFromText = async (text, isSoundOn, audioRef, setBotGif) => {
  if (!isSoundOn) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    return;
  }
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioRef.current.src = audioUrl;
    setBotGif(botTalking);
    audioRef.current.play();

    audioRef.current.onended = () => {
      setBotGif(botSmile);
    };
  } catch (error) {
    console.error('Lỗi gọi API ElevenLabs:', error);
  }
};

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [botGif, setBotGif] = useState(botSmile);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleSound = () => {
    setIsSoundOn((prev) => {
      if (!prev && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return !prev;
    });
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        { message: input },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const aiResponse = res.data.message || 'Không nhận được phản hồi.';
      const aiMessage = { text: aiResponse, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      fetchAudioFromText(aiResponse, isSoundOn, audioRef, setBotGif);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      const errorMessage = { text: 'Đã xảy ra lỗi khi lấy phản hồi.', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container fluid className="bg-dark text-white vh-100 d-flex flex-column position-fixed top-0 start-0 w-100 py-5 ">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center mb-3 mt-4 mb-1">
            <Image src={botGif} alt="Bot Animation" fluid style={{ width: '300px', height: '180px' }} />
          </div>  
          <div className="d-flex justify-content-end gap-2 mb-1">
            <Button variant="light" onClick={toggleSound}>
              {isSoundOn ? <FaVolumeUp /> : <FaVolumeMute />}
            </Button>
            <Button variant="light" onClick={startListening} disabled={isListening}>
              <FaMicrophone color={isListening ? 'red' : 'black'} />
            </Button>
          </div>
          <div
            className="chat-box bg-dark flex-grow-1 overflow-auto p-3 border rounded"
            ref={chatBoxRef}
            style={{ height: '50vh', background: '#f8f9fa' }}
          >
            {messages.map((message, index) => (
              <div key={index} className={`d-flex mb-2 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <Card
                  className={`p-2 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                  style={{ maxWidth: '70%', borderRadius: '10px' }}
                >
                  <p className="mb-0">{message.text}</p>
                </Card>
              </div>
            ))}
          </div>
          <InputGroup className="mt-3">
            <FormControl
              placeholder="Hãy hỏi bất cứ thứ gì..."
              className="bg-light text-dark"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="primary" onClick={handleSend} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : <FaPaperPlane />}
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <audio ref={audioRef} />
    </Container>
  );
};

export default Chatbot;