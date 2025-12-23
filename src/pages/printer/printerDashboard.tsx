import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DashboardOverview from './DashboardOverview';
import PendingJobs from './PendingJobs';
import CompletedJobs from './CompletedJobs';
import RejectedJobs from './RejectedJobs';

const PrinterDashboard = () => {
  return (
    <DashboardLayout>
      {({ activeTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardOverview />;
          case 'pending-jobs':
            return <PendingJobs />;
          case 'completed-jobs':
            return <CompletedJobs />;
          case 'rejected-jobs':
            return <RejectedJobs />;
          default:
            return <DashboardOverview />;
        }
      }}
    </DashboardLayout>
  );
};

export default PrinterDashboard;
