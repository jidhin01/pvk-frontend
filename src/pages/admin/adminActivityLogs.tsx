import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  User,
  Settings,
  Shield,
  ShoppingCart,
  CreditCard,
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  Activity,
  Palette,
  Printer as PrinterIcon,
  Truck,
  Package,
  Stamp,
  Wallet,
  Store,
  UserCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  Calendar,
  ExternalLink,
  Monitor,
  Smartphone,
  Globe,
  Bell,
  ThumbsUp,
  ThumbsDown,
  LayoutGrid,
  List,
  Info,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

// Role icons mapping
const ROLE_ICONS: Record<string, any> = {
  admin: Shield,
  manager: Shield,
  designer: Palette,
  printer: PrinterIcon,
  sales: Truck,
  pan_card_team: CreditCard,
  seal_team: Stamp,
  finance: Wallet,
  stock_keeper: Package,
  dealer: Store,
  customer: UserCircle
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  manager: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  designer: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  printer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sales: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pan_card_team: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  seal_team: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  finance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  stock_keeper: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  dealer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  customer: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  designer: 'Designer',
  printer: 'Printer',
  sales: 'Sales / Line Staff',
  pan_card_team: 'PAN Card Team',
  seal_team: 'Seal Team',
  finance: 'Finance',
  stock_keeper: 'Stock Keeper',
  dealer: 'Dealer',
  customer: 'Customer'
};

