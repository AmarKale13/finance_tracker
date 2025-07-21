// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register         from './pages/Register';
import Login            from './pages/Login';
import DashboardLayout  from './components/DashboardLayout';
import Dashboard        from './pages/Dashboard';
import Transactions     from './pages/Transactions';
import ReportsPage from './components/ReportsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login"    element={<Login />} />

      
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<ReportsPage />} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
