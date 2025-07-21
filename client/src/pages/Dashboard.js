// src/pages/Dashboard.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardLayout from '../components/DashboardLayout';
import '../components/DashboardLayout.css';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div>Welcome to your financial dashboard!</div>
    </DashboardLayout>
  );
}
