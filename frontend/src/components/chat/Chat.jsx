import React, { useState, useEffect } from 'react';
import './chat.css';

const Chat = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

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
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
          />
          <button 
            className="btn btn-lg"
            style={{ backgroundColor: '#123a59', borderColor: '#123a59', color: 'white' }}
            onClick={handleSendMessage}
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;