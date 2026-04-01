import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, TrendingUp, Bell, User, Settings, Plane } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/history', icon: <History size={20} />, label: 'History / Reports' },
    { to: '/tracking', icon: <TrendingUp size={20} />, label: 'Demand Tracking' },
    { to: '/messages', icon: <Bell size={20} />, label: 'Messages / Alerts' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Plane size={28} className="text-profit" />
        <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>Planeat</h2>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
        <p className="text-muted" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
          Planeat Pro v2.0
        </p>
      </div>
    </div>
  );
}
