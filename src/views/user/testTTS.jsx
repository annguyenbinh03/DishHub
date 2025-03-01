import { useState, useEffect } from 'react';

const API_KEY = '0L6pGnZu'; 

const useResponsiveVoice = () => {
  const [isVoiceReady, setIsVoiceReady] = useState(false);

  useEffect(() => {
    console.log('Loading ResponsiveVoice script...');
    const script = document.createElement('script');
    script.src = `https://code.responsivevoice.org/responsivevoice.js?key=${API_KEY}`;
    script.async = true;
    
    script.onload = () => {
      console.log('ResponsiveVoice loaded successfully');
      setIsVoiceReady(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load ResponsiveVoice script');
    };
    
    document.body.appendChild(script);
    
    return () => {
      console.log('Removing ResponsiveVoice script...');
      document.body.removeChild(script);
    };
  }, []);

  const speak = (text) => {
    if (isVoiceReady && window.responsiveVoice) {
      console.log(`Speaking: ${text}`);
      window.responsiveVoice.speak(text, 'US English Female', { key: API_KEY });
    } else {
      console.error('ResponsiveVoice is not ready yet.');
    }
  };

  return { speak, isVoiceReady };
};

const TestTTS = () => {
  const { speak, isVoiceReady } = useResponsiveVoice();

  return (
    <div>
      <button onClick={() => speak('Tôi là AI')} disabled={!isVoiceReady}>
        Speak
      </button>
    </div>
  );
};

export default TestTTS;
