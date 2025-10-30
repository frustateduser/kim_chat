import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer border-t border-purple-500 bg-gradient-to-l from-purple-500 to-white p-4 flex items-center justify-center w-full shadow-md z-20 fixed bottom-0 left-0">
      <div className="text-purple-700 font-medium text-xs sm:text-base text-right">
        <span className="hidden sm:inline">
          © {currentYear} KIM Chat — Secure and Fast Messaging.
        </span>
        <span className="sm:hidden">© {currentYear} KIM Chat</span>
      </div>
    </footer>
  );
}

export default Footer;
