import React from 'react';

const Login = ({ onLogin }) => {
  return (
    <div className="card" style={{ 
      marginTop: '250px',
      width: '600px',
      height: '400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: '1rem'
    }}>
      <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
        <h2 className="card-title mt-4 fw-bold">Welcome to Task Bot</h2>
        <img src="/task-bot-icon.png" alt="Task Bot Logo" className="" style={{ width: '180px', height: '150px' }} />
        <div className="d-flex flex-column align-items-center w-100">
          <p className="card-text mb-4">Connect your Google Suite to get started...</p>
          <button 
            className="btn btn-primary btn-lg rounded-3 w-100"
            style={{ backgroundColor: '#123a59', borderColor: '#123a59', color: 'white' }}
            onClick={onLogin}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 