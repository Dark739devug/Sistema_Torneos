'use client';
import Sidebar from '@/components/Sidebar';
import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', marginTop: '30px' }}>
      <Sidebar /> 

      <div style={{ flex: 1, padding: '2rem', background: '#f4f4f4' }}>
        <h1>Bienvenido al Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;

