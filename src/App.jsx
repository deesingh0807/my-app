import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import HistoryReports from './pages/HistoryReports';
import DemandTracking from './pages/DemandTracking';
import MessagesAlerts from './pages/MessagesAlerts';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Navbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<HistoryReports />} />
              <Route path="/tracking" element={<DemandTracking />} />
              <Route path="/messages" element={<MessagesAlerts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;