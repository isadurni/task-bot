import React from 'react';
import './chat.css';

const Chat = ({ message, setMessage, response, isLoading, onSendMessage }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="conversation-history">
          {response && (
            <div className="message-container">
              <div className="user-message">
                <strong>You:</strong> {message}
              </div>
              <div className="bot-message">
                <strong>Bot:</strong> {response}
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
            style={{ backgroundColor: '#123a59', borderColor: '#123a59', color: 'white' }}
            onClick={onSendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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