import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Users,
    DollarSign,
    Clock,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Palette,
    Printer,
    Package,
    Briefcase,
    IdCard,
    Stamp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for dashboard
const MOCK_STATS = {
    totalOrders: 1284,
    ordersChange: 12.5,
    revenue: '₹4,52,000',
    revenueChange: 8.2,
    activeUsers: 156,
    usersChange: 5.3,
    pendingApprovals: 8,
    pendingDealers: 3,
};

const MOCK_DEPARTMENT_STATUS = [
    { name: 'Designer Team', icon: Palette, active: 5, pending: 12, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { name: 'Printer Team', icon: Printer, active: 3, pending: 24, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { name: 'Sales / Line Staff', icon: Briefcase, active: 8, pending: 15, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { name: 'Stock Keeper', icon: Package, active: 2, pending: 5, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { name: 'PAN Card Team', icon: IdCard, active: 2, pending: 8, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
    { name: 'Seal Team', icon: Stamp, active: 3, pending: 6, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
];

const MOCK_RECENT_ACTIVITY = [
    { id: 1, action: 'New dealer registration', user: 'ABC Prints', time: '5 min ago', type: 'pending' },
    { id: 2, action: 'Order completed', user: 'Order #1234', time: '12 min ago', type: 'success' },
    { id: 3, action: 'Stock alert', user: 'PVC Cards Low', time: '25 min ago', type: 'warning' },
    { id: 4, action: 'Design uploaded', user: 'Designer Anu', time: '1 hour ago', type: 'info' },
    { id: 5, action: 'Payment received', user: '₹15,000', time: '2 hours ago', type: 'success' },
];

const AdminOverview = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{MOCK_STATS.totalOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+{MOCK_STATS.ordersChange}%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{MOCK_STATS.revenue}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+{MOCK_STATS.revenueChange}%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{MOCK_STATS.activeUsers}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+{MOCK_STATS.usersChange}%</span> new this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{MOCK_STATS.pendingApprovals}</div>
                        <p className="text-xs text-muted-foreground">
                            Including {MOCK_STATS.pendingDealers} dealer requests
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Department Status & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Department Status */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Department Status</CardTitle>
                        <CardDescription>Real-time overview of all teams</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MOCK_DEPARTMENT_STATUS.map((dept) => (
                                <div
                                    key={dept.name}
                                    onClick={() => {
                                        if (dept.name === 'Stock Keeper') {
                                            navigate('/admin', { state: { activeTab: 'manage-stock' } });
                                        }
                                    }}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${dept.bgColor}`}>
                                            <dept.icon className={`h-4 w-4 ${dept.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{dept.name}</p>
                                            <p className="text-xs text-muted-foreground">{dept.active} members active</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{dept.pending} pending</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {MOCK_RECENT_ACTIVITY.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 text-sm">
                                    <div className={`mt-0.5 p-1 rounded-full ${activity.type === 'success' ? 'bg-green-100 dark:bg-green-900' :
                                        activity.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900' :
                                            activity.type === 'pending' ? 'bg-blue-100 dark:bg-blue-900' :
                                                'bg-muted'
                                        }`}>
                                        {activity.type === 'success' ? <CheckCircle className="h-3 w-3 text-green-600" /> :
                                            activity.type === 'warning' ? <AlertCircle className="h-3 w-3 text-orange-600" /> :
                                                <Clock className="h-3 w-3 text-blue-600" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4" size="sm">
                            View All Activity
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                        <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Dealers
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admin', { state: { activeTab: 'manage-stock' } })}>
                            <Package className="h-4 w-4 mr-2" />
                            Inventory Control
                        </Button>
                        <Button variant="outline" size="sm">
                            <DollarSign className="h-4 w-4 mr-2" />
                            View Finances
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOverview;
