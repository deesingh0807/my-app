import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle } from 'lucide-react';

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      const url = user.role === 'customer' 
        ? `http://localhost:3001/api/orders?customerId=${user.id}`
        : `http://localhost:3001/api/orders?ownerId=${user.id}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:3001/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    // Optimistic update
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusIcon = (status) => {
    if (status === 'Delivered') return <CheckCircle size={18} color="#10b981" />;
    if (status === 'Dropping') return <Package size={18} color="#3b82f6" />;
    return <Clock size={18} color="#f59e0b" />;
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'All') return true;
    return o.status === filter;
  });

  return (
    <div className="flex-col" style={{ gap: '1rem', paddingBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem' }}>
        {user.role === 'customer' ? 'Your Orders' : 'Incoming Orders'}
      </h2>
      
      {/* Filters */}
      <div className="flex-row" style={{ gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', flexWrap: 'nowrap' }}>
        {['All', 'Picking Up', 'Dropping', 'Delivered'].map(f => (
          <button 
            key={f} 
            className={`btn-secondary ${filter === f ? 'active' : ''}`}
            style={{ 
              margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap',
              background: filter === f ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)' 
            }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && <p className="text-secondary">No orders found.</p>}

      {filteredOrders.map(order => (
        <div key={order.id} className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
            <div className="flex-row" style={{ gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                <Package size={20} />
              </div>
              <div>
                <div className="chat-name">
                  {user.role === 'customer' ? order.store_name : order.customer_name}
                </div>
                <div className="chat-time" style={{ marginTop: '0.1rem' }}>
                  {new Date(order.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: '600' }}>₹{order.total.toFixed(2)}</div>
          </div>
          
          <div style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', margin: '0.5rem 0' }}>
            <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{order.items}</div>
          </div>

          <div className="flex-row justify-between" style={{ marginTop: '1rem', alignItems: 'center' }}>
            <div className="flex-row" style={{ gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              {getStatusIcon(order.status)}
              <span className={order.status === 'Delivered' ? 'text-profit' : order.status === 'Dropping' ? 'text-main' : 'text-warning'} style={{ color: order.status === 'Dropping' ? '#3b82f6' : undefined }}>
                {order.status}
              </span>
            </div>
            
            {user.role === 'owner' && (
              <select 
                className="custom-input" 
                style={{ width: 'auto', padding: '0.4rem 0.5rem', fontSize: '0.8rem', background: 'var(--bg-surface)' }}
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="Picking Up">Picking Up</option>
                <option value="Dropping">Dropping</option>
                <option value="Delivered">Delivered</option>
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
