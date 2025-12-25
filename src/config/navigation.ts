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
  User,
  IdCard,
  Stamp,
  CheckCircle,
  AlertTriangle,
  Factory,
  FolderArchive,
  type LucideIcon
} from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

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
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'dealer-approvals', label: 'Dealer Approvals', icon: CheckSquare },
      // Role Management Sections
      { id: 'manage-designer', label: 'Designer', icon: Palette },
      { id: 'manage-printer', label: 'Printer', icon: PrinterIcon },
      { id: 'manage-sales', label: 'Sales / Line Staff', icon: Briefcase },
      { id: 'manage-finance', label: 'Finance', icon: Coins },
      { id: 'manage-stock', label: 'Stock Keeper', icon: Package },
      { id: 'manage-pancard', label: 'PAN Card Team', icon: IdCard },
      { id: 'manage-seal', label: 'Seal Team', icon: Stamp },
      { id: 'manage-partners', label: 'Partners & Pricing', icon: Store },
      // System
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'activity-logs', label: 'Activity Logs', icon: History },
    ],
  },
  {
    id: 'manager',
    label: 'Manager',
    icon: ClipboardList,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'dealer-approvals', label: 'Dealer Approvals', icon: CheckSquare },
      // Role Management Sections (No Finance for Manager)
      { id: 'manage-designer', label: 'Designer', icon: Palette },
      { id: 'manage-printer', label: 'Printer', icon: PrinterIcon },
      { id: 'manage-sales', label: 'Sales / Line Staff', icon: Briefcase },
      { id: 'manage-stock', label: 'Stock Keeper', icon: Package },
      { id: 'manage-pancard', label: 'PAN Card Team', icon: IdCard },
      { id: 'manage-seal', label: 'Seal Team', icon: Stamp },
      { id: 'manage-partners', label: 'Partners & Pricing', icon: Store },
      // System
      { id: 'settings', label: 'Settings', icon: Settings },
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
      { id: 'completed', label: 'Completed', icon: CheckCircle },
      { id: 'earnings', label: 'Earnings', icon: Coins },
    ],
  },
  {
    id: 'printer',
    label: 'Printer',
    icon: PrinterIcon,
    tabs: [
      { id: 'dashboard', label: 'Job Queue', icon: PrinterIcon },
      { id: 'history', label: 'Completed History', icon: CheckCircle },
      { id: 'rejected', label: 'Rejected Log', icon: AlertTriangle },
    ],
  },
  {
    id: 'dealer',
    label: 'Dealer',
    icon: Store,
    tabs: [
      { id: 'dashboard', label: 'Marketplace', icon: Store },
      { id: 'orders', label: 'My Orders', icon: ShoppingCart },
      { id: 'new-order', label: 'New Order', icon: Upload },
      { id: 'new-pan-card', label: 'New PAN Card', icon: CreditCard },
      { id: 'new-rubber-seal', label: 'Rubber Seal', icon: Stamp },
      { id: 'profile', label: 'Profile', icon: Users },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: User,
    tabs: [
      { id: 'dashboard', label: 'Shop', icon: Store },
      { id: 'orders', label: 'My Orders', icon: ShoppingCart },
      { id: 'new-order', label: 'New Order', icon: Upload },
      { id: 'new-pan-card', label: 'New PAN Card', icon: CreditCard },
      { id: 'new-rubber-seal', label: 'Rubber Seal', icon: Stamp },
      { id: 'profile', label: 'Profile', icon: Users },
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
      { id: 'purchase', label: 'Purchase Indents', icon: ShoppingCart },
    ],
  },
  {
    id: 'pan_card_team',
    label: 'PAN Card Team',
    icon: IdCard,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'normal-pan', label: 'Normal PAN', icon: FileText },
      { id: 'emergency-pan', label: 'Emergency PAN', icon: AlertCircle },
      { id: 'send-to-print', label: 'Send to Print', icon: PrinterIcon },
    ],
  },
  {
    id: 'seal_team',
    label: 'Seal Team',
    icon: Stamp,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'floor', label: 'Work Floor', icon: Factory },
      { id: 'materials', label: 'Materials', icon: Package },
      { id: 'archives', label: 'Archives', icon: FolderArchive },
      { id: 'earnings', label: 'Earnings', icon: Coins },
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
    case 'customer':
      return '/marketplace';
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
    case 'pan_card_team':
      return '/pancard';
    case 'seal_team':
      return '/seal';
    default:
      return '/dashboard';
  }
}
