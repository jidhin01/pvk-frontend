import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DashboardOverview from './DashboardOverview';
import DesignerEarnings from './DesignerEarnings';
import SalesRevenue from './SalesRevenue';
import CreditCash from './CreditCash';
import Refunds from './Refunds';
import Expenses from './Expenses';
import SalaryReports from './SalaryReports';

const FinanceDashboard = () => {
  return (
    <DashboardLayout>
      {({ activeTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardOverview />;
          case 'designer-earnings':
            return <DesignerEarnings />;
          case 'sales-revenue':
            return <SalesRevenue />;
          case 'credit-cash':
            return <CreditCash />;
          case 'refunds':
            return <Refunds />;
          case 'expenses':
            return <Expenses />;
          case 'salary-reports':
            return <SalaryReports />;
          default:
            return <DashboardOverview />;
        }
      }}
    </DashboardLayout>
  );
};

export default FinanceDashboard;
