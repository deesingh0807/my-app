import React, { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';

export default function HistoryReports() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(console.error);
  }, []);

  const downloadCSV = () => {
    const headers = ['Date', 'Customers', 'Prepared', 'Wasted', 'Weather', 'Event'];
    const csvRows = [headers.join(',')];
    records.forEach(r => {
      csvRows.push([r.date, r.total_customers, r.meals_prepared, r.meals_wasted, r.weather_condition, r.event_flag ? 'Yes' : 'No'].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planeat_history.csv';
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>History & Reports</h1>
          <p>Review past operational data and export performance logs.</p>
        </div>
        <button className="glass-button" onClick={downloadCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
          <Download size={18} /> Export CSV
        </button>
      </header>
      
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Customers</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Prepared</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Wasted</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Weather</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{record.date} {record.event_flag ? <span style={{ color: 'var(--brand-primary)', marginLeft: '10px', fontSize: '12px' }}>Event</span> : ''}</td>
                <td style={{ padding: '1rem' }}>{record.total_customers}</td>
                <td style={{ padding: '1rem' }}>{record.meals_prepared}</td>
                <td style={{ padding: '1rem', color: record.meals_wasted > 15 ? 'var(--brand-waste)' : 'inherit' }}>
                  {record.meals_wasted}
                </td>
                <td style={{ padding: '1rem' }}>{record.weather_condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
            <p>No historical records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
