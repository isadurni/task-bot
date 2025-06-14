import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Login from './components/Login';
import Chat from './components/chat/Chat';
import Footer from './components/Footer';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        credentials: 'include',
      });
      setIsAuthenticated(false);
      sessionStorage.setItem('isAuthenticated', 'false');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
  
    if (code && state) {
      handleCallback(code, state);
    } else {
      checkAuth();
    }
  }, []);
  
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/me", {
        credentials: "include",
      });
      const data = await res.json();
      console.log('Auth check response:', data);
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUserInfo(data.user_info);
      }
    } catch (error) {
      console.error("Error checking auth", error);
    }
  };
  
  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8000/auth', {
        credentials: 'include',
      });
      const data = await res.json();
      window.location.href = data.auth_url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: message }),
      });

      if (res.status === 401) {
        setResponse('Please login first');
        return;
      }

      const data = await res.json();
      setResponse(data.response);
      setMessage('');
    } catch (error) {
      setResponse('Error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      {isAuthenticated && (
        <Header onSignOut={handleSignOut} userInfo={userInfo} />
      )}
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Chat
              message={message}
              setMessage={setMessage}
              response={response}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
