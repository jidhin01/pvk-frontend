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
    Stamp,
    Layers,
    FolderOpen,
    Eye,
    Package,
    AlertTriangle,
    TrendingUp,
    Download,
    Filter,
    ArrowUpRight,
    Hammer,
    Factory
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
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
import { MOCK_SEAL_ORDERS, SEAL_TEAM_EARNINGS, SEAL_PRODUCTION_STATS } from '@/data/mockSealData';

// Mock Seal Team Members
const MOCK_SEAL_MEMBERS = [
    {
        id: '1',
        name: 'Rahul K',
        email: 'rahul@pvk.com',
        phone: '+91 98765 43220',
        status: 'active',
        station: 'assembly',
        completedToday: 8,
        completedWeek: 42,
        activeJobs: 3,
        efficiency: 92
    },
    {
        id: '2',
        name: 'Suresh M',
        email: 'suresh@pvk.com',
        phone: '+91 98765 43221',
        status: 'active',
        station: 'exposure',
        completedToday: 12,
        completedWeek: 58,
        activeJobs: 2,
        efficiency: 88
    },
    {
        id: '3',
        name: 'Anil Kumar',
        email: 'anil@pvk.com',
        phone: '+91 98765 43222',
        status: 'active',
        station: 'assembly',
        completedToday: 6,
        completedWeek: 35,
        activeJobs: 4,
        efficiency: 85
    },
    {
        id: '4',
        name: 'Vinod P',
        email: 'vinod@pvk.com',
        phone: '+91 98765 43223',
        status: 'inactive',
        station: 'exposure',
        completedToday: 0,
        completedWeek: 20,
        activeJobs: 0,
        efficiency: 90
    },
];

// Mock Production Queue
const MOCK_PRODUCTION_QUEUE = MOCK_SEAL_ORDERS.filter(o => o.status !== 'completed').map(order => ({
    ...order,
    assignedTo: order.assignedTo || 'Unassigned'
}));

// Mock Completed Orders
const MOCK_COMPLETED_ORDERS = MOCK_SEAL_ORDERS.filter(o => o.status === 'completed');

// Mock Activity
const MOCK_ACTIVITY = [
    { id: '1', action: 'Order Completed', member: 'Rahul K', details: 'Completed SEAL-006 for Legal Docs Center', time: '30 min ago' },
    { id: '2', action: 'Batch Started', member: 'Suresh M', details: 'Started exposure batch with 5 orders', time: '1h ago' },
    { id: '3', action: 'Stock Alert', member: 'System', details: 'Shiny S-842 running low (3 remaining)', time: '2h ago' },
    { id: '4', action: 'Rush Order', member: 'Admin', details: 'SEAL-001 marked as rush order', time: '3h ago' },
    { id: '5', action: 'Member Added', member: 'Admin', details: 'Anil Kumar joined Seal Team', time: '1d ago' },
];

const SealTeamManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [stationFilter, setStationFilter] = useState<'all' | 'exposure' | 'assembly'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMemberStation, setNewMemberStation] = useState<'exposure' | 'assembly'>('assembly');

    // Settings state
    const [settings, setSettings] = useState({
        batchMinSize: 5,
        batchMaxSize: 20,
        rushPriority: true,
        autoNotifyDealer: true,
        exposureTime: 180, // seconds
        polymerAlertLevel: 1.5, // liters
        handleAlertLevel: 5, // units
    });

    // Filter members
    const filteredMembers = MOCK_SEAL_MEMBERS.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStation = stationFilter === 'all' || m.station === stationFilter;
        return matchesSearch && matchesStation;
    });

    // Stats
    const totalMembers = MOCK_SEAL_MEMBERS.length;
    const activeMembers = MOCK_SEAL_MEMBERS.filter(m => m.status === 'active').length;
    const exposureTeam = MOCK_SEAL_MEMBERS.filter(m => m.station === 'exposure').length;
    const assemblyTeam = MOCK_SEAL_MEMBERS.filter(m => m.station === 'assembly').length;
    const totalCompletedToday = MOCK_SEAL_MEMBERS.reduce((sum, m) => sum + m.completedToday, 0);
    const pendingOrders = MOCK_PRODUCTION_QUEUE.length;
    const rushOrders = MOCK_PRODUCTION_QUEUE.filter(o => o.priority === 'rush').length;

    const handleSaveSettings = () => {
        toast.success('Seal Team settings saved successfully');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_batch':
                return <Badge className="bg-blue-100 text-blue-700">Pending Batch</Badge>;
            case 'exposure_done':
                return <Badge className="bg-purple-100 text-purple-700">Exposure Done</Badge>;
            case 'mounting':
                return <Badge className="bg-orange-100 text-orange-700">Mounting</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Stamp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Seal Team Management</h1>
                        <p className="text-muted-foreground">Manage seal production team and workflow</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Seal Team Member</DialogTitle>
                            <DialogDescription>Create a new seal team member account</DialogDescription>
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
                                <Label>Assigned Station</Label>
                                <Select value={newMemberStation} onValueChange={(v) => setNewMemberStation(v as 'exposure' | 'assembly')}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="exposure">
                                            <div className="flex items-center gap-2">
                                                <Factory className="h-4 w-4" />
                                                Exposure / Darkroom
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="assembly">
                                            <div className="flex items-center gap-2">
                                                <Hammer className="h-4 w-4" />
                                                Assembly / Mounting
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Member added to Seal Team'); setIsAddModalOpen(false); }}>
                                Add Member
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{activeMembers}/{totalMembers}</div>
                                <p className="text-xs text-muted-foreground">Active Members</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{totalCompletedToday}</div>
                                <p className="text-xs text-muted-foreground">Completed Today</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
                                <p className="text-xs text-muted-foreground">In Production</p>
                            </div>
                            <Layers className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-red-600">{rushOrders}</div>
                                <p className="text-xs text-muted-foreground">Rush Orders</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-emerald-600">₹{SEAL_TEAM_EARNINGS.today.revenue}</div>
                                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 h-14 p-1">
                    <TabsTrigger value="members" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Members</span>
                    </TabsTrigger>
                    <TabsTrigger value="production" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Layers className="h-4 w-4" />
                        <span className="hidden sm:inline">Production</span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <FolderOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Completed</span>
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

                {/* Members Tab */}
                <TabsContent value="members" className="space-y-4">
                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search members..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={stationFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setStationFilter('all')}
                            >
                                All ({totalMembers})
                            </Button>
                            <Button
                                variant={stationFilter === 'exposure' ? 'default' : 'outline'}
                                onClick={() => setStationFilter('exposure')}
                                className="gap-2"
                            >
                                <Factory className="h-4 w-4" />
                                Exposure ({exposureTeam})
                            </Button>
                            <Button
                                variant={stationFilter === 'assembly' ? 'default' : 'outline'}
                                onClick={() => setStationFilter('assembly')}
                                className="gap-2"
                            >
                                <Hammer className="h-4 w-4" />
                                Assembly ({assemblyTeam})
                            </Button>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-3">
                        {filteredMembers.map((member) => (
                            <Card key={member.id} className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium ${member.station === 'exposure'
                                                ? 'bg-purple-100 text-purple-600'
                                                : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {member.station === 'exposure' ? (
                                                    <Factory className="h-6 w-6" />
                                                ) : (
                                                    <Hammer className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold">{member.name}</p>
                                                    <Badge className={member.station === 'exposure'
                                                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                        : 'bg-orange-100 text-orange-700 border-orange-300'
                                                    }>
                                                        {member.station === 'exposure' ? 'Exposure Team' : 'Assembly Team'}
                                                    </Badge>
                                                    {member.status === 'active' ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {member.email}
                                                    </span>
                                                    <span className="hidden sm:flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {member.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    {member.completedToday} today
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {member.activeJobs} active • {member.efficiency}% efficiency
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
                                                    <DropdownMenuSeparator />
                                                    {member.status === 'active' ? (
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

                {/* Production Tab */}
                <TabsContent value="production" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Production Queue</h3>
                            <p className="text-sm text-muted-foreground">{MOCK_PRODUCTION_QUEUE.length} orders in progress</p>
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {MOCK_PRODUCTION_QUEUE.map((order) => (
                            <Card key={order.id} className={order.priority === 'rush' ? 'border-red-300 bg-red-50/50 dark:bg-red-950/10' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="font-semibold">{order.id}</span>
                                                {order.priority === 'rush' && (
                                                    <Badge variant="destructive" className="text-xs">Rush</Badge>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{order.content}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <Badge variant="secondary">{order.type.replace('_', '-')}</Badge>
                                                    {getStatusBadge(order.status)}
                                                    <span className="text-xs text-muted-foreground">{order.dealerName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {order.assignedTo !== 'Unassigned' && (
                                                <Badge variant="outline" className="text-xs">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {order.assignedTo}
                                                </Badge>
                                            )}
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
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Assign Member
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                                        Mark as Rush
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Completed Tab */}
                <TabsContent value="completed" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Completed Orders</h3>
                            <p className="text-sm text-muted-foreground">{MOCK_COMPLETED_ORDERS.length} orders delivered</p>
                        </div>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Completed By</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_COMPLETED_ORDERS.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{order.content}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{order.type.replace('_', '-')}</Badge>
                                            </TableCell>
                                            <TableCell>{order.dealerName}</TableCell>
                                            <TableCell>{order.assignedTo || 'Team'}</TableCell>
                                            <TableCell className="text-right font-semibold text-emerald-600">
                                                ₹{order.price}
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
                            <CardTitle>Seal Production Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Batch Minimum Size</Label>
                                    <Input
                                        type="number"
                                        value={settings.batchMinSize}
                                        onChange={(e) => setSettings({ ...settings, batchMinSize: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Minimum orders before batch exposure</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Batch Maximum Size</Label>
                                    <Input
                                        type="number"
                                        value={settings.batchMaxSize}
                                        onChange={(e) => setSettings({ ...settings, batchMaxSize: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Maximum orders per batch</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Exposure Time (Seconds)</Label>
                                    <Input
                                        type="number"
                                        value={settings.exposureTime}
                                        onChange={(e) => setSettings({ ...settings, exposureTime: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Polymer Alert Level (Liters)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={settings.polymerAlertLevel}
                                        onChange={(e) => setSettings({ ...settings, polymerAlertLevel: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Handle Alert Level (Units)</Label>
                                    <Input
                                        type="number"
                                        value={settings.handleAlertLevel}
                                        onChange={(e) => setSettings({ ...settings, handleAlertLevel: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <Label>Rush Order Priority</Label>
                                        <p className="text-xs text-muted-foreground">Rush orders skip to front of queue</p>
                                    </div>
                                    <Switch
                                        checked={settings.rushPriority}
                                        onCheckedChange={(checked) => setSettings({ ...settings, rushPriority: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <Label>Auto-Notify Dealer</Label>
                                        <p className="text-xs text-muted-foreground">Send notification when order is completed</p>
                                    </div>
                                    <Switch
                                        checked={settings.autoNotifyDealer}
                                        onCheckedChange={(checked) => setSettings({ ...settings, autoNotifyDealer: checked })}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveSettings}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Settings
                            </Button>
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
                                            activity.action.includes('Alert') ? 'bg-red-100' :
                                                activity.action.includes('Rush') ? 'bg-orange-100' :
                                                    activity.action.includes('Batch') ? 'bg-purple-100' :
                                                        'bg-muted'
                                            }`}>
                                            {activity.action.includes('Completed') ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                                                activity.action.includes('Alert') ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                                                    activity.action.includes('Rush') ? <AlertTriangle className="h-4 w-4 text-orange-600" /> :
                                                        activity.action.includes('Batch') ? <Layers className="h-4 w-4 text-purple-600" /> :
                                                            <Activity className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{activity.action}</p>
                                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{activity.details}</p>
                                            <p className="text-xs text-muted-foreground mt-1">By: {activity.member}</p>
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

export default SealTeamManagement;
