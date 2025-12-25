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
    Stamp,
    ArrowRight,
    Activity,
    Wallet,
    Store,
    UserPlus,
    Truck,
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data
const MOCK_STATS = {
    totalOrders: 1284,
    ordersChange: 12.5,
    revenue: '₹4.52L',
    revenueChange: 8.2,
    activeUsers: 156,
    usersChange: 5.3,
    pendingApprovals: 8,
};

const MOCK_TEAMS = [
    { name: 'Designers', icon: Palette, active: 5, pending: 12, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30', tab: 'manage-designer' },
    { name: 'Printers', icon: Printer, active: 3, pending: 24, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30', tab: 'manage-printer' },
    { name: 'Sales Staff', icon: Briefcase, active: 8, pending: 15, color: 'text-green-600 bg-green-100 dark:bg-green-900/30', tab: 'manage-sales' },
    { name: 'Stock', icon: Package, active: 2, pending: 5, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30', tab: 'manage-stock' },
    { name: 'PAN Card', icon: IdCard, active: 2, pending: 8, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30', tab: 'manage-pancard' },
    { name: 'Seal Team', icon: Stamp, active: 3, pending: 6, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30', tab: 'manage-seal' },
];

const MOCK_ACTIVITY = [
    { id: 1, action: 'New dealer registration', entity: 'ABC Prints', time: '5 min ago', type: 'pending' },
    { id: 2, action: 'Order delivered', entity: 'Order #1234', time: '12 min ago', type: 'success' },
    { id: 3, action: 'Low stock alert', entity: 'PVC Cards', time: '25 min ago', type: 'warning' },
    { id: 4, action: 'Design completed', entity: 'Anu Designer', time: '1h ago', type: 'success' },
    { id: 5, action: 'Payment received', entity: '₹15,000', time: '2h ago', type: 'success' },
];

const AdminOverview = () => {
    const navigate = useNavigate();

    const handleNavigate = (tab: string) => {
        navigate('/admin', { state: { activeTab: tab } });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Business overview</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Orders</p>
                                <p className="text-2xl font-bold">{MOCK_STATS.totalOrders.toLocaleString()}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +{MOCK_STATS.ordersChange}%
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Revenue</p>
                                <p className="text-2xl font-bold">{MOCK_STATS.revenue}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +{MOCK_STATS.revenueChange}%
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Users</p>
                                <p className="text-2xl font-bold">{MOCK_STATS.activeUsers}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +{MOCK_STATS.usersChange}%
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 dark:border-orange-800">
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{MOCK_STATS.pendingApprovals}</p>
                                <p className="text-xs text-muted-foreground mt-1">Require action</p>
                            </div>
                            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                <Clock className="h-5 w-5 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Teams & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Teams */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle>Teams</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => handleNavigate('users')}>
                                View All <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {MOCK_TEAMS.map((team) => (
                                <div
                                    key={team.name}
                                    onClick={() => handleNavigate(team.tab)}
                                    className="p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${team.color.split(' ').slice(1).join(' ')}`}>
                                            <team.icon className={`h-4 w-4 ${team.color.split(' ')[0]}`} />
                                        </div>
                                        <span className="font-medium text-sm">{team.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">{team.active} active</span>
                                        <Badge variant="secondary" className="text-xs">{team.pending} pending</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle>Activity</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => handleNavigate('activity-logs')}>
                                <Activity className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_ACTIVITY.map((item) => (
                                <div key={item.id} className="flex items-start gap-3">
                                    <div className={`mt-0.5 p-1.5 rounded-full ${item.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                                            item.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                'bg-blue-100 dark:bg-blue-900/30'
                                        }`}>
                                        {item.type === 'success' ? <CheckCircle className="h-3 w-3 text-green-600" /> :
                                            item.type === 'warning' ? <AlertCircle className="h-3 w-3 text-orange-600" /> :
                                                <Clock className="h-3 w-3 text-blue-600" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.action}</p>
                                        <p className="text-xs text-muted-foreground">{item.entity} • {item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleNavigate('users')}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleNavigate('dealer-approvals')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Dealers
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleNavigate('manage-stock')}>
                            <Package className="h-4 w-4 mr-2" />
                            Inventory
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleNavigate('manage-finance')}>
                            <Wallet className="h-4 w-4 mr-2" />
                            Finances
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleNavigate('manage-partners')}>
                            <Store className="h-4 w-4 mr-2" />
                            Partners
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOverview;
