import React, { useState } from 'react';
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
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock activity log data
const MOCK_ACTIVITY_LOGS = [
  { id: 1, action: 'User Login', user: 'admin@pvk.com', role: 'Admin', type: 'auth', icon: LogIn, timestamp: '2024-12-24 14:30:00', details: 'Logged in from 192.168.1.1' },
  { id: 2, action: 'Dealer Approved', user: 'admin@pvk.com', role: 'Admin', type: 'approval', icon: CheckCircle, timestamp: '2024-12-24 14:25:00', details: 'Approved dealer: ABC Prints' },
  { id: 3, action: 'User Created', user: 'manager@pvk.com', role: 'Manager', type: 'user', icon: UserPlus, timestamp: '2024-12-24 14:20:00', details: 'Created new designer: Anu Designer' },
  { id: 4, action: 'Settings Updated', user: 'admin@pvk.com', role: 'Admin', type: 'settings', icon: Settings, timestamp: '2024-12-24 14:15:00', details: 'Updated notification preferences' },
  { id: 5, action: 'Order Completed', user: 'sales@pvk.com', role: 'Sales', type: 'order', icon: ShoppingCart, timestamp: '2024-12-24 14:10:00', details: 'Completed order #1234' },
  { id: 6, action: 'Payment Received', user: 'finance@pvk.com', role: 'Finance', type: 'payment', icon: CreditCard, timestamp: '2024-12-24 14:05:00', details: 'Received ₹15,000 from Quick Hub' },
  { id: 7, action: 'Dealer Rejected', user: 'manager@pvk.com', role: 'Manager', type: 'approval', icon: XCircle, timestamp: '2024-12-24 14:00:00', details: 'Rejected dealer: Fake Company' },
  { id: 8, action: 'User Edited', user: 'admin@pvk.com', role: 'Admin', type: 'user', icon: Edit, timestamp: '2024-12-24 13:55:00', details: 'Updated role for user: Rahul' },
  { id: 9, action: 'User Deactivated', user: 'admin@pvk.com', role: 'Admin', type: 'user', icon: Trash2, timestamp: '2024-12-24 13:50:00', details: 'Deactivated user: Old Employee' },
  { id: 10, action: 'User Logout', user: 'designer@pvk.com', role: 'Designer', type: 'auth', icon: LogOut, timestamp: '2024-12-24 13:45:00', details: 'Logged out' },
  { id: 11, action: 'Role Permissions Changed', user: 'admin@pvk.com', role: 'Admin', type: 'settings', icon: Shield, timestamp: '2024-12-24 13:40:00', details: 'Updated Manager permissions' },
  { id: 12, action: 'Bulk User Import', user: 'admin@pvk.com', role: 'Admin', type: 'user', icon: UserPlus, timestamp: '2024-12-24 13:35:00', details: 'Imported 15 users from Excel' },
];

const getTypeBadge = (type: string) => {
  const types: Record<string, { label: string; class: string }> = {
    auth: { label: 'Auth', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    approval: { label: 'Approval', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    user: { label: 'User', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    settings: { label: 'Settings', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    order: { label: 'Order', class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
    payment: { label: 'Payment', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
  };
  return types[type] || { label: type, class: 'bg-gray-100 text-gray-800' };
};

const AdminActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');

  // Filter logs
  const filteredLogs = MOCK_ACTIVITY_LOGS.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Track all system activities and user actions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{MOCK_ACTIVITY_LOGS.length}</div>
            <p className="text-xs text-muted-foreground">Total Activities Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">
              {MOCK_ACTIVITY_LOGS.filter(l => l.type === 'auth').length}
            </div>
            <p className="text-xs text-muted-foreground">Auth Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">
              {MOCK_ACTIVITY_LOGS.filter(l => l.type === 'user').length}
            </div>
            <p className="text-xs text-muted-foreground">User Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">
              {MOCK_ACTIVITY_LOGS.filter(l => l.type === 'approval').length}
            </div>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log, index) => {
              const typeBadge = getTypeBadge(log.type);
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 relative"
                >
                  {/* Timeline Line */}
                  {index < filteredLogs.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 p-2 rounded-full bg-muted flex-shrink-0">
                    <log.icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{log.action}</p>
                      <Badge className={`text-xs ${typeBadge.class}`}>
                        {typeBadge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </span>
                      <span>•</span>
                      <span>{log.role}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No activity logs found matching your criteria</p>
              </div>
            )}
          </div>

          {filteredLogs.length > 0 && (
            <Button variant="outline" className="w-full mt-4">
              Load More
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityLogs;
