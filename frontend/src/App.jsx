import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Login from './components/Login';
import Chat from './components/chat/Chat';
import Footer from './components/Footer';
import SideBar from './components/SideBar';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUserInfo(data.user_info);
        resetChatHistory();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth", error);
    } finally {
      setAuthChecked(true);
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

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        credentials: 'include',
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetChatHistory = async () => {
    try {
      await fetch('http://localhost:8000/reset-chat', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Chat history reset successfully');
    } catch (error) {
      console.error('Error resetting chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (message.trim().toLowerCase() === 'clear' || message.trim().toLowerCase() === 'reset') {
      await resetChatHistory();
      setMessage('');
      setResponse('Chat reset.');
      return;
    }

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
    <Router>
      <div className="container-fluid py-4">
        <Footer />
        {!authChecked ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '80vh' }}
          >
            <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/chat" />
                ) : (
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                      <Login onLogin={handleLogin} />
                    </div>
                  </div>
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <>
                    <Header onSignOut={handleSignOut} userInfo={userInfo} />
                    <div className="row">
                      <div className="col-2">
                        <SideBar />
                      </div>
                      <div className="col-8">
                        <Chat
                          message={message}
                          setMessage={setMessage}
                          response={response}
                          isLoading={isLoading}
                          onSendMessage={handleSendMessage}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />}
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
