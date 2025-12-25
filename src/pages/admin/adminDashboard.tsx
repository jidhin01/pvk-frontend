import React from 'react';
import {
  Palette,
  Printer,
  Briefcase,
  Coins,
  Package,
  IdCard,
  Stamp,
  Store,
  User
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';

// Import all admin page components
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import DealerApprovals from './DealerApprovals';
import FinanceOverview from './FinanceOverview';
import AdminSettings from './adminSettings';
import AdminActivityLogs from './adminActivityLogs';
import RoleManagement from './RoleManagement';
import PartnersManagement from './PartnersManagement';
import DesignerManagement from './DesignerManagement';
import SealTeamManagement from './SealTeamManagement';
import SalesManagement from './SalesManagement';
import InventoryModule from './inventory/InventoryModule';


export default function AdminDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <DashboardLayout>
      {({ selectedRole, activeTab }) => {
        // Render content based on active tab
        switch (activeTab) {
          case 'dashboard':
            return <AdminOverview />;

          case 'users':
            return <UserManagement />;

          case 'dealer-approvals':
            return <DealerApprovals />;

          // Role Management Pages
          case 'manage-designer':
            return <DesignerManagement />;

          case 'manage-printer':
            return (
              <RoleManagement
                roleId="printer"
                roleName="Printer"
                roleIcon={<Printer className="h-6 w-6 text-primary" />}
              />
            );

          case 'manage-sales':
            return <SalesManagement />;

          case 'manage-finance':
            // Show comprehensive Finance Management for admin
            if (isAdmin) {
              return <FinanceOverview />;
            }
            return <AdminOverview />;

          case 'manage-stock':
            return <InventoryModule />;

          case 'manage-pancard':
            return (
              <RoleManagement
                roleId="pancard"
                roleName="PAN Card Team"
                roleIcon={<IdCard className="h-6 w-6 text-primary" />}
              />
            );

          case 'manage-seal':
            return <SealTeamManagement />;

          case 'manage-partners':
            return <PartnersManagement />;

          case 'finance-overview':
            // Only show finance for admin
            if (isAdmin) {
              return <FinanceOverview />;
            }
            return <AdminOverview />;

          case 'settings':
            return <AdminSettings />;

          case 'activity-logs':
            // Only show for admin
            if (isAdmin) {
              return <AdminActivityLogs />;
            }
            return <AdminOverview />;

          default:
            return <AdminOverview />;
        }
      }}
    </DashboardLayout>
  );
}
