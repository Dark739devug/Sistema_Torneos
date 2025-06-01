'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './DashboardLayout.module.css'; 

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.dashboardContent}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
