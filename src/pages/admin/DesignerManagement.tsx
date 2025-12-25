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
    Palette,
    Layers,
    FolderOpen,
    Eye,
    Star,
    CreditCard,
    FileImage,
    AlertTriangle,
    TrendingUp,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight
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

// Mock Designers Data
const MOCK_DESIGNERS = [
    {
        id: '1',
        name: 'Anu Designer',
        email: 'anu@pvk.com',
        phone: '+91 98765 43210',
        status: 'active',
        type: 'normal',
        completedToday: 12,
        completedWeek: 58,
        activeJobs: 2,
        earnings: 725,
        fines: 50
    },
    {
        id: '2',
        name: 'Ravi Designer',
        email: 'ravi@pvk.com',
        phone: '+91 98765 43211',
        status: 'active',
        type: 'normal',
        completedToday: 8,
        completedWeek: 42,
        activeJobs: 1,
        earnings: 610,
        fines: 0
    },
    {
        id: '3',
        name: 'Deepa PVC Designer',
        email: 'deepa@pvk.com',
        phone: '+91 98765 43212',
        status: 'active',
        type: 'pvc',
        completedToday: 15,
        completedWeek: 68,
        activeJobs: 3,
        earnings: 640,
        fines: 100
    },
    {
        id: '4',
        name: 'Manoj PVC Designer',
        email: 'manoj@pvk.com',
        phone: '+91 98765 43213',
        status: 'active',
        type: 'pvc',
        completedToday: 10,
        completedWeek: 45,
        activeJobs: 2,
        earnings: 500,
        fines: 0
    },
    {
        id: '5',
        name: 'Priya Designer',
        email: 'priya@pvk.com',
        phone: '+91 98765 43214',
        status: 'inactive',
        type: 'normal',
        completedToday: 0,
        completedWeek: 25,
        activeJobs: 0,
        earnings: 0,
        fines: 0
    },
];

// Mock Work Pool Data
const MOCK_WORK_POOL = [
    { id: 'JOB-301', dealer: 'Star Graphics', category: 'poster', status: 'unassigned', priority: 'urgent', createdAt: '10 min ago' },
    { id: 'JOB-302', dealer: 'Fresh Prints', category: 'brochure', status: 'unassigned', priority: 'normal', createdAt: '25 min ago' },
    { id: 'JOB-303', dealer: 'Metro Ads', category: 'price-tag', status: 'assigned', priority: 'normal', createdAt: '30 min ago', assignedTo: 'Anu Designer' },
    { id: 'JOB-401', dealer: 'ID Solutions', category: 'pvc-card', status: 'unassigned', priority: 'urgent', createdAt: '15 min ago' },
    { id: 'JOB-402', dealer: 'Card Pro', category: 'pvc-card', status: 'assigned', priority: 'normal', createdAt: '40 min ago', assignedTo: 'Deepa PVC Designer' },
    { id: 'JOB-304', dealer: 'Alpha Designs', category: 'flex-banner', status: 'unassigned', priority: 'urgent', createdAt: '5 min ago' },
];

// Mock Completed Works
const MOCK_COMPLETED = [
    { id: 'JOB-295', designer: 'Anu Designer', dealer: 'Star Graphics', category: 'poster', completedAt: '30 min ago', status: 'sent-to-print' },
    { id: 'JOB-294', designer: 'Ravi Designer', dealer: 'Fresh Prints', category: 'brochure', completedAt: '2h ago', status: 'printed' },
    { id: 'JOB-395', designer: 'Deepa PVC Designer', dealer: 'ID Solutions', category: 'pvc-card', completedAt: '45 min ago', status: 'delivered' },
    { id: 'JOB-293', designer: 'Anu Designer', dealer: 'Metro Ads', category: 'price-tag', completedAt: '4h ago', status: 'delivered' },
    { id: 'JOB-394', designer: 'Manoj PVC Designer', dealer: 'Card Pro', category: 'pvc-card', completedAt: '3h ago', status: 'printed' },
];

