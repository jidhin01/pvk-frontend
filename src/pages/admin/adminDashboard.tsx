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
import DesignerManagement from './DesignerManagement';
import SealTeamManagement from './SealTeamManagement';
import SalesManagement from './SalesManagement';
import DealerCustomerManagement from './DealerCustomerManagement';
import InventoryModule from './inventory/InventoryModule';
import PrinterManager from './printer/PrinterManager';
import AdminPancardManager from './pancard/AdminPancardManager';
import OrdersManagement from './OrdersManagement';

// Import User Management Pages
import {
  ManagersPage,
  DesignersPage,
  PrintersPage,
  SalesStaffPage,
  StockKeepersPage,
  PanCardTeamPage,
  SealTeamPage,
  FinanceTeamPage,
  DealersPage,
  CustomersPage
} from './user-management';


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

          case 'orders':
            return <OrdersManagement />;

          case 'users':
            return <UserManagement />;

          // User Management by Role
          case 'users-managers':
            return <ManagersPage />;
          case 'users-designers':
            return <DesignersPage />;
          case 'users-printers':
            return <PrintersPage />;
          case 'users-sales':
            return <SalesStaffPage />;
          case 'users-stock':
            return <StockKeepersPage />;
          case 'users-pancard':
            return <PanCardTeamPage />;
          case 'users-seal':
            return <SealTeamPage />;
          case 'users-finance':
            return <FinanceTeamPage />;
          case 'users-dealer-customer':
            return <DealerCustomerManagement />;

          case 'dealer-approvals':
            return <DealerApprovals />;

          // Role Management Pages
          case 'manage-designer':
            return <DesignerManagement />;

          case 'manage-printer':
            return <PrinterManager />;

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
            return <AdminPancardManager />;

          case 'manage-seal':
            return <SealTeamManagement />;

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
