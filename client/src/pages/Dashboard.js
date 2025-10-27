import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardHome from '../components/dashboard/DashboardHome';
import Scraper from '../components/dashboard/Scraper';
import WooCommerceScraper from '../components/dashboard/WooCommerceScraper';
import Billing from '../components/dashboard/Billing';
import Settings from '../components/dashboard/Settings';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <DashboardHeader />
        <div className="dashboard-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/scraper" element={<Scraper />} />
            <Route path="/woocommerce-scraper" element={<WooCommerceScraper />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





