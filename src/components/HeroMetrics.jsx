import React from 'react';
import { TrendingUp, Wallet, ArrowDown, Utensils } from 'lucide-react';

export default function HeroMetrics({ stats, records }) {
  // If we want to calculate this directly from records we could, 
  // but for the MVP 30s wow factor we rely on the passed stats object 
  // to ensure a clear "Before vs After" narrative initially.

  return (
    <section className="hero-metrics">
      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        {/* Profit Card */}
        <div className="glass-card" style={{ borderColor: "var(--brand-profit-glow)" }}>
          <h3 className="card-title">
            <TrendingUp size={20} className="text-profit" />
            Profit Change
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--brand-profit)" }}>
            {stats.profitChange}
          </div>
          <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            over last 30 days
          </p>
        </div>

        {/* Saved Card */}
        <div className="glass-card">
          <h3 className="card-title">
            <Wallet size={20} style={{ color: "var(--brand-primary)" }} />
            Money Saved
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "700" }}>
            {stats.moneySaved}
          </div>
          <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Today vs Average
          </p>
        </div>

        {/* Waste Reduction */}
        <div className="glass-card" style={{ borderColor: "var(--brand-profit-glow)" }}>
          <h3 className="card-title">
            <ArrowDown size={20} className="text-profit" />
            Waste Reduction
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--brand-profit)" }}>
            ↓ {stats.wasteReduction}
          </div>
          <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Compared to baseline
          </p>
        </div>

        {/* Plates Saved */}
        <div className="glass-card">
          <h3 className="card-title">
            <Utensils size={20} style={{ color: "var(--brand-primary)" }} />
            Plates Saved
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "700" }}>
            {stats.platesSaved}
          </div>
          <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Equivalent meals rescued
          </p>
        </div>
      </div>

      {/* Before vs After Summary */}
      <div className="glass-card">
        <h3 className="card-title" style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>
          Impact Breakdown
        </h3>
        
        <div className="grid-2">
          {/* Before */}
          <div style={{ padding: "1.5rem", background: "rgba(239, 68, 68, 0.05)", borderRadius: "12px", border: "1px solid var(--brand-waste-glow)" }}>
            <h4 style={{ color: "var(--brand-waste)", marginBottom: "1rem" }}>Previous System</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Meals Prepared (Static)</span>
                <span>{stats.before.prepared}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Meals Wasted</span>
                <span style={{ color: "var(--brand-waste)" }}>{stats.before.wasted}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.5rem" }}>
                <span>Daily Loss</span>
                <span style={{ color: "var(--brand-waste)" }}>₹{stats.before.loss}</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div style={{ padding: "1.5rem", background: "rgba(16, 185, 129, 0.05)", borderRadius: "12px", border: "1px solid var(--brand-profit-glow)" }}>
            <h4 style={{ color: "var(--brand-profit)", marginBottom: "1rem" }}>With Planeat</h4>
             <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Meals Prepared (Predicted)</span>
                <span>{stats.after.prepared}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Meals Wasted</span>
                <span style={{ color: "var(--brand-profit)" }}>{stats.after.wasted}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.5rem" }}>
                <span>Daily Loss</span>
                <span style={{ color: "var(--brand-profit)" }}>₹{stats.after.loss}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
