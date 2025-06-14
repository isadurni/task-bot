import React from 'react';
import '../App.css';

const Header = ({ onSignOut, userInfo }) => {
  console.log('Header userInfo:', userInfo); // Debug log

  return (
    <nav className="navbar navbar-dark mb-4" style={{ backgroundColor: '#123a59' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img 
            src="/task-bot-icon-white.png" 
            alt="Logo" 
            width="40" 
            height="30" 
            className="d-inline-block align-text-top me-2"
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
                  className="dropdown-item text-danger fw-bold" 
                  onClick={onSignOut}
                >
                  Sign Out
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