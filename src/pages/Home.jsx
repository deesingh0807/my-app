import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CloudRain, TrendingUp, TrendingDown, Store, Star, Tag, Award } from 'lucide-react';

function Home() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user.role === 'customer') {
      fetch('http://localhost:3001/api/stores')
        .then(res => res.json())
        .then(resData => setData(resData));
    } else {
      fetch(`http://localhost:3001/api/stats/${user.id}`)
        .then(res => res.json())
        .then(resData => setData(resData));
    }
  }, [user]);

  if (user.role === 'customer') {
    return (
      <div className="flex-col" style={{ gap: '1.5rem' }}>
        {/* Context Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.4), rgba(17,24,39,0.8))' }}>
          <div className="flex-row justify-between mb-2">
            <h3 className="card-title"><CloudRain size={20} color="#60a5fa" /> Rainy Day Offers</h3>
            <span className="badge badge-primary">Active</span>
          </div>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            It's pouring outside! Grab hot meals with up to 30% discount nearby.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Nearby Stores</h2>
          <div className="flex-col">
            {data && data.map(store => (
              <div key={store.id} className="glass-card flex-col" style={{ gap: '0.75rem', padding: '1rem' }}>
                <div className="flex-row justify-between">
                  <div className="flex-row">
                    <img src={store.owner_avatar} alt="store" className="avatar" />
                    <div>
                      <div className="chat-name">{store.name}</div>
                      <div className="chat-time">{store.category}</div>
                    </div>
                  </div>
                  {store.crowd_level === 'High' ? (
                    <span className="badge badge-danger">High Crowd</span>
                  ) : store.crowd_level === 'Medium' ? (
                    <span className="badge badge-warning">Medium Crowd</span>
                  ) : (
                    <span className="badge badge-success">Low Crowd</span>
                  )}
                </div>
                
                <div className="flex-row" style={{ gap: '1rem', marginTop: '0.5rem' }}>
                  {store.discount && (
                    <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Tag size={14} color="#10b981" /> {store.discount}
                    </span>
                  )}
                  {store.event && (
                    <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Award size={14} color="#f59e0b" /> {store.event}
                    </span>
                  )}
                </div>
                {store.highlights && (
                  <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: '600' }}>Highlights:</span> {store.highlights}
                  </div>
                )}
              </div>
            ))}
            {!data && <p className="text-secondary">Loading stores...</p>}
          </div>
        </div>
      </div>
    );
  }

  // Owner View
  // Owner View
  const [tfProfit, setTfProfit] = useState('30');
  const [tfSaved, setTfSaved] = useState('30');
  const [tfWaste, setTfWaste] = useState('30');
  const [tfPlates, setTfPlates] = useState('30');

  const [activeModal, setActiveModal] = useState(null);
  
  // Quick Action States
  const [discountValue, setDiscountValue] = useState('20% off at closing');
  const [highlightValue, setHighlightValue] = useState('Vegan Wraps');
  const [eventValue, setEventValue] = useState('Holiday Special');
  
  // Derived data based on timeframe mock
  const dataMap = {
    '7': { value: '+8.4%', absolute: '₹12,450', saved: '₹650', waste: '74%', plates: 15 },
    '14': { value: '+12.1%', absolute: '₹24,100', saved: '₹1,200', waste: '78%', plates: 25 },
    '30': { value: '+18.2%', absolute: '₹55,000', saved: '₹2,450', waste: '83%', plates: 35 },
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    setActiveModal(null);
    alert('Action saved successfully! (Simulated)');
  };

  return (
    <div className="flex-col" style={{ gap: '1.5rem', paddingBottom: '2rem' }}>
      <div className="grid-2" style={{ gap: '0.75rem' }}>
        <div className="glass-card" style={{ padding: '1rem', borderTop: '3px solid #10b981' }}>
          <div className="flex-row justify-between mb-2">
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Profit Change</span>
            <TrendingUp size={14} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{dataMap[tfProfit].value}</div>
          <select 
            className="custom-input mt-2" 
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'transparent' }}
            value={tfProfit}
            onChange={(e) => setTfProfit(e.target.value)}
          >
            <option value="7">Over 7 days</option>
            <option value="14">Over 14 days</option>
            <option value="30">Over 30 days</option>
          </select>
        </div>

        <div className="glass-card" style={{ padding: '1rem', borderTop: '3px solid #3b82f6' }}>
          <div className="flex-row justify-between mb-2">
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Money Saved</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{dataMap[tfSaved].saved}</div>
          <select 
            className="custom-input mt-2" 
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'transparent' }}
            value={tfSaved}
            onChange={(e) => setTfSaved(e.target.value)}
          >
            <option value="7">Over 7 days</option>
            <option value="14">Over 14 days</option>
            <option value="30">Over 30 days</option>
          </select>
        </div>

        <div className="glass-card" style={{ padding: '1rem', borderTop: '3px solid #10b981' }}>
          <div className="flex-row justify-between mb-2">
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Waste Reduction</span>
            <TrendingDown size={14} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{dataMap[tfWaste].waste}</div>
          <select 
            className="custom-input mt-2" 
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'transparent' }}
            value={tfWaste}
            onChange={(e) => setTfWaste(e.target.value)}
          >
            <option value="7">Over 7 days</option>
            <option value="14">Over 14 days</option>
            <option value="30">Over 30 days</option>
          </select>
        </div>

        <div className="glass-card" style={{ padding: '1rem', borderTop: '3px solid #6366f1' }}>
          <div className="flex-row justify-between mb-2">
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Plates Saved</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{dataMap[tfPlates].plates}</div>
          <select 
            className="custom-input mt-2" 
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'transparent' }}
            value={tfPlates}
            onChange={(e) => setTfPlates(e.target.value)}
          >
            <option value="7">Over 7 days</option>
            <option value="14">Over 14 days</option>
            <option value="30">Over 30 days</option>
          </select>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Impact Breakdown</h3>
        <div className="impact-breakdown">
          <div className="impact-side previous">
            <div style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.5rem', fontWeight: 600 }}>Previous System</div>
            <div className="impact-row"><span>Meals Prepared (Static)</span><span>150</span></div>
            <div className="impact-row"><span>Meals Wasted</span><span style={{ color: '#ef4444' }}>30</span></div>
            <div className="impact-total"><span>Daily Loss</span><span style={{ color: '#ef4444' }}>₹1200</span></div>
          </div>
          
          <div className="impact-side planeat">
            <div style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>With Planeat</div>
            <div className="impact-row"><span>Meals Prepared (Predicted)</span><span>130</span></div>
            <div className="impact-row"><span>Meals Wasted</span><span style={{ color: '#10b981' }}>5</span></div>
            <div className="impact-total"><span>Daily Loss</span><span style={{ color: '#10b981' }}>₹200</span></div>
          </div>
        </div>
      </div>

      <div className="glass-card" id="analytics-section">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div className="grid-2" style={{ gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ margin: 0, padding: '0.75rem' }} onClick={() => setActiveModal('discount')}>Set Discount</button>
          <button className="btn-secondary" style={{ margin: 0, padding: '0.75rem' }} onClick={() => setActiveModal('menu')}>Update Menu</button>
          <button className="btn-secondary" style={{ margin: 0, padding: '0.75rem' }} onClick={() => setActiveModal('event')}>Log Event</button>
          <button className="btn-secondary" style={{ margin: 0, padding: '0.75rem' }} onClick={() => {
            alert('Analytics engine running! All data is currently optimized.');
          }}>Analytics</button>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="card-title">{activeModal === 'discount' ? 'Set Discount' : activeModal === 'menu' ? 'Update Menu' : 'Log Special Event'}</h3>
            <form className="flex-col" style={{ gap: '1rem' }} onSubmit={handleActionSubmit}>
              {activeModal === 'discount' && (
                <>
                  <label className="text-secondary" style={{ fontSize: '0.85rem' }}>Current Offer Details</label>
                  <input type="text" className="custom-input" value={discountValue} onChange={e => setDiscountValue(e.target.value)} />
                </>
              )}
              {activeModal === 'menu' && (
                <>
                  <label className="text-secondary" style={{ fontSize: '0.85rem' }}>Menu Highlights</label>
                  <input type="text" className="custom-input" value={highlightValue} onChange={e => setHighlightValue(e.target.value)} />
                </>
              )}
              {activeModal === 'event' && (
                <>
                  <label className="text-secondary" style={{ fontSize: '0.85rem' }}>Event/Weather Tag</label>
                  <select className="custom-input" value={eventValue} onChange={e => setEventValue(e.target.value)}>
                    <option value="Holiday Special">Holiday Special</option>
                    <option value="Exam Week">Exam Week</option>
                    <option value="Rainy Day">Rainy Day</option>
                  </select>
                </>
              )}
              <div className="flex-row" style={{ marginTop: '1rem', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
