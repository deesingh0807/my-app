import React, { useEffect, useState } from 'react';
import { Save, UserCircle } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', role: '', organization: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/user')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('http://localhost:3001/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
       <header className="header" style={{ marginBottom: "0" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>My Profile</h1>
          <p>Manage your identity and organization credentials.</p>
        </div>
      </header>

      <div className="glass-card" style={{ padding: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <UserCircle size={100} className="text-muted" />
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="glass-input" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <input 
              type="text" 
              className="glass-input" 
              value={profile.role} 
              onChange={e => setProfile({...profile, role: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label>Organization / Hospital Name</label>
            <input 
              type="text" 
              className="glass-input" 
              value={profile.organization} 
              onChange={e => setProfile({...profile, organization: e.target.value})}
              required 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span style={{ color: msg.includes('success') ? 'var(--brand-profit)' : 'var(--brand-waste)' }}>{msg}</span>
            <button type="submit" className="glass-button" disabled={saving} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
