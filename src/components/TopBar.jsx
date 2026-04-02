import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function TopBar({ title }) {
  const { user } = useAuth();
  
  return (
    <div className="top-bar">
      <div className="top-bar-title">{title || 'Planeat'}</div>
      <div className="flex-row">
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        {user?.avatar_url && (
          <img src={user.avatar_url} alt="profile" className="avatar" style={{width: '36px', height: '36px'}} />
        )}
      </div>
    </div>
  );
}

export default TopBar;
