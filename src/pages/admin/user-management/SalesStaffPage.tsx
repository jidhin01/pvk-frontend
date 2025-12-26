import React, { useState } from 'react';
import {
    Truck,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    UserCheck,
    UserX,
    Edit,
    Eye,
    Users,
    MapPin,
    Wallet,
    Navigation
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
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
        name: 'Rahul Sales',
        email: 'rahul@pvk.com',
        phone: '+91 98765 43212',
        status: 'active',
        route: 'north_route',
        joinedAt: '2024-03-10',
        deliveriesToday: 8,
        cashCollected: 15600,
        pendingDeposit: 2750
    },
    {
        id: '2',
        name: 'Deepa Sales',
        email: 'deepa@pvk.com',
        phone: '+91 98765 43220',
        status: 'active',
        route: 'south_zone',
        joinedAt: '2024-04-15',
        deliveriesToday: 6,
        cashCollected: 12400,
        pendingDeposit: 1800
    },
    {
        id: '3',
        name: 'Rajan Kumar',
        email: 'rajan@pvk.com',
        phone: '+91 98765 43224',
        status: 'active',
        route: 'city_center',
        joinedAt: '2024-02-20',
        deliveriesToday: 10,
        cashCollected: 18500,
        pendingDeposit: 3200
    },
    {
        id: '4',
        name: 'Vijay Nair',
        email: 'vijay@pvk.com',
        phone: '+91 98765 43225',
        status: 'inactive',
        route: 'east_side',
        joinedAt: '2024-01-05',
        deliveriesToday: 0,
        cashCollected: 0,
        pendingDeposit: 0
    },
];

const SalesStaffPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [routeFilter, setRouteFilter] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredStaff = MOCK_SALES_STAFF.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesRoute = routeFilter === 'all' || s.route === routeFilter;
        return matchesSearch && matchesStatus && matchesRoute;
    });

    const totalStaff = MOCK_SALES_STAFF.length;
    const activeStaff = MOCK_SALES_STAFF.filter(s => s.status === 'active').length;
    const totalDeliveries = MOCK_SALES_STAFF.reduce((sum, s) => sum + s.deliveriesToday, 0);
    const totalCashCollected = MOCK_SALES_STAFF.reduce((sum, s) => sum + s.cashCollected, 0);

    const getRouteBadge = (routeId: string) => {
        const route = ROUTES.find(r => r.id === routeId);
        return route ? (
            <Badge className={`${route.color} border-0`}>
                <Navigation className="h-3 w-3 mr-1" />
                {route.label}
            </Badge>
        ) : null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sales / Line Staff</h1>
                        <p className="text-muted-foreground">Manage delivery and sales staff accounts</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sales Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Sales Staff</DialogTitle>
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
                                <Label>Assigned Route</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a route" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROUTES.map(route => (
                                            <SelectItem key={route.id} value={route.id}>
                                                {route.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" placeholder="Enter password" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Sales staff created'); setIsAddModalOpen(false); }}>
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
                                <div className="text-2xl font-bold text-green-600">{totalDeliveries}</div>
                                <p className="text-xs text-muted-foreground">Deliveries Today</p>
                            </div>
                            <MapPin className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">₹{totalCashCollected.toLocaleString()}</div>
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
                                <div className="text-2xl font-bold text-purple-600">{ROUTES.length}</div>
                                <p className="text-xs text-muted-foreground">Active Routes</p>
                            </div>
                            <Navigation className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search sales staff..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={routeFilter} onValueChange={setRouteFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="All Routes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Routes</SelectItem>
                            {ROUTES.map(route => (
                                <SelectItem key={route.id} value={route.id}>{route.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({totalStaff})
                    </Button>
                    <Button
                        variant={statusFilter === 'active' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('active')}
                    >
                        Active ({activeStaff})
                    </Button>
                </div>
            </div>

            {/* Sales Staff List */}
            <div className="space-y-3">
                {filteredStaff.map((staff) => (
                    <Card key={staff.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Truck className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{staff.name}</p>
                                            {getRouteBadge(staff.route)}
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
                                            <MapPin className="h-4 w-4 text-green-600" />
                                            {staff.deliveriesToday} deliveries today
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            ₹{staff.cashCollected.toLocaleString()} collected • ₹{staff.pendingDeposit.toLocaleString()} pending
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
                                                <Navigation className="h-4 w-4 mr-2" />
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
        </div>
    );
};

export default SalesStaffPage;
