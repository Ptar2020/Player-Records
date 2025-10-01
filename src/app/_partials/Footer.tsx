// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} PLAYER RECORDS </p>{" "}
        <p> All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white py-4">
//       <div className="container mx-auto px-4 text-center">
//         <p>&copy; {new Date().getFullYear()} PLAYER RECORDS </p>{" "}
//         <p> All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
