import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DashboardOverview from './DashboardOverview';
import DeliveryList from './DeliveryList';
import PaymentCollection from './PaymentCollection';
import DailyOperations from './DailyOperations';

const SalesDashboard = () => {
  return (
    <DashboardLayout>
      {({ activeTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardOverview />;
          case 'delivery-list':
            return <DeliveryList />;
          case 'payment-collection':
            return <PaymentCollection />;
          case 'daily-operations':
            return <DailyOperations />;
          default:
            return <DashboardOverview />;
        }
      }}
    </DashboardLayout>
  );
};

export default SalesDashboard;
