
import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DesignerWorkPool from './designerWorkPool';
import DesignerMyWork from './designerMyWork';
import DesignerEarnings from './designerEarnings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DesignerDashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your daily overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Jobs in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Available to take</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹10</div>
            <p className="text-xs text-muted-foreground">2 designs completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Waiting for manager</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DesignerDashboard = () => {
  return (
    <DashboardLayout>
      {({ activeTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DesignerDashboardContent />;
          case 'work-pool':
            return <DesignerWorkPool />;
          case 'my-work':
            return <DesignerMyWork />;
          case 'earnings':
            return <DesignerEarnings />;
          default:
            return <DesignerDashboardContent />;
        }
      }}
    </DashboardLayout>
  );
};

export default DesignerDashboard;
