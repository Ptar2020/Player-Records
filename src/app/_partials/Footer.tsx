// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} LINKITS DIGITAL </p>{" "}
        <p> All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
