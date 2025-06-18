import React, { useState, useEffect } from 'react';
import './chat.css';

const Chat = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = async () => {
    try {
      // Call backend to reset chat history
      await fetch('http://localhost:8000/reset-chat', {
        method: 'POST',
      });
      
      // Reload the page to refresh the chat
      window.location.reload();
    } catch (error) {
      console.error('Error resetting chat:', error);
    }
  };

  useEffect(() => {
    // Fetch chat history from backend
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/chat-history');
        const data = await response.json();
        setChatHistory(data.messages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
  
    if (message.trim() === "clear" || message.trim() === "reset") {
      handleNewChat();
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
        console.error('Please login first');
        return;
      }
  
      const data = await res.json();
      setMessage('');
  
      // Fetch updated chat history after sending message
      const historyResponse = await fetch('http://localhost:8000/chat-history');
      const historyData = await historyResponse.json();
      setChatHistory(historyData.messages);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="conversation-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className="message-container">
              <div className={msg.sender === "You" ? "user-message" : "bot-message"}>
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-container">
              <div className="bot-message">
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
          />
          <button 
            className="btn btn-lg"
            style={{ 
              backgroundColor: isLoading ? '#6c757d' : '#123a59', 
              borderColor: isLoading ? '#6c757d' : '#123a59', 
              color: 'white' 
            }}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Sending...</span>
              </div>
            ) : (
              'Chat'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;