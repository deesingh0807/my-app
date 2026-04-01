import React, { useState, useEffect } from 'react';
import HeroMetrics from '../components/HeroMetrics';
import AnalyticsCharts from '../components/AnalyticsCharts';
import ProfitSimulator from '../components/ProfitSimulator';
import InsightsBoard from '../components/InsightsBoard';
import DataEntry from '../components/DataEntry';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    profitChange: "+18.2%",
    moneySaved: "₹2,450",
    wasteReduction: "83%",
    platesSaved: 35,
    before: { prepared: 150, wasted: 30, loss: 1200 },
    after: { prepared: 130, wasted: 5, loss: 200 }
  });

  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch records.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Executive Dashboard</h1>
          <p>Institutional Demand Forecasting & Waste Reduction</p>
        </div>
      </header>
      
      <HeroMetrics stats={dashboardStats} records={records} />
      <AnalyticsCharts records={records} />

      <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr 1fr", alignItems: "start" }}>
        <ProfitSimulator />
        <InsightsBoard records={records} />
        <DataEntry onInserted={fetchRecords} />
      </div>
    </div>
  );
}
