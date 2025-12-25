import React, { useState } from 'react';
import {
    Users,
    Settings,
    DollarSign,
    Plus,
    Edit,
    Search,
    MoreVertical,
    Mail,
    Phone,
    UserCheck,
    UserX,
    CheckCircle,
    Clock,
    Save,
    Activity,
    Truck,
    MapPin,
    Route,
    Eye,
    Wallet,
    Package,
    Undo2,
    AlertTriangle,
    Download,
    Filter,
    TrendingUp,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

// Routes
const ROUTES = [
    { id: 'north_route', label: 'North Route', color: 'bg-blue-100 text-blue-700' },
    { id: 'city_center', label: 'City Center', color: 'bg-purple-100 text-purple-700' },
    { id: 'south_zone', label: 'South Zone', color: 'bg-green-100 text-green-700' },
    { id: 'east_side', label: 'East Side', color: 'bg-orange-100 text-orange-700' },
];

// Mock Sales Staff Data
const MOCK_SALES_STAFF = [
    {
        id: '1',
        name: 'Rajan Kumar',
        email: 'rajan@pvk.com',
        phone: '+91 98765 00001',
        status: 'active',
        assignedRoute: 'north_route',
        todayDeliveries: 8,
        todayCompleted: 5,
        cashCollected: 15600,
        pendingDeposit: 12000,
    },
    {
        id: '2',
        name: 'Suresh Menon',
        email: 'suresh@pvk.com',
        phone: '+91 98765 00002',
        status: 'active',
        assignedRoute: 'city_center',
        todayDeliveries: 6,
        todayCompleted: 6,
        cashCollected: 8500,
        pendingDeposit: 7500,
    },
    {
        id: '3',
        name: 'Vijay Nair',
        email: 'vijay@pvk.com',
        phone: '+91 98765 00003',
        status: 'active',
        assignedRoute: 'south_zone',
        todayDeliveries: 5,
        todayCompleted: 3,
        cashCollected: 6200,
        pendingDeposit: 5000,
    },
    {
        id: '4',
        name: 'Anil Pillai',
        email: 'anil@pvk.com',
        phone: '+91 98765 00004',
        status: 'inactive',
        assignedRoute: 'east_side',
        todayDeliveries: 0,
        todayCompleted: 0,
        cashCollected: 0,
        pendingDeposit: 0,
    },
];

// Mock Deliveries for Admin View
const MOCK_ADMIN_DELIVERIES = [
    { id: 'DEL-001', customer: 'Rajesh Kumar', staff: 'Rajan Kumar', route: 'north_route', status: 'in-transit', amount: 1500, time: '10:30 AM' },
    { id: 'DEL-002', customer: 'Priya Sharma', staff: 'Suresh Menon', route: 'city_center', status: 'delivered', amount: 3200, time: '11:15 AM' },
    { id: 'DEL-003', customer: 'Mohammed Ali', staff: 'Vijay Nair', route: 'south_zone', status: 'pending', amount: 850, time: '09:45 AM' },
    { id: 'DEL-004', customer: 'Sunita Patel', staff: 'Rajan Kumar', route: 'north_route', status: 'delivered', amount: 2800, time: '12:00 PM' },
    { id: 'DEL-005', customer: 'Amit Verma', staff: 'Suresh Menon', route: 'city_center', status: 'returned', amount: 1200, time: '01:30 PM' },
    { id: 'DEL-006', customer: 'Arjun Traders', staff: 'Rajan Kumar', route: 'north_route', status: 'pending', amount: 2200, time: '02:00 PM' },
];

// Mock Cash Records
const MOCK_CASH_RECORDS = [
    { id: 'CASH-001', date: '2024-12-25', staff: 'Rajan Kumar', collected: 15600, deposited: 12000, expenses: 850, pending: 2750, verified: true },
    { id: 'CASH-002', date: '2024-12-25', staff: 'Suresh Menon', collected: 8500, deposited: 7500, expenses: 500, pending: 500, verified: false },
    { id: 'CASH-003', date: '2024-12-25', staff: 'Vijay Nair', collected: 6200, deposited: 5000, expenses: 400, pending: 800, verified: false },
    { id: 'CASH-004', date: '2024-12-24', staff: 'Rajan Kumar', collected: 12000, deposited: 12000, expenses: 700, pending: 0, verified: true },
];

// Mock Activity Data
const MOCK_ACTIVITY = [
    { id: '1', action: 'Delivery Completed', staff: 'Rajan Kumar', details: 'Delivered to Sunita Patel • ₹2,800 collected', time: '30 min ago' },
    { id: '2', action: 'Cash Deposited', staff: 'Suresh Menon', details: 'Deposited ₹7,500 at main counter', time: '1h ago' },
    { id: '3', action: 'Sales Return', staff: 'Suresh Menon', details: 'Return from Amit Verma - Quality issue', time: '2h ago' },
    { id: '4', action: 'Route Changed', staff: 'Vijay Nair', details: 'Assigned to South Zone (was East Side)', time: '3h ago' },
    { id: '5', action: 'Expense Added', staff: 'Rajan Kumar', details: 'Fuel expense ₹200', time: '4h ago' },
];

const SalesManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [routeFilter, setRouteFilter] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('north_route');

    // Settings state
    const [settings, setSettings] = useState({
        salaryAdvanceLimit: 500,
        fuelAllowance: 200,
        cashDepositDeadline: 6, // PM
        deliveryCommission: 10, // per delivery
        enableGPS: true,
        autoAssignRoute: false,
    });

    // Filter staff
    const filteredStaff = MOCK_SALES_STAFF.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRoute = routeFilter === 'all' || s.assignedRoute === routeFilter;
        return matchesSearch && matchesRoute;
    });

    // Stats
    const totalStaff = MOCK_SALES_STAFF.length;
    const activeStaff = MOCK_SALES_STAFF.filter(s => s.status === 'active').length;
    const totalDeliveriesToday = MOCK_SALES_STAFF.reduce((sum, s) => sum + s.todayDeliveries, 0);
    const totalCompletedToday = MOCK_SALES_STAFF.reduce((sum, s) => sum + s.todayCompleted, 0);
    const totalCashCollected = MOCK_SALES_STAFF.reduce((sum, s) => sum + s.cashCollected, 0);
    const totalPendingDeposit = MOCK_SALES_STAFF.reduce((sum, s) => sum + s.pendingDeposit, 0);
    const pendingDeliveries = MOCK_ADMIN_DELIVERIES.filter(d => d.status === 'pending').length;
    const returns = MOCK_ADMIN_DELIVERIES.filter(d => d.status === 'returned').length;

    const getRouteBadge = (routeId: string) => {
        const route = ROUTES.find(r => r.id === routeId);
        return route ? <Badge className={route.color}>{route.label}</Badge> : <Badge variant="outline">{routeId}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return <Badge className="bg-green-100 text-green-700">Delivered</Badge>;
            case 'in-transit':
                return <Badge className="bg-blue-100 text-blue-700">In Transit</Badge>;
            case 'returned':
                return <Badge className="bg-red-100 text-red-700">Returned</Badge>;
            case 'pending':
            default:
                return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
        }
    };

    const handleSaveSettings = () => {
        toast.success('Sales settings saved successfully');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sales Management</h1>
                        <p className="text-muted-foreground">Manage line staff, routes, and deliveries</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Line Staff</DialogTitle>
                            <DialogDescription>Create a new sales/line staff account</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input placeholder="Enter full name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="Enter email" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <Label>Assign Route</Label>
                                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROUTES.map(route => (
                                            <SelectItem key={route.id} value={route.id}>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {route.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Staff created'); setIsAddModalOpen(false); }}>
                                Create Staff
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{activeStaff}/{totalStaff}</div>
                                <p className="text-xs text-muted-foreground">Active Staff</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{totalCompletedToday}/{totalDeliveriesToday}</div>
                                <p className="text-xs text-muted-foreground">Deliveries Today</p>
                            </div>
                            <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">₹{totalCashCollected.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Cash Collected</p>
                            </div>
                            <Wallet className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-600">₹{totalPendingDeposit.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Pending Deposit</p>
                            </div>
                            <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 h-14 p-1">
                    <TabsTrigger value="members" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Staff</span>
                    </TabsTrigger>
                    <TabsTrigger value="deliveries" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Truck className="h-4 w-4" />
                        <span className="hidden sm:inline">Deliveries</span>
                    </TabsTrigger>
                    <TabsTrigger value="cash" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Wallet className="h-4 w-4" />
                        <span className="hidden sm:inline">Cash</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Activity className="h-4 w-4" />
                        <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                </TabsList>

                {/* Staff Tab */}
                <TabsContent value="members" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search staff..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={routeFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setRouteFilter('all')}
                            >
                                All ({totalStaff})
                            </Button>
                            {ROUTES.map(route => (
                                <Button
                                    key={route.id}
                                    variant={routeFilter === route.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setRouteFilter(route.id)}
                                >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {route.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredStaff.map((staff) => (
                            <Card key={staff.id} className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Truck className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold">{staff.name}</p>
                                                    {getRouteBadge(staff.assignedRoute)}
                                                    {staff.status === 'active' ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {staff.email}
                                                    </span>
                                                    <span className="hidden sm:flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {staff.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    {staff.todayCompleted}/{staff.todayDeliveries} today
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ₹{staff.cashCollected.toLocaleString()} collected
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Route className="h-4 w-4 mr-2" />
                                                        Change Route
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {staff.status === 'active' ? (
                                                        <DropdownMenuItem className="text-orange-600">
                                                            <UserX className="h-4 w-4 mr-2" />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                            Activate
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Deliveries Tab */}
                <TabsContent value="deliveries" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Today's Deliveries</h3>
                            <p className="text-sm text-muted-foreground">
                                {MOCK_ADMIN_DELIVERIES.length} total • {pendingDeliveries} pending • {returns} returns
                            </p>
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {MOCK_ADMIN_DELIVERIES.map((delivery) => (
                            <Card key={delivery.id} className={delivery.status === 'returned' ? 'border-red-200 bg-red-50/50' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{delivery.id}</span>
                                                    {getStatusBadge(delivery.status)}
                                                    {getRouteBadge(delivery.route)}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {delivery.customer} • <span className="font-medium">{delivery.staff}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="font-semibold">₹{delivery.amount.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">{delivery.time}</p>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Cash Tab */}
                <TabsContent value="cash" className="space-y-4">
                    <div className="grid gap-4 grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹{totalCashCollected.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">From {activeStaff} active staff</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Pending Deposit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">₹{totalPendingDeposit.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">To be verified</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{(totalCashCollected - totalPendingDeposit).toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Verified by finance</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Cash Records</CardTitle>
                                <Button variant="outline" size="sm">
                                    <Download className="h-3.5 w-3.5 mr-1" />
                                    Export
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Staff</TableHead>
                                        <TableHead>Collected</TableHead>
                                        <TableHead>Expenses</TableHead>
                                        <TableHead>Deposited</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_CASH_RECORDS.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.date}</TableCell>
                                            <TableCell className="font-medium">{record.staff}</TableCell>
                                            <TableCell className="text-green-600">₹{record.collected.toLocaleString()}</TableCell>
                                            <TableCell className="text-orange-600">₹{record.expenses.toLocaleString()}</TableCell>
                                            <TableCell>₹{record.deposited.toLocaleString()}</TableCell>
                                            <TableCell>
                                                {record.verified ? (
                                                    <Badge className="bg-green-100 text-green-700">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-100 text-amber-700">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Daily Salary Advance Limit (₹)</Label>
                                    <Input
                                        type="number"
                                        value={settings.salaryAdvanceLimit}
                                        onChange={(e) => setSettings({ ...settings, salaryAdvanceLimit: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Daily Fuel Allowance (₹)</Label>
                                    <Input
                                        type="number"
                                        value={settings.fuelAllowance}
                                        onChange={(e) => setSettings({ ...settings, fuelAllowance: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cash Deposit Deadline (PM)</Label>
                                    <Input
                                        type="number"
                                        value={settings.cashDepositDeadline}
                                        onChange={(e) => setSettings({ ...settings, cashDepositDeadline: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Delivery Commission (₹)</Label>
                                    <Input
                                        type="number"
                                        value={settings.deliveryCommission}
                                        onChange={(e) => setSettings({ ...settings, deliveryCommission: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <Label>Enable GPS Tracking</Label>
                                        <p className="text-xs text-muted-foreground">Track staff location during deliveries</p>
                                    </div>
                                    <Switch
                                        checked={settings.enableGPS}
                                        onCheckedChange={(checked) => setSettings({ ...settings, enableGPS: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <Label>Auto-Assign Routes</Label>
                                        <p className="text-xs text-muted-foreground">Automatically assign orders to nearest staff</p>
                                    </div>
                                    <Switch
                                        checked={settings.autoAssignRoute}
                                        onCheckedChange={(checked) => setSettings({ ...settings, autoAssignRoute: checked })}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveSettings}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Settings
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Route Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Route Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {ROUTES.map(route => {
                                    const staffCount = MOCK_SALES_STAFF.filter(s => s.assignedRoute === route.id).length;
                                    return (
                                        <Card key={route.id} className="text-center">
                                            <CardContent className="pt-4 pb-3">
                                                <Badge className={`mb-2 ${route.color}`}>{route.label}</Badge>
                                                <p className="text-2xl font-bold">{staffCount}</p>
                                                <p className="text-xs text-muted-foreground">Staff assigned</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {MOCK_ACTIVITY.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border">
                                        <div className={`p-2 rounded-full ${activity.action.includes('Completed') ? 'bg-green-100' :
                                                activity.action.includes('Return') ? 'bg-red-100' :
                                                    activity.action.includes('Deposited') ? 'bg-blue-100' :
                                                        'bg-muted'
                                            }`}>
                                            {activity.action.includes('Completed') ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                                                activity.action.includes('Return') ? <Undo2 className="h-4 w-4 text-red-600" /> :
                                                    activity.action.includes('Deposited') ? <Wallet className="h-4 w-4 text-blue-600" /> :
                                                        <Activity className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{activity.action}</p>
                                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{activity.staff} • {activity.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SalesManagement;
