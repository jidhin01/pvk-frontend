import React, { useState } from 'react';
import {
    Package,
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
    AlertTriangle,
    Warehouse
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

// Locations
const LOCATIONS = [
    { id: 'godown', label: 'Godown', color: 'bg-orange-100 text-orange-700' },
    { id: 'shop', label: 'Shop', color: 'bg-cyan-100 text-cyan-700' },
];

// Mock Stock Keepers Data
const MOCK_STOCK_KEEPERS = [
    {
        id: '1',
        name: 'Suresh Stock',
        email: 'suresh@pvk.com',
        phone: '+91 98765 43214',
        status: 'active',
        location: 'godown',
        joinedAt: '2023-12-01',
        itemsManaged: 1250,
        lowStockAlerts: 8,
        deadStockItems: 12
    },
    {
        id: '2',
        name: 'Mini Stock',
        email: 'mini@pvk.com',
        phone: '+91 98765 43221',
        status: 'inactive',
        location: 'shop',
        joinedAt: '2024-02-10',
        itemsManaged: 450,
        lowStockAlerts: 3,
        deadStockItems: 5
    },
    {
        id: '3',
        name: 'Anand Stock',
        email: 'anand.stock@pvk.com',
        phone: '+91 98765 43226',
        status: 'active',
        location: 'shop',
        joinedAt: '2024-05-15',
        itemsManaged: 380,
        lowStockAlerts: 2,
        deadStockItems: 1
    },
];

const StockKeepersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [locationFilter, setLocationFilter] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredKeepers = MOCK_STOCK_KEEPERS.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesLocation = locationFilter === 'all' || s.location === locationFilter;
        return matchesSearch && matchesStatus && matchesLocation;
    });

    const totalKeepers = MOCK_STOCK_KEEPERS.length;
    const activeKeepers = MOCK_STOCK_KEEPERS.filter(s => s.status === 'active').length;
    const godownKeepers = MOCK_STOCK_KEEPERS.filter(s => s.location === 'godown').length;
    const shopKeepers = MOCK_STOCK_KEEPERS.filter(s => s.location === 'shop').length;

    const getLocationBadge = (locationId: string) => {
        const location = LOCATIONS.find(l => l.id === locationId);
        return location ? (
            <Badge className={`${location.color} border-0`}>
                <MapPin className="h-3 w-3 mr-1" />
                {location.label}
            </Badge>
        ) : null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Stock Keepers</h1>
                        <p className="text-muted-foreground">Manage inventory staff accounts</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Stock Keeper
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Stock Keeper</DialogTitle>
                            <DialogDescription>Create a new stock keeper account</DialogDescription>
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
                                <Label>Assigned Location</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATIONS.map(loc => (
                                            <SelectItem key={loc.id} value={loc.id}>
                                                {loc.label}
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
                            <Button onClick={() => { toast.success('Stock keeper created'); setIsAddModalOpen(false); }}>
                                Create Stock Keeper
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
                                <div className="text-2xl font-bold">{activeKeepers}/{totalKeepers}</div>
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
                                <div className="text-2xl font-bold text-orange-600">{godownKeepers}</div>
                                <p className="text-xs text-muted-foreground">Godown Staff</p>
                            </div>
                            <Warehouse className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-cyan-600">{shopKeepers}</div>
                                <p className="text-xs text-muted-foreground">Shop Staff</p>
                            </div>
                            <MapPin className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {MOCK_STOCK_KEEPERS.reduce((sum, s) => sum + s.lowStockAlerts, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search stock keepers..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {LOCATIONS.map(loc => (
                                <SelectItem key={loc.id} value={loc.id}>{loc.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({totalKeepers})
                    </Button>
                    <Button
                        variant={statusFilter === 'active' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('active')}
                    >
                        Active ({activeKeepers})
                    </Button>
                </div>
            </div>

            {/* Stock Keepers List */}
            <div className="space-y-3">
                {filteredKeepers.map((keeper) => (
                    <Card key={keeper.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{keeper.name}</p>
                                            {getLocationBadge(keeper.location)}
                                            {keeper.status === 'active' ? (
                                                <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {keeper.email}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {keeper.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                            <Package className="h-4 w-4 text-orange-600" />
                                            {keeper.itemsManaged.toLocaleString()} items managed
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {keeper.lowStockAlerts} alerts • {keeper.deadStockItems} dead stock
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
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Change Location
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {keeper.status === 'active' ? (
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

export default StockKeepersPage;
