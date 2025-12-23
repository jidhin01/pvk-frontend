import {
  Crown,
  Shield,
  ClipboardList,
  Palette,
  Printer as PrinterIcon,
  Store,
  Briefcase,
  Coins,
  Package,
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  FileText,
  Activity,
  ShoppingCart,
  CreditCard,
  Upload,
  FolderOpen,
  Layers,
  Calendar,
  Receipt,
  BarChart3,
  BookOpen,
  AlertCircle,
  TrendingUp,
  History,
  Wallet,
  PlusCircle,
  MapPin,
  User
} from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { LucideIcon } from 'lucide-react';

export interface NavTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface RoleConfig {
  id: UserRole;
  label: string;
  icon: LucideIcon;
  tabs: NavTab[];
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: 'super_admin',
    label: 'Super Admin',
    icon: Crown,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'system-settings', label: 'System Settings', icon: Settings },
      { id: 'audit-logs', label: 'Audit Logs', icon: History },
      { id: 'all-users', label: 'All Users', icon: Users },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'approvals', label: 'Approvals', icon: CheckSquare },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    id: 'manager',
    label: 'Manager',
    icon: ClipboardList,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'team', label: 'Team', icon: Users },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    id: 'designer',
    label: 'Designer',
    icon: Palette,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'work-pool', label: 'Work Pool', icon: Layers },
      { id: 'my-work', label: 'My Work', icon: FolderOpen },
      { id: 'earnings', label: 'Earnings', icon: Coins },
    ],
  },
  {
    id: 'printer',
    label: 'Printer',
    icon: PrinterIcon,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'pending-jobs', label: 'Pending Jobs', icon: FileText },
      { id: 'completed-jobs', label: 'Completed Jobs', icon: CheckSquare },
      { id: 'rejected-jobs', label: 'Rejected Jobs', icon: AlertCircle },
    ],
  },
  {
    id: 'dealer',
    label: 'Dealer',
    icon: Store,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'new-order', label: 'New Order', icon: PlusCircle },
      { id: 'tracking', label: 'Tracking', icon: MapPin },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
  {
    id: 'sales',
    label: 'Sales / Line Staff',
    icon: Briefcase,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'delivery-list', label: 'Delivery List', icon: MapPin },
      { id: 'payment-collection', label: 'Payment', icon: CreditCard },
      { id: 'daily-operations', label: 'Operations', icon: ClipboardList },
      { id: 'expenses', label: 'Expenses', icon: Wallet },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Coins,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'designer-earnings', label: 'Designer Earnings', icon: Palette },
      { id: 'sales-revenue', label: 'Sales Revenue', icon: TrendingUp },
      { id: 'credit-cash', label: 'Credit & Cash', icon: CreditCard },
      { id: 'refunds', label: 'Refunds', icon: Receipt },
      { id: 'expenses', label: 'Expenses', icon: Wallet },
      { id: 'salary-reports', label: 'Salary Reports', icon: Users },
    ],
  },
  {
    id: 'stock_keeper',
    label: 'Stock Keeper',
    icon: Package,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'dead-stock', label: 'Dead Stock', icon: AlertCircle },
      { id: 'alerts', label: 'Alerts', icon: Activity },
    ],
  },
];

export function getRoleConfig(roleId: UserRole): RoleConfig | undefined {
  return ROLE_CONFIGS.find(config => config.id === roleId);
}

export function getRoleLabel(roleId: UserRole): string {
  return getRoleConfig(roleId)?.label || roleId;
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
    case 'manager':
      return '/admin';
    case 'dealer':
      return '/dealer';
    case 'designer':
      return '/designer';
    case 'finance':
      return '/finance';
    case 'printer':
      return '/printer';
    case 'sales':
      return '/sales';
    case 'stock_keeper':
      return '/stock';
    default:
      return '/dashboard';
  }
}
