import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light" style={{position: 'fixed', bottom: 0, width: '100%'}}>
      <div className="container text-center">
        <span className="text-muted">© 2025 Task Bot. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;