// Activity category types
type ActivityCategory = 'all' | 'users' | 'orders' | 'approvals' | 'finance' | 'system';

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  category: ActivityCategory;
  type: string;
  icon: any;
  timestamp: string;
  timeAgo: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  metadata?: {
    ipAddress?: string;
    device?: string;
    browser?: string;
    location?: string;
    oldValue?: string;
    newValue?: string;
    amount?: number;
    reason?: string;
    relatedOrder?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

// Comprehensive mock activity log data covering all roles and workflows
const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  // User Actions
  {
    id: 'ACT-001',
    action: 'User Login',
    description: 'Successfully logged in from new device',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'users',
    type: 'auth',
    icon: LogIn,
    timestamp: '2024-12-25 21:15:00',
    timeAgo: '5 min ago',
    status: 'success',
    metadata: { ipAddress: '192.168.1.101', device: 'Windows Desktop', browser: 'Chrome 120', location: 'Mumbai, India' }
  },
  {
    id: 'ACT-002',
    action: 'New User Created',
    description: 'Created new designer account',
    user: { name: 'Vikram Manager', email: 'vikram@pvk.com', role: 'manager' },
    category: 'users',
    type: 'user_create',
    icon: UserPlus,
    timestamp: '2024-12-25 21:10:00',
    timeAgo: '10 min ago',
    entityType: 'User',
    entityId: 'USR-045',
    entityName: 'Priya Designer',
    status: 'success',
    metadata: { newValue: 'Normal Designer, Production team' }
  },
  {
    id: 'ACT-003',
    action: 'User Role Updated',
    description: 'Changed user role from Customer to Dealer',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'users',
    type: 'user_update',
    icon: Edit,
    timestamp: '2024-12-25 20:50:00',
    timeAgo: '30 min ago',
    entityType: 'User',
    entityId: 'USR-032',
    entityName: 'ABC Prints',
    status: 'info',
    metadata: { oldValue: 'Customer', newValue: 'Dealer', reason: 'Business verification completed' }
  },
  {
    id: 'ACT-004',
    action: 'User Deactivated',
    description: 'Account deactivated due to inactivity',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'users',
    type: 'user_deactivate',
    icon: UserCircle,
    timestamp: '2024-12-25 20:30:00',
    timeAgo: '50 min ago',
    entityType: 'User',
    entityId: 'USR-018',
    entityName: 'Old Designer',
    status: 'warning',
    metadata: { reason: '90 days of inactivity' }
  },
  {
    id: 'ACT-005',
    action: 'User Logout',
    description: 'Logged out',
    user: { name: 'Suresh Stock Keeper', email: 'suresh@pvk.com', role: 'stock_keeper' },
    category: 'users',
    type: 'auth',
    icon: LogOut,
    timestamp: '2024-12-25 20:00:00',
    timeAgo: '1 hour ago',
    status: 'success',
    metadata: { device: 'Android Mobile', browser: 'Chrome Mobile' }
  },

  // Order & Workflow Activities
  {
    id: 'ACT-006',
    action: 'New Order Placed',
    description: 'Business Cards - 1000 pcs, PVC Printing',
    user: { name: 'ABC Prints & Graphics', email: 'abc@prints.com', role: 'dealer' },
    category: 'orders',
    type: 'order_placed',
    icon: ShoppingCart,
    timestamp: '2024-12-25 21:05:00',
    timeAgo: '15 min ago',
    entityType: 'Order',
    entityId: 'ORD-2024-156',
    entityName: 'Business Cards Order',
    status: 'success',
    priority: 'high',
    metadata: { amount: 2500 }
  },
  {
    id: 'ACT-007',
    action: 'Design Job Taken',
    description: 'Picked up design job from work pool',
    user: { name: 'Anu Designer', email: 'anu@pvk.com', role: 'designer' },
    category: 'orders',
    type: 'design_assigned',
    icon: Palette,
    timestamp: '2024-12-25 21:00:00',
    timeAgo: '20 min ago',
    entityType: 'Order',
    entityId: 'ORD-2024-155',
    entityName: 'Brochure Design',
    status: 'info'
  },
  {
    id: 'ACT-008',
    action: 'Design Completed',
    description: 'Design approved and sent to printer',
    user: { name: 'Ravi Designer', email: 'ravi@pvk.com', role: 'designer' },
    category: 'orders',
    type: 'design_completed',
    icon: CheckCircle,
    timestamp: '2024-12-25 20:45:00',
    timeAgo: '35 min ago',
    entityType: 'Order',
    entityId: 'ORD-2024-152',
    entityName: 'Company Letterhead',
    status: 'success',
    metadata: { relatedOrder: 'Print batch #78 ready' }
  },
  {
    id: 'ACT-009',
    action: 'Printing Started',
    description: 'Started printing batch for laser digital',
    user: { name: 'Priya Printer', email: 'priya.printer@pvk.com', role: 'printer' },
    category: 'orders',
    type: 'printing_started',
    icon: PrinterIcon,
    timestamp: '2024-12-25 20:30:00',
    timeAgo: '50 min ago',
    entityType: 'Batch',
    entityId: 'BATCH-078',
    entityName: '5 items batch',
    status: 'info'
  },
  {
    id: 'ACT-010',
    action: 'Printing Completed',
    description: 'All items printed successfully',
    user: { name: 'Priya Printer', email: 'priya.printer@pvk.com', role: 'printer' },
    category: 'orders',
    type: 'printing_completed',
    icon: CheckCircle,
    timestamp: '2024-12-25 20:15:00',
    timeAgo: '1 hour ago',
    entityType: 'Batch',
    entityId: 'BATCH-077',
    entityName: '8 items batch',
    status: 'success'
  },
  {
    id: 'ACT-011',
    action: 'Order Taken for Delivery',
    description: 'Added to today\'s delivery route',
    user: { name: 'Rahul Sales', email: 'rahul@pvk.com', role: 'sales' },
    category: 'orders',
    type: 'delivery_assigned',
    icon: Truck,
    timestamp: '2024-12-25 09:30:00',
    timeAgo: '12 hours ago',
    entityType: 'Order',
    entityId: 'ORD-2024-148',
    entityName: 'Posters A2 - 100pcs',
    status: 'info',
    metadata: { location: 'North Route - Stop 5' }
  },
  {
    id: 'ACT-012',
    action: 'Order Delivered',
    description: 'Delivered and payment collected',
    user: { name: 'Rahul Sales', email: 'rahul@pvk.com', role: 'sales' },
    category: 'orders',
    type: 'delivered',
    icon: CheckCircle,
    timestamp: '2024-12-25 14:30:00',
    timeAgo: '7 hours ago',
    entityType: 'Order',
    entityId: 'ORD-2024-145',
    entityName: 'Flex Banner 6x4',
    status: 'success',
    metadata: { amount: 3500 }
  },
  {
    id: 'ACT-013',
    action: 'PAN Application Submitted',
    description: 'New PAN card application received',
    user: { name: 'Quick Print Hub', email: 'quick@hub.com', role: 'dealer' },
    category: 'orders',
    type: 'pan_submitted',
    icon: CreditCard,
    timestamp: '2024-12-25 19:00:00',
    timeAgo: '2 hours ago',
    entityType: 'PAN Application',
    entityId: 'PAN-2024-089',
    entityName: 'Normal PAN Application',
    status: 'info'
  },
  {
    id: 'ACT-014',
    action: 'PAN Application Processed',
    description: 'Documents verified and sent for printing',
    user: { name: 'Meena PAN Team', email: 'meena@pvk.com', role: 'pan_card_team' },
    category: 'orders',
    type: 'pan_processed',
    icon: FileText,
    timestamp: '2024-12-25 18:30:00',
    timeAgo: '3 hours ago',
    entityType: 'PAN Application',
    entityId: 'PAN-2024-087',
    entityName: 'Emergency PAN',
    status: 'success'
  },
  {
    id: 'ACT-015',
    action: 'Seal Order Created',
    description: 'New rubber seal order - Malayalam',
    user: { name: 'Express Graphics', email: 'express@graphics.com', role: 'dealer' },
    category: 'orders',
    type: 'seal_order',
    icon: Stamp,
    timestamp: '2024-12-25 17:45:00',
    timeAgo: '4 hours ago',
    entityType: 'Seal Order',
    entityId: 'SEAL-2024-045',
    entityName: 'Self-Ink Seal',
    status: 'info'
  },
  {
    id: 'ACT-016',
    action: 'Seal Order Processed',
    description: 'Seal design approved, sent for production',
    user: { name: 'Kumar Seal Team', email: 'kumar@pvk.com', role: 'seal_team' },
    category: 'orders',
    type: 'seal_processed',
    icon: CheckCircle,
    timestamp: '2024-12-25 17:00:00',
    timeAgo: '4.5 hours ago',
    entityType: 'Seal Order',
    entityId: 'SEAL-2024-044',
    entityName: 'Normal Seal - English',
    status: 'success'
  },

  // Approval Activities
  {
    id: 'ACT-017',
    action: 'Dealer Registration Approved',
    description: 'New dealer approved and activated',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'approvals',
    type: 'dealer_approved',
    icon: ThumbsUp,
    timestamp: '2024-12-25 16:30:00',
    timeAgo: '5 hours ago',
    entityType: 'Dealer',
    entityId: 'DLR-2024-028',
    entityName: 'Metro Graphics & Prints',
    status: 'success',
    metadata: { reason: 'All documents verified, GST validated' }
  },
  {
    id: 'ACT-018',
    action: 'Dealer Registration Rejected',
    description: 'Application rejected - incomplete documents',
    user: { name: 'Vikram Manager', email: 'vikram@pvk.com', role: 'manager' },
    category: 'approvals',
    type: 'dealer_rejected',
    icon: ThumbsDown,
    timestamp: '2024-12-25 15:45:00',
    timeAgo: '6 hours ago',
    entityType: 'Dealer',
    entityId: 'DLR-2024-027',
    entityName: 'Unknown Company',
    status: 'error',
    priority: 'normal',
    metadata: { reason: 'Invalid GST number, shop image unclear' }
  },
  {
    id: 'ACT-019',
    action: 'Order Approved by Manager',
    description: 'Bulk order approved for processing',
    user: { name: 'Vikram Manager', email: 'vikram@pvk.com', role: 'manager' },
    category: 'approvals',
    type: 'order_approved',
    icon: CheckCircle,
    timestamp: '2024-12-25 14:00:00',
    timeAgo: '7 hours ago',
    entityType: 'Order',
    entityId: 'ORD-2024-150',
    entityName: 'Bulk Cards - 5000 pcs',
    status: 'success',
    metadata: { amount: 15000 }
  },
  {
    id: 'ACT-020',
    action: 'Design Revision Requested',
    description: 'Design rejected, sent back for revision',
    user: { name: 'Vikram Manager', email: 'vikram@pvk.com', role: 'manager' },
    category: 'approvals',
    type: 'design_revision',
    icon: AlertTriangle,
    timestamp: '2024-12-25 13:30:00',
    timeAgo: '8 hours ago',
    entityType: 'Design',
    entityId: 'DSG-2024-890',
    entityName: 'Brochure Design v2',
    status: 'warning',
    metadata: { reason: 'Color mismatch, fonts need adjustment' }
  },

  // Finance Activities
  {
    id: 'ACT-021',
    action: 'Payment Received',
    description: 'Order payment collected via GPay',
    user: { name: 'Rahul Sales', email: 'rahul@pvk.com', role: 'sales' },
    category: 'finance',
    type: 'payment_received',
    icon: Wallet,
    timestamp: '2024-12-25 14:30:00',
    timeAgo: '7 hours ago',
    entityType: 'Payment',
    entityId: 'PAY-2024-456',
    entityName: 'GPay Payment',
    status: 'success',
    metadata: { amount: 3500, relatedOrder: 'ORD-2024-145' }
  },
  {
    id: 'ACT-022',
    action: 'Refund Processed',
    description: 'Partial refund issued for damaged goods',
    user: { name: 'Anita Finance', email: 'anita@pvk.com', role: 'finance' },
    category: 'finance',
    type: 'refund',
    icon: Wallet,
    timestamp: '2024-12-25 12:00:00',
    timeAgo: '9 hours ago',
    entityType: 'Refund',
    entityId: 'REF-2024-012',
    entityName: 'Partial Refund',
    status: 'warning',
    metadata: { amount: -500, relatedOrder: 'ORD-2024-130', reason: 'Printing defect on 20 cards' }
  },
  {
    id: 'ACT-023',
    action: 'Expense Recorded',
    description: 'Fuel expense for delivery vehicle',
    user: { name: 'Rahul Sales', email: 'rahul@pvk.com', role: 'sales' },
    category: 'finance',
    type: 'expense',
    icon: CreditCard,
    timestamp: '2024-12-25 11:00:00',
    timeAgo: '10 hours ago',
    entityType: 'Expense',
    entityId: 'EXP-2024-089',
    entityName: 'Petrol - North Route',
    status: 'info',
    metadata: { amount: -800, reason: 'Delivery fuel' }
  },
  {
    id: 'ACT-024',
    action: 'Designer Fine Applied',
    description: '₹50 fine for design error',
    user: { name: 'Vikram Manager', email: 'vikram@pvk.com', role: 'manager' },
    category: 'finance',
    type: 'fine',
    icon: AlertTriangle,
    timestamp: '2024-12-25 10:30:00',
    timeAgo: '11 hours ago',
    entityType: 'Fine',
    entityId: 'FIN-2024-015',
    entityName: 'Design Error Fine',
    status: 'error',
    metadata: { amount: -50, reason: 'Color mismatch in JOB-285' }
  },
  {
    id: 'ACT-025',
    action: 'Credit Extended',
    description: 'Credit limit increased for dealer',
    user: { name: 'Anita Finance', email: 'anita@pvk.com', role: 'finance' },
    category: 'finance',
    type: 'credit',
    icon: CreditCard,
    timestamp: '2024-12-25 10:00:00',
    timeAgo: '11 hours ago',
    entityType: 'Credit',
    entityId: 'CRD-2024-022',
    entityName: 'Credit Increase',
    status: 'success',
    metadata: { oldValue: '₹10,000', newValue: '₹25,000', reason: 'Good payment history' }
  },

  // System Activities
  {
    id: 'ACT-026',
    action: 'System Settings Updated',
    description: 'Designer earnings rate changed',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'system',
    type: 'settings_change',
    icon: Settings,
    timestamp: '2024-12-25 09:00:00',
    timeAgo: '12 hours ago',
    entityType: 'Settings',
    entityId: 'SET-DESIGNER',
    entityName: 'Designer Rates',
    status: 'info',
    metadata: { oldValue: '₹5/design', newValue: '₹6/design' }
  },
  {
    id: 'ACT-027',
    action: 'Low Stock Alert',
    description: 'PVC Card stock below minimum level',
    user: { name: 'System', email: 'system@pvk.com', role: 'admin' },
    category: 'system',
    type: 'stock_alert',
    icon: Package,
    timestamp: '2024-12-25 08:30:00',
    timeAgo: '13 hours ago',
    entityType: 'Stock',
    entityId: 'STK-PVC-001',
    entityName: 'PVC White Cards',
    status: 'warning',
    priority: 'high',
    metadata: { oldValue: 'Min: 500', newValue: 'Current: 125' }
  },
  {
    id: 'ACT-028',
    action: 'Stock Transfer Completed',
    description: 'Stock moved from Godown to Shop',
    user: { name: 'Suresh Stock Keeper', email: 'suresh@pvk.com', role: 'stock_keeper' },
    category: 'system',
    type: 'stock_transfer',
    icon: Package,
    timestamp: '2024-12-25 08:00:00',
    timeAgo: '13 hours ago',
    entityType: 'Stock Transfer',
    entityId: 'TRF-2024-045',
    entityName: 'A4 Paper Reams',
    status: 'success',
    metadata: { reason: '200 units transferred' }
  },
  {
    id: 'ACT-029',
    action: 'Dead Stock Alert',
    description: 'Product not moved in 60 days',
    user: { name: 'System', email: 'system@pvk.com', role: 'admin' },
    category: 'system',
    type: 'dead_stock',
    icon: AlertTriangle,
    timestamp: '2024-12-25 07:00:00',
    timeAgo: '14 hours ago',
    entityType: 'Stock',
    entityId: 'STK-OLD-015',
    entityName: 'Vintage Template Cards',
    status: 'error',
    priority: 'high',
    metadata: { reason: 'No sales in 60 days, consider discount sale' }
  },
  {
    id: 'ACT-030',
    action: 'Role Permissions Updated',
    description: 'Designer role permissions modified',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'system',
    type: 'permission_change',
    icon: Shield,
    timestamp: '2024-12-24 18:00:00',
    timeAgo: '1 day ago',
    entityType: 'Role',
    entityId: 'ROLE-DESIGNER',
    entityName: 'Designer Role',
    status: 'info',
    metadata: { newValue: 'Added: Can view own earnings' }
  },
  {
    id: 'ACT-031',
    action: 'Bulk User Import',
    description: 'Imported 15 users from Excel',
    user: { name: 'Admin User', email: 'admin@pvk.com', role: 'admin' },
    category: 'system',
    type: 'bulk_import',
    icon: FileText,
    timestamp: '2024-12-24 15:00:00',
    timeAgo: '1 day ago',
    entityType: 'Import',
    entityId: 'IMP-2024-003',
    entityName: 'User Bulk Import',
    status: 'success',
    metadata: { reason: '10 designers, 3 printers, 2 sales staff' }
  },
  {
    id: 'ACT-032',
    action: 'Backup Completed',
    description: 'Daily system backup completed',
    user: { name: 'System', email: 'system@pvk.com', role: 'admin' },
    category: 'system',
    type: 'backup',
    icon: Activity,
    timestamp: '2024-12-25 02:00:00',
    timeAgo: '19 hours ago',
    entityType: 'Backup',
    entityId: 'BAK-2024-359',
    entityName: 'Daily Backup',
    status: 'success'
  }
];

