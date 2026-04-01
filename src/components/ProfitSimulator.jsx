import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function ProfitSimulator() {
  const [predicted, setPredicted] = useState(150);
  const [prepared, setPrepared] = useState(150);
  const [results, setResults] = useState(null);

  // Auto calculate
  useEffect(() => {
    // In a real app we'd debounce this call to API, 
    // but we can compute it inline or call the instant endpoint
    calculateSimulation(predicted, prepared);
  }, [predicted, prepared]);

  const calculateSimulation = async (pred, prep) => {
    try {
      const res = await fetch('http://localhost:3001/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictedCustomers: parseInt(pred, 10), mealsPrepared: parseInt(prep, 10) })
      });
      if (res.ok) {
        setResults(await res.json());
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ height: "450px" }}>
      <h3 className="card-title">
        <Settings size={20} className="text-muted" />
        Profit Simulator
      </h3>
      <p className="text-muted" style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Adjust variables to see the real-time financial impact of prediction vs preparation.
      </p>
      
      <div className="input-group">
        <label>Predicted Demand (Customers)</label>
        <input 
          type="range" 
          min="50" max="300" 
          value={predicted}
          onChange={(e) => setPredicted(e.target.value)}
          style={{ cursor: "pointer", accentColor: "var(--brand-primary)" }}
        />
        <div style={{ textAlign: "right", fontWeight: "bold" }}>{predicted}</div>
      </div>

      <div className="input-group" style={{ marginBottom: "1.5rem" }}>
        <label>Meals Prepared (Kitchen Output)</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            type="number"
            className="glass-input"
            value={prepared}
            onChange={(e) => setPrepared(e.target.value)}
            min="0"
          />
        </div>
      </div>

      {results && (
        <div style={{ 
            background: "rgba(0,0,0,0.3)", 
            padding: "1rem", 
            borderRadius: "12px",
            border: "1px solid var(--border-light)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Net Profit
            </span>
            <span style={{ fontWeight: "700", color: results.netProfit > 0 ? "var(--brand-profit)" : "var(--brand-waste)" }}>
              ₹{results.netProfit}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
             <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="text-muted">
               <AlertTriangle size={14} color="var(--brand-waste)" /> Waste Cost
             </span>
             <span>₹{results.wasteCost}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
             <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="text-muted">
               <AlertCircle size={14} color="#f59e0b" /> Lost Revenue
             </span>
             <span>₹{results.lostRevenue}</span>
          </div>
        </div>
      )}
    </div>
  );
}
