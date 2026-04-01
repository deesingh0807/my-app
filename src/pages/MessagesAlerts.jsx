import React, { useEffect, useState } from 'react';
import { Mail, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export default function MessagesAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(console.error);
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle size={24} color="#f59e0b" />;
      case 'error': return <AlertCircle size={24} color="#ef4444" />;
      default: return <Info size={24} color="#3b82f6" />;
    }
  };

  const getColorTheme = (type) => {
    switch(type) {
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
      case 'error': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' };
      default: return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
       <header className="header">
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Messages & Alerts</h1>
          <p>System-generated notifications and threshold warnings.</p>
        </div>
      </header>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
             <Mail size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
             <p>All caught up! No recent alerts.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map(alert => {
              const theme = getColorTheme(alert.type);
              return (
                <div key={alert.id} style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  alignItems: 'center', 
                  padding: '1.5rem', 
                  background: theme.bg, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '12px' 
                }}>
                  <div>
                    {getIcon(alert.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{alert.message}</p>
                    <small className="text-muted">{alert.created_at}</small>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
