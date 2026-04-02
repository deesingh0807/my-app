import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, FileText, User } from 'lucide-react';

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/messages" className={`nav-item ${path === '/messages' ? 'active' : ''}`}>
        <MessageCircle size={24} />
        <span>Messages</span>
      </Link>
      <Link to="/orders" className={`nav-item ${path === '/orders' ? 'active' : ''}`}>
        <FileText size={24} />
        <span>Orders</span>
      </Link>
      <Link to="/profile" className={`nav-item ${path === '/profile' ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNav;
