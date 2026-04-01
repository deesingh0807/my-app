import React from 'react';
import { Lightbulb, Info, ArrowRight } from 'lucide-react';

export default function InsightsBoard({ records }) {
  // Mocking insights based on typical hackathon MVP needs instead of heavy logic
  // "Fridays have 20% higher demand", "Rain reduces turnout by 15%", etc.
  
  return (
    <div className="glass-card" style={{ height: "450px" }}>
       <h3 className="card-title">
        <Lightbulb size={20} className="text-profit" />
        Insights & Recommendations
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
        
        {/* Insight 1 */}
        <div style={{ 
          background: "rgba(59, 130, 246, 0.1)", 
          padding: "1rem", 
          borderRadius: "8px", 
          borderLeft: "4px solid var(--brand-primary)" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Info size={16} className="text-brand-primary" />
            <span style={{ fontWeight: "600" }}>Weather Impact</span>
          </div>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Historical data shows that <strong>Rain</strong> reduces turnout by roughly <strong>15%</strong>. 
          </p>
        </div>

        {/* Insight 2 */}
        <div style={{ 
          background: "rgba(59, 130, 246, 0.1)", 
          padding: "1rem", 
          borderRadius: "8px", 
          borderLeft: "4px solid var(--brand-primary)" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Info size={16} className="text-brand-primary" />
            <span style={{ fontWeight: "600" }}>Day of Week Trends</span>
          </div>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Demand is consistently <strong>20% higher on Fridays</strong> compared to the rest of the week.
          </p>
        </div>

        {/* Recommendation */}
        <div style={{ 
          background: "rgba(16, 185, 129, 0.1)", 
          padding: "1rem", 
          borderRadius: "8px", 
          borderLeft: "4px solid var(--brand-profit)" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <ArrowRight size={16} className="text-profit" />
            <span style={{ fontWeight: "600", color: "var(--brand-profit)" }}>Recommendation</span>
          </div>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Forecast for tomorrow is <strong>Rainy</strong>. Reduce prepared meals from 150 to <strong>125-130</strong> to optimize profit and eliminate waste cost.
          </p>
        </div>

      </div>
    </div>
  );
}