// Mock Earnings Data
const MOCK_EARNINGS = [
    { id: 'TXN-020', date: '2025-12-25', designer: 'Anu Designer', type: 'Design', amount: 5, ref: 'JOB-295' },
    { id: 'TXN-019', date: '2025-12-25', designer: 'Ravi Designer', type: 'Design', amount: 5, ref: 'JOB-294' },
    { id: 'TXN-018', date: '2025-12-25', designer: 'Deepa PVC Designer', type: 'Design', amount: 5, ref: 'JOB-395' },
    { id: 'TXN-017', date: '2025-12-25', designer: 'Anu Designer', type: 'Fine', amount: -50, ref: 'Error in JOB-285' },
    { id: 'TXN-016', date: '2025-12-24', designer: 'Manoj PVC Designer', type: 'Design', amount: 5, ref: 'JOB-394' },
    { id: 'TXN-015', date: '2025-12-24', designer: 'Deepa PVC Designer', type: 'Fine', amount: -50, ref: 'Error in JOB-380' },
];

// Mock Activity Data
const MOCK_ACTIVITY = [
    { id: '1', action: 'Job Completed', designer: 'Anu Designer', details: 'Completed JOB-295 for Star Graphics', time: '30 min ago' },
    { id: '2', action: 'Job Taken', designer: 'Ravi Designer', details: 'Picked up JOB-302 from pool', time: '45 min ago' },
    { id: '3', action: 'Fine Applied', designer: 'Deepa PVC Designer', details: '₹50 fine for mistake in JOB-380', time: '1h ago' },
    { id: '4', action: 'Job Completed', designer: 'Manoj PVC Designer', details: 'Completed JOB-394 for Card Pro', time: '3h ago' },
    { id: '5', action: 'Designer Added', designer: 'Priya Designer', details: 'New designer joined as Normal Designer', time: '1d ago' },
];

const DesignerManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'normal' | 'pvc'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDesignerType, setNewDesignerType] = useState<'normal' | 'pvc'>('normal');

    // Settings state
    const [settings, setSettings] = useState({
        earningsPerDesign: 5,
        finePerMistake: 50,
        autoAssignJobs: true,
        attentionAlertMinutes: 120,
        maxActiveJobs: 3,
        batchSize: 5,
    });

    // Filter designers
    const filteredDesigners = MOCK_DESIGNERS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || d.type === typeFilter;
        return matchesSearch && matchesType;
    });

    // Stats
    const totalDesigners = MOCK_DESIGNERS.length;
    const activeDesigners = MOCK_DESIGNERS.filter(d => d.status === 'active').length;
    const normalDesigners = MOCK_DESIGNERS.filter(d => d.type === 'normal').length;
    const pvcDesigners = MOCK_DESIGNERS.filter(d => d.type === 'pvc').length;
    const totalCompletedToday = MOCK_DESIGNERS.reduce((sum, d) => sum + d.completedToday, 0);
    const totalEarningsToday = MOCK_DESIGNERS.reduce((sum, d) => sum + d.earnings, 0);
    const totalFines = MOCK_DESIGNERS.reduce((sum, d) => sum + d.fines, 0);
    const pendingJobs = MOCK_WORK_POOL.filter(j => j.status === 'unassigned').length;

    const handleSaveSettings = () => {
        toast.success('Designer settings saved successfully');
    };

    const getCategoryBadge = (category: string) => {
        if (category === 'pvc-card' || category === 'id-card') {
            return <Badge className="bg-purple-100 text-purple-700">PVC Card</Badge>;
        }
        const labels: Record<string, string> = {
            'poster': 'Poster',
            'brochure': 'Brochure',
            'price-tag': 'Price Tag',
            'flex-banner': 'Flex Banner',
        };
        return <Badge variant="secondary">{labels[category] || category}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'unassigned':
                return <Badge className="bg-orange-100 text-orange-700">Unassigned</Badge>;
            case 'assigned':
                return <Badge className="bg-blue-100 text-blue-700">Assigned</Badge>;
            case 'sent-to-print':
                return <Badge className="bg-yellow-100 text-yellow-700">Sent to Print</Badge>;
            case 'printed':
                return <Badge className="bg-purple-100 text-purple-700">Printed</Badge>;
            case 'delivered':
                return <Badge className="bg-green-100 text-green-700">Delivered</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                        <Palette className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Designer Management</h1>
                        <p className="text-muted-foreground">Manage designers, work pool, and earnings</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Designer
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Designer</DialogTitle>
                            <DialogDescription>Create a new designer account</DialogDescription>
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
                                <Label>Designer Type</Label>
                                <Select value={newDesignerType} onValueChange={(v) => setNewDesignerType(v as 'normal' | 'pvc')}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">
                                            <div className="flex items-center gap-2">
                                                <FileImage className="h-4 w-4" />
                                                Normal Designer
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="pvc">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                PVC Card Designer
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Designer created'); setIsAddModalOpen(false); }}>
                                Create Designer
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
                                <div className="text-2xl font-bold">{activeDesigners}/{totalDesigners}</div>
                                <p className="text-xs text-muted-foreground">Active Designers</p>
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
                                <div className="text-2xl font-bold">₹{totalEarningsToday - totalFines}</div>
                                <p className="text-xs text-muted-foreground">Net Earnings Today</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-600">{pendingJobs}</div>
                                <p className="text-xs text-muted-foreground">Pending in Pool</p>
                            </div>
                            <Layers className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 h-14 p-1">
                    <TabsTrigger value="members" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Members</span>
                    </TabsTrigger>
                    <TabsTrigger value="work-pool" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Layers className="h-4 w-4" />
                        <span className="hidden sm:inline">Work Pool</span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <FolderOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Completed</span>
                    </TabsTrigger>
                    <TabsTrigger value="earnings" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="hidden sm:inline">Earnings</span>
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
                                placeholder="Search designers..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={typeFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setTypeFilter('all')}
                            >
                                All ({totalDesigners})
                            </Button>
                            <Button
                                variant={typeFilter === 'normal' ? 'default' : 'outline'}
                                onClick={() => setTypeFilter('normal')}
                                className="gap-2"
                            >
                                <FileImage className="h-4 w-4" />
                                Normal ({normalDesigners})
                            </Button>
                            <Button
                                variant={typeFilter === 'pvc' ? 'default' : 'outline'}
                                onClick={() => setTypeFilter('pvc')}
                                className="gap-2"
                            >
                                <CreditCard className="h-4 w-4" />
                                PVC ({pvcDesigners})
                            </Button>
                        </div>
                    </div>

                    {/* Designers List */}
                    <div className="space-y-3">
                        {filteredDesigners.map((designer) => (
                            <Card key={designer.id} className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium ${designer.type === 'pvc'
                                                ? 'bg-purple-100 text-purple-600'
                                                : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                {designer.type === 'pvc' ? (
                                                    <CreditCard className="h-6 w-6" />
                                                ) : (
                                                    <FileImage className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold">{designer.name}</p>
                                                    <Badge className={designer.type === 'pvc'
                                                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                        : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                                    }>
                                                        {designer.type === 'pvc' ? 'PVC Designer' : 'Normal Designer'}
                                                    </Badge>
                                                    {designer.status === 'active' ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {designer.email}
                                                    </span>
                                                    <span className="hidden sm:flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {designer.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    {designer.completedToday} today
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {designer.activeJobs} active • ₹{designer.earnings - designer.fines} earned
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
                                                    {designer.status === 'active' ? (
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

                {/* Work Pool Tab */}
                <TabsContent value="work-pool" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Current Work Pool</h3>
                            <p className="text-sm text-muted-foreground">{MOCK_WORK_POOL.length} total jobs, {pendingJobs} unassigned</p>
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {MOCK_WORK_POOL.map((job) => (
                            <Card key={job.id} className={job.priority === 'urgent' ? 'border-orange-300 bg-orange-50/50' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="font-semibold">{job.id}</span>
                                                {job.priority === 'urgent' && (
                                                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{job.dealer}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getCategoryBadge(job.category)}
                                                    {getStatusBadge(job.status)}
                                                    <span className="text-xs text-muted-foreground">{job.createdAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {job.assignedTo && (
                                                <Badge variant="outline" className="text-xs">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {job.assignedTo}
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
                                                        Assign to Designer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                                        Mark as Urgent
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
                            <h3 className="text-lg font-semibold">Completed Works</h3>
                            <p className="text-sm text-muted-foreground">{MOCK_COMPLETED.length} works completed today</p>
                        </div>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {MOCK_COMPLETED.map((work) => (
                            <Card key={work.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{work.id}</span>
                                                    {getCategoryBadge(work.category)}
                                                    {getStatusBadge(work.status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {work.dealer} • Completed by <span className="font-medium">{work.designer}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">{work.completedAt}</span>
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

                {/* Earnings Tab */}
                <TabsContent value="earnings" className="space-y-4">
                    <div className="grid gap-4 grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹{totalEarningsToday}</div>
                                <p className="text-xs text-muted-foreground">{totalCompletedToday} designs × ₹{settings.earningsPerDesign}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">₹{totalFines}</div>
                                <p className="text-xs text-muted-foreground">{Math.ceil(totalFines / settings.finePerMistake)} mistake(s)</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Net Payout</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{totalEarningsToday - totalFines}</div>
                                <p className="text-xs text-muted-foreground">To be paid today</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Transaction History</CardTitle>
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
                                        <TableHead>Designer</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_EARNINGS.map((txn) => (
                                        <TableRow key={txn.id}>
                                            <TableCell>{txn.date}</TableCell>
                                            <TableCell className="font-medium">{txn.designer}</TableCell>
                                            <TableCell>
                                                <Badge variant={txn.amount > 0 ? 'secondary' : 'destructive'} className={txn.amount > 0 ? 'bg-green-100 text-green-700' : ''}>
                                                    {txn.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{txn.ref}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-semibold flex items-center justify-end gap-1 ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {txn.amount > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                                                    ₹{Math.abs(txn.amount)}
                                                </span>
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
                            <CardTitle>Designer Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Earnings per Design (₹)</Label>
                                    <Input
                                        type="number"
                                        value={settings.earningsPerDesign}
                                        onChange={(e) => setSettings({ ...settings, earningsPerDesign: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fine per Mistake (₹)</Label>
                                    <Input
                                        type="number"
                                        value={settings.finePerMistake}
                                        onChange={(e) => setSettings({ ...settings, finePerMistake: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Attention Alert (Minutes)</Label>
                                    <Input
                                        type="number"
                                        value={settings.attentionAlertMinutes}
                                        onChange={(e) => setSettings({ ...settings, attentionAlertMinutes: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max Active Jobs</Label>
                                    <Input
                                        type="number"
                                        value={settings.maxActiveJobs}
                                        onChange={(e) => setSettings({ ...settings, maxActiveJobs: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Batch Size for Print</Label>
                                    <Input
                                        type="number"
                                        value={settings.batchSize}
                                        onChange={(e) => setSettings({ ...settings, batchSize: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Auto-Assign Jobs</Label>
                                    <p className="text-xs text-muted-foreground">Automatically assign jobs from pool to available designers</p>
                                </div>
                                <Switch
                                    checked={settings.autoAssignJobs}
                                    onCheckedChange={(checked) => setSettings({ ...settings, autoAssignJobs: checked })}
                                />
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
                                            activity.action.includes('Fine') ? 'bg-red-100' :
                                                activity.action.includes('Added') ? 'bg-blue-100' :
                                                    'bg-muted'
                                            }`}>
                                            {activity.action.includes('Completed') ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                                                activity.action.includes('Fine') ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                                                    activity.action.includes('Added') ? <Plus className="h-4 w-4 text-blue-600" /> :
                                                        <Activity className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{activity.action}</p>
                                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{activity.designer}</p>
                                            <p className="text-sm">{activity.details}</p>
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

export default DesignerManagement;
