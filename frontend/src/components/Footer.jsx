// frontend/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 text-center mt-auto">
      <p>Copyright &copy; {new Date().getFullYear()} Quốc Hưng Shop. All rights reserved.</p>
    </footer>
  );
};

export default Footer;