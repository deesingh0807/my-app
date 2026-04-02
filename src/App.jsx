import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';

// 4 Core pages will be imported here
import Home from './pages/Home';
import Messages from './pages/Messages';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Auth />;
  }

  // Get Page Title based on route
  const getPageTitle = (path) => {
    if (path.includes('messages')) return 'Messages';
    if (path.includes('orders')) return 'Orders';
    if (path.includes('profile')) return 'Profile';
    return 'Home';
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="*" element={<TopBar title={getPageTitle(window.location.pathname)} />} />
        </Routes>
        
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;