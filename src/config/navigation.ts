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
  History
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
      { id: 'projects', label: 'Projects', icon: FolderOpen },
      { id: 'uploads', label: 'Uploads', icon: Upload },
      { id: 'approvals', label: 'Approvals', icon: CheckSquare },
      { id: 'templates', label: 'Templates', icon: Layers },
    ],
  },
  {
    id: 'printer',
    label: 'Printer',
    icon: PrinterIcon,
    tabs: [
      { id: 'print-queue', label: 'Print Queue', icon: FileText },
      { id: 'completed', label: 'Completed', icon: CheckSquare },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    id: 'dealer',
    label: 'Dealer',
    icon: Store,
    tabs: [
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'pan', label: 'PAN', icon: CreditCard },
      { id: 'seals', label: 'Seals', icon: FileText },
      { id: 'status', label: 'Status', icon: Activity },
    ],
  },
  {
    id: 'sales',
    label: 'Sales / Line Staff',
    icon: Briefcase,
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'leads', label: 'Leads', icon: Users },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'targets', label: 'Targets', icon: TrendingUp },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Coins,
    tabs: [
      { id: 'invoices', label: 'Invoices', icon: Receipt },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'ledger', label: 'Ledger', icon: BookOpen },
    ],
  },
  {
    id: 'stock_keeper',
    label: 'Stock Keeper',
    icon: Package,
    tabs: [
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'movements', label: 'Movements', icon: Activity },
      { id: 'alerts', label: 'Alerts', icon: AlertCircle },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ],
  },
];

export function getRoleConfig(roleId: UserRole): RoleConfig | undefined {
  return ROLE_CONFIGS.find(config => config.id === roleId);
}

export function getRoleLabel(roleId: UserRole): string {
  return getRoleConfig(roleId)?.label || roleId;
}