const getCategoryIcon = (category: ActivityCategory) => {
  switch (category) {
    case 'users': return User;
    case 'orders': return ShoppingCart;
    case 'approvals': return CheckCircle;
    case 'finance': return Wallet;
    case 'system': return Settings;
    default: return Activity;
  }
};

const getCategoryColor = (category: ActivityCategory) => {
  switch (category) {
    case 'users': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'orders': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'approvals': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'finance': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'system': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'success': return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
    case 'warning': return <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />;
    case 'error': return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case 'info': return <Info className="h-3.5 w-3.5 text-blue-500" />;
    default: return null;
  }
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'success':
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 text-xs">Success</Badge>;
    case 'warning':
      return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 text-xs">Warning</Badge>;
    case 'error':
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 text-xs">Error</Badge>;
    case 'info':
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 text-xs">Info</Badge>;
    default:
      return null;
  }
};

const AdminActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Filter logs based on active tab and filters
  const filteredLogs = useMemo(() => {
    return MOCK_ACTIVITY_LOGS.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.entityName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesRole = roleFilter === 'all' || log.user.role === roleFilter;
      const matchesCategory = activeTab === 'all' || log.category === activeTab;

      return matchesSearch && matchesRole && matchesCategory;
    });
  }, [searchQuery, roleFilter, activeTab]);

  // Statistics
  const stats = useMemo(() => {
    const today = MOCK_ACTIVITY_LOGS;
    return {
      total: today.length,
      users: today.filter(l => l.category === 'users').length,
      orders: today.filter(l => l.category === 'orders').length,
      approvals: today.filter(l => l.category === 'approvals').length,
      finance: today.filter(l => l.category === 'finance').length,
      system: today.filter(l => l.category === 'system').length,
      success: today.filter(l => l.status === 'success').length,
      warnings: today.filter(l => l.status === 'warning' || l.status === 'error').length,
    };
  }, []);

  // Toggle expansion of activity card
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Render activity card
  const renderActivityCard = (log: ActivityLog, index: number) => {
    const isExpanded = expandedIds.has(log.id);
    const RoleIcon = ROLE_ICONS[log.user.role] || UserCircle;
    const LogIcon = log.icon;

    return (
      <Collapsible
        key={log.id}
        open={isExpanded}
        onOpenChange={() => toggleExpand(log.id)}
      >
        <div className="relative">
          {/* Timeline line */}
          {viewMode === 'list' && index < filteredLogs.length - 1 && (
            <div className="absolute left-5 top-14 w-0.5 h-full bg-muted z-0" />
          )}

          <Card className={`relative z-10 transition-all duration-200 hover:shadow-md ${log.priority === 'critical' ? 'border-red-300 dark:border-red-800' :
              log.priority === 'high' ? 'border-orange-300 dark:border-orange-800' :
                ''
            }`}>
            <CollapsibleTrigger className="w-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon Column */}
                  <div className={`relative p-2.5 rounded-xl flex-shrink-0 ${getCategoryColor(log.category)}`}>
                    <LogIcon className="h-5 w-5" />
                    {log.status && (
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        {getStatusIcon(log.status)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{log.action}</h4>
                          {log.priority === 'critical' && (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          )}
                          {log.priority === 'high' && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">High Priority</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{log.description}</p>

                        {/* Entity reference */}
                        {log.entityId && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs font-mono">
                              {log.entityId}
                            </Badge>
                            {log.entityName && (
                              <span className="text-xs text-muted-foreground">
                                {log.entityName}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {log.metadata?.amount !== undefined && (
                          <span className={`font-semibold text-sm ${log.metadata.amount >= 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                            {log.metadata.amount >= 0 ? '+' : ''}₹{Math.abs(log.metadata.amount).toLocaleString()}
                          </span>
                        )}
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* User info row */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${ROLE_COLORS[log.user.role]}`}>
                          <RoleIcon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{log.user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {ROLE_LABELS[log.user.role] || log.user.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <Separator />
              <CardContent className="p-4 bg-muted/30">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Details Section */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Activity Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activity ID:</span>
                        <span className="font-mono">{log.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge className={`${getCategoryColor(log.category)} text-xs`}>
                          {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(log.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span>{log.timestamp}</span>
                      </div>
                      {log.metadata?.relatedOrder && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Related:</span>
                          <span className="text-primary">{log.metadata.relatedOrder}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Section */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Additional Info
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User Email:</span>
                        <span>{log.user.email}</span>
                      </div>
                      {log.metadata?.ipAddress && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Address:</span>
                          <span className="font-mono text-xs">{log.metadata.ipAddress}</span>
                        </div>
                      )}
                      {log.metadata?.device && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Device:</span>
                          <span className="flex items-center gap-1 text-xs">
                            {log.metadata.device.includes('Mobile') ?
                              <Smartphone className="h-3 w-3" /> :
                              <Monitor className="h-3 w-3" />}
                            {log.metadata.device}
                          </span>
                        </div>
                      )}
                      {log.metadata?.browser && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Browser:</span>
                          <span className="flex items-center gap-1 text-xs">
                            <Globe className="h-3 w-3" />
                            {log.metadata.browser}
                          </span>
                        </div>
                      )}
                      {log.metadata?.reason && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="text-xs max-w-[200px] text-right">{log.metadata.reason}</span>
                        </div>
                      )}
                      {log.metadata?.oldValue && log.metadata?.newValue && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Previous:</span>
                            <span className="text-xs text-red-500 line-through">{log.metadata.oldValue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Updated:</span>
                            <span className="text-xs text-green-600">{log.metadata.newValue}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  {log.entityId && (
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View {log.entityType}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs">
                    <User className="h-3.5 w-3.5 mr-1" />
                    View User
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs ml-auto">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Full Details
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </div>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground">Comprehensive audit trail of all system activities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="col-span-2">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Activities</p>
              </div>
              <Activity className="h-10 w-10 text-muted-foreground opacity-30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
            <p className="text-xs text-muted-foreground">User Actions</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">Orders</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{stats.approvals}</div>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.finance}</div>
            <p className="text-xs text-muted-foreground">Finance</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <TabsList className="h-12 p-1 grid grid-cols-3 sm:grid-cols-6 w-full lg:w-auto">
            <TabsTrigger value="all" className="h-10 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="h-10 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="h-10 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="h-10 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="h-10 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Finance</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="h-10 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          {/* View toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by action, user, entity..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                  <SelectItem value="sales">Sales / Line Staff</SelectItem>
                  <SelectItem value="pan_card_team">PAN Card Team</SelectItem>
                  <SelectItem value="seal_team">Seal Team</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="stock_keeper">Stock Keeper</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
          {filteredLogs.map((log, index) => renderActivityCard(log, index))}

          {filteredLogs.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || roleFilter !== 'all'
                    ? 'Try adjusting your filters to see more results'
                    : 'No activities have been recorded yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More */}
        {filteredLogs.length > 0 && (
          <div className="text-center">
            <Button variant="outline" className="w-full sm:w-auto">
              Load More Activities
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default AdminActivityLogs;
