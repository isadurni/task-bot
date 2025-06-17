import React from 'react';
import '../App.css';

const Header = ({ onSignOut, userInfo }) => {
  console.log('Header userInfo:', userInfo); // Debug log

  return (
    <nav className="navbar fixed-top navbar-dark mb-4" style={{ backgroundColor: '#123a59' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <a className="navbar-brand d-flex align-items-center">
          <img 
            src="/task-bot-icon-white.png" 
            alt="Logo" 
            width="40" 
            height="30" 
            className="d-inline-block align-text-top me-2"
            style={{ marginLeft: '10px' }}
          />
          <span className="h3 mb-0 fs-2">Task Bot</span>
        </a>
        {userInfo && (
          <div className="dropdown">
            <button 
              className="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              {userInfo.picture && (
                <img 
                  src={userInfo.picture} 
                  alt="Profile" 
                  className="rounded-circle me-2"
                  width="32" 
                  height="32"
                  onError={(e) => {
                    console.error('Error loading profile picture:', e);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="fs-5 fw-bold">{userInfo.name}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button 
                  className="dropdown-item text-danger fw-bold d-flex align-items-center" 
                  onClick={onSignOut}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                  </svg>
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;