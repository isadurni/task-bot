import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light" style={{position: 'fixed', bottom: 0, width: '100%', left: '0', height: '6vh'}}>
      <div className="container text-center" style={{ justifyContent: 'center', display: 'flex' }}>
        <span className="text-muted" style={{ fontSize: '13px' }}>© 2025 Task Bot. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;