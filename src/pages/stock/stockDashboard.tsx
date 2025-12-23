import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DashboardOverview from './DashboardOverview';
import Inventory from './Inventory';
import DeadStock from './DeadStock';
import Alerts from './Alerts';

const StockDashboard = () => {
  return (
    <DashboardLayout>
      {({ activeTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardOverview />;
          case 'inventory':
            return <Inventory />;
          case 'dead-stock':
            return <DeadStock />;
          case 'alerts':
            return <Alerts />;
          default:
            return <DashboardOverview />;
        }
      }}
    </DashboardLayout>
  );
};

export default StockDashboard;
