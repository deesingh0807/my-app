import React, { useState } from 'react';
import { Database, PlusCircle } from 'lucide-react';

export default function DataEntry({ onInserted }) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [totalCustomers, setTotalCustomers] = useState(150);
  const [mealsPrepared, setMealsPrepared] = useState(160);
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [eventFlag, setEventFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          totalCustomers: parseInt(totalCustomers, 10),
          mealsPrepared: parseInt(mealsPrepared, 10),
          weatherCondition,
          eventFlag
        })
      });
      
      if (res.ok) {
        if (onInserted) onInserted();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ height: "450px", overflowY: "auto" }}>
      <h3 className="card-title">
        <Database size={20} className="text-muted" />
        Data Input (Manual Overide)
      </h3>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div className="input-group">
          <label>Date</label>
          <input 
            type="date" 
            className="glass-input" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            required 
          />
        </div>
        
        <div className="grid-2" style={{ marginBottom: "0", gap: "1rem" }}>
          <div className="input-group">
            <label>Actual Customers</label>
            <input 
              type="number" 
              className="glass-input" 
              value={totalCustomers} 
              onChange={e => setTotalCustomers(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Meals Prepared</label>
            <input 
              type="number" 
              className="glass-input" 
              value={mealsPrepared} 
              onChange={e => setMealsPrepared(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="input-group">
          <label>Weather Condition</label>
          <select 
            className="glass-input" 
            value={weatherCondition} 
            onChange={e => setWeatherCondition(e.target.value)}
          >
            <option value="Sunny">Sunny</option>
            <option value="Cloudy">Cloudy</option>
            <option value="Rainy">Rainy</option>
          </select>
        </div>

        <div className="input-group" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem", margin: "1rem 0" }}>
          <input 
            type="checkbox" 
            checked={eventFlag}
            onChange={e => setEventFlag(e.target.checked)}
            style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer", accentColor: "var(--brand-primary)" }}
          />
          <label style={{ margin: 0, cursor: "pointer" }}>Special Event Day?</label>
        </div>

        <button type="submit" className="glass-button" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          {loading ? "Saving..." : (
            <>
              <PlusCircle size={18} />
              Add Record
            </>
          )}
        </button>
      </form>
    </div>
  );
}
