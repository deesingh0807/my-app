import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Star, TrendingUp, Settings, LogOut, Bell, Shield, CreditCard, ChevronRight } from 'lucide-react';

function Profile() {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex-col" style={{ gap: '1.5rem', paddingBottom: '2rem' }}>
      <div className="glass-card flex-col" style={{ alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
        <img 
          src={user.avatar_url} 
          alt="profile" 
          className="avatar" 
          style={{ width: '80px', height: '80px', marginBottom: '1rem', cursor: 'pointer', border: '2px solid var(--accent-primary)' }} 
          onClick={() => setShowSettings(true)}
        />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h2>
        <span className="badge badge-primary">{user.role}</span>
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.5rem', cursor: 'pointer' }} onClick={() => setShowSettings(true)}>
          Tap photo for Settings
        </div>
      </div>

      {user.role === 'customer' && (
        <>
          <h3 style={{ fontSize: '1.1rem' }}>Active Delivery</h3>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex-row justify-between mb-4">
              <div>
                <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Arriving in</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12 mins</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Distance</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>1.2 km</div>
              </div>
            </div>
            <div className="flex-row" style={{ gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SwiftSam" alt="agent" className="avatar" />
              <div style={{ flex: 1 }}>
                <div className="chat-name">Swift Sam</div>
                <div className="text-secondary flex-row" style={{ fontSize: '0.85rem' }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" /> 4.9 (124)
                </div>
              </div>
              <button className="btn-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                <Phone size={18} />
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem' }}>Your Impact</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Money Saved</div>
              <h3 style={{ color: '#10b981' }}>₹450</h3>
            </div>
            <div className="stat-card">
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Orders</div>
              <h3 style={{ color: '#3b82f6' }}>14</h3>
            </div>
          </div>
        </>
      )}

      {user.role === 'owner' && (
        <>
          <h3 style={{ fontSize: '1.1rem' }}>Business Impact</h3>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex-row justify-between mb-4">
              <div>
                <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Total Monthly Profit</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>₹15,400</div>
              </div>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <div className="flex-row justify-between pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Food Waste Reduced</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>142 kg</div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem' }}>Active Delivery Agents</h3>
          <div className="flex-col">
            <div className="glass-card flex-row" style={{ padding: '1rem' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SwiftSam" alt="agent" className="avatar" />
              <div style={{ flex: 1 }}>
                <div className="chat-name">Swift Sam</div>
                <div className="text-secondary flex-row" style={{ fontSize: '0.85rem' }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" /> 4.9 • Fast and safe
                </div>
              </div>
            </div>
            <div className="glass-card flex-row" style={{ padding: '1rem' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=FlashFiona" alt="agent" className="avatar" />
              <div style={{ flex: 1 }}>
                <div className="chat-name">Flash Fiona</div>
                <div className="text-secondary flex-row" style={{ fontSize: '0.85rem' }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" /> 4.7 • Always on time
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem 1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>User Settings</h2>
            
            <div className="flex-col" style={{ gap: '0.5rem' }}>
              <button className="btn-secondary flex-row justify-between" style={{ padding: '1rem', border: 'none', background: 'var(--bg-glass)' }}>
                <div className="flex-row"><Settings size={18} /> Account Details</div>
                <ChevronRight size={18} color="#a0a0a0" />
              </button>
              <button className="btn-secondary flex-row justify-between" style={{ padding: '1rem', border: 'none', background: 'var(--bg-glass)' }}>
                <div className="flex-row"><Bell size={18} /> Notifications</div>
                <ChevronRight size={18} color="#a0a0a0" />
              </button>
              <button className="btn-secondary flex-row justify-between" style={{ padding: '1rem', border: 'none', background: 'var(--bg-glass)' }}>
                <div className="flex-row"><Shield size={18} /> Privacy & Security</div>
                <ChevronRight size={18} color="#a0a0a0" />
              </button>
              {user.role === 'customer' && (
                <button className="btn-secondary flex-row justify-between" style={{ padding: '1rem', border: 'none', background: 'var(--bg-glass)' }}>
                  <div className="flex-row"><CreditCard size={18} /> Payment Methods</div>
                  <ChevronRight size={18} color="#a0a0a0" />
                </button>
              )}
              
              <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-subtle)' }}></div>

              <button className="btn-secondary flex-row justify-center" onClick={logout} style={{ padding: '1rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <div className="flex-row"><LogOut size={18} /> Log Out</div>
              </button>
              <button className="btn-secondary flex-row justify-center" onClick={() => setShowSettings(false)} style={{ padding: '1rem', border: 'none', background: 'transparent' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Profile;
