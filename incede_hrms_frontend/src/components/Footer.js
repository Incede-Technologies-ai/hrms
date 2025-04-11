import React from 'react';
import './Footer.css'; // Optional: Add CSS for styling

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} INCEDE TECHNOLOGIES PVT LTD. All rights reserved.</p>
    </footer>
  );
}

export default Footer;