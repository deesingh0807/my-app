import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({ cost_per_meal: 0, price_per_meal: 0, waste_threshold: 0 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) setMsg('Settings configured. Dashboards will now use these values.');
    } catch (err) {
      setMsg('Failed to apply settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
       <header className="header" style={{ marginBottom: "0" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Financial Configuration</h1>
          <p>Update base values powering Planeat's impact predictions.</p>
        </div>
      </header>

      <div className="glass-card" style={{ padding: "2rem" }}>
        <h3 className="card-title" style={{ marginBottom: "2rem" }}>
            <SettingsIcon size={20} className="text-muted" />
            Global Parameters
        </h3>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="grid-2">
            <div className="input-group">
                <label>Cost Per Meal (₹)</label>
                <input 
                type="number" 
                className="glass-input" 
                value={settings.cost_per_meal} 
                onChange={e => setSettings({...settings, cost_per_meal: parseFloat(e.target.value)})}
                required 
                />
            </div>

            <div className="input-group">
                <label>Average Selling Price (₹)</label>
                <input 
                type="number" 
                className="glass-input" 
                value={settings.price_per_meal} 
                onChange={e => setSettings({...settings, price_per_meal: parseFloat(e.target.value)})}
                required 
                />
            </div>
          </div>

          <div className="input-group">
            <label>Daily Waste Alert Threshold (Plates)</label>
            <input 
              type="number" 
              className="glass-input" 
              value={settings.waste_threshold} 
              onChange={e => setSettings({...settings, waste_threshold: parseInt(e.target.value)})}
              required 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
            <span style={{ color: msg.includes('configured') ? 'var(--brand-profit)' : 'var(--brand-waste)' }}>{msg}</span>
            <button type="submit" className="glass-button" disabled={saving} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {saving ? 'Applying...' : 'Apply Changes'}
            </button>
          </div>
        </form>
      </div>

       <div className="glass-card" style={{ padding: "2rem", marginTop: "1rem" }}>
         <h4 className="text-muted" style={{ marginBottom: "1rem" }}>Advanced Configuration (Mock)</h4>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--brand-primary)' }} checked />
             <span>Enable Weather Live Sync API (Mock)</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--brand-primary)' }} checked />
             <span>Enable Institutional Event Calendar Integration (Mock)</span>
         </div>
       </div>

    </div>
  );
}
