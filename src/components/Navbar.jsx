import React, { useEffect, useState } from 'react';
import { Bell, UserCircle } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState({ name: 'Loading...' });

  useEffect(() => {
    fetch('http://localhost:3001/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  return (
    <div className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Quick Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={24} className="text-muted" />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: 'var(--brand-waste)',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-dark)'
          }}>
            1
          </span>
        </div>

        {/* User Identity View */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-light)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user?.name || 'User'}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{user?.role || 'Manager'}</div>
          </div>
          <UserCircle size={36} className="text-profit" />
        </div>

      </div>
    </div>
  );
}
