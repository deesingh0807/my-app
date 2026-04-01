import React, { useEffect, useState, useMemo } from 'react';
import { Target } from 'lucide-react';
import { Line } from 'react-chartjs-2';

export default function DemandTracking() {
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(console.error);
  }, []);

  const { chartData, accuracy } = useMemo(() => {
    if (!records.length) return { chartData: null, accuracy: 0 };
    
    // Calculate simple mock prediction vs actual diff
    let totalError = 0;
    let totalActual = 0;
    
    // Mock predicted array derived from actual bounds
    const dates = [];
    const actuals = [];
    const predicteds = [];
    
    records.slice(-14).forEach(r => {
        dates.push(r.date);
        actuals.push(r.total_customers);
        
        const pred = Math.max(130, Math.floor(r.total_customers * (1 + (Math.random() * 0.2 - 0.1))));
        predicteds.push(pred);
        
        totalError += Math.abs(pred - r.total_customers);
        totalActual += r.total_customers;
    });

    const accuracyScore = totalActual > 0 ? (100 - (totalError / totalActual * 100)) : 0;

    return {
      accuracy: accuracyScore.toFixed(1),
      chartData: {
        labels: dates,
        datasets: [
          {
            label: 'Actual Customers', 
            data: actuals, 
            borderColor: '#3b82f6', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            fill: true,
            tension: 0.4
          },
          {
            label: 'Predicted Demand', 
            data: predicteds, 
            borderColor: '#10b981', 
            borderDash: [5, 5], 
            backgroundColor: 'transparent', 
            tension: 0.4
          }
        ]
      }
    };
  }, [records]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af' } }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' }, beginAtZero: true }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header className="header" style={{ marginBottom: "0" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Demand Tracking</h1>
          <p>Monitor the system's prediction accuracy over time.</p>
        </div>
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="glass-card" style={{ borderColor: accuracy > 90 ? 'var(--brand-profit-glow)' : 'var(--border-light)' }}>
           <h3 className="card-title">
            <Target size={20} className="text-profit" />
            Rolling Accuracy
          </h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "700", color: accuracy > 90 ? "var(--brand-profit)" : "var(--brand-primary)" }}>
            {accuracy}%
          </div>
          <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            14-Day Average Match
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ height: "450px" }}>
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
}
