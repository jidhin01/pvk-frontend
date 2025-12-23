import React from 'react';
import { ShoppingCart, Users, DollarSign, Clock } from 'lucide-react';
import { DashboardLayout, PageContainer } from '@/components/layout';
import { StatCard, ActivityList, QuickActions, DataTable, RevenueChart, ProductChart } from '@/components/dashboard';
import { getRoleConfig } from '@/config/navigation';
import DealerDashboard from '@/pages/dealer/DashboardDealer';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      {({ selectedRole, activeTab }) => {
        const roleConfig = getRoleConfig(selectedRole);
        const currentTab = roleConfig?.tabs.find(t => t.id === activeTab);

        if (selectedRole === 'dealer') {
          return (
            <PageContainer
              title={currentTab?.label || 'Dashboard'}
              subtitle={`${roleConfig?.label} Portal`}
            >
              <DealerDashboard />
            </PageContainer>
          );
        }

        return (
          <PageContainer
            title={currentTab?.label || 'Dashboard'}
            subtitle={`${roleConfig?.label} Module`}
          >
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Orders" value="1,284" change={12.5} icon={ShoppingCart} variant="primary" />
              <StatCard title="Revenue" value="₹4,52,000" change={8.2} icon={DollarSign} variant="success" />
              <StatCard title="Active Users" value="156" change={-2.4} icon={Users} variant="default" />
              <StatCard title="Pending" value="23" change={0} icon={Clock} variant="warning" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueChart />
              <ProductChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <DataTable />
              </div>
              <div className="space-y-4">
                <QuickActions />
                <ActivityList />
              </div>
            </div>
          </PageContainer>
        );
      }}
    </DashboardLayout>
  );
}
