import React, { useState } from 'react';
import {
    Palette,
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
    CreditCard,
    FileImage,
    CheckCircle
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

// Mock Designers Data
const MOCK_DESIGNERS = [
    {
        id: '1',
        name: 'John Designer',
        email: 'john@pvk.com',
        phone: '+91 98765 43210',
        status: 'active',
        designerType: 'normal',
        joinedAt: '2024-01-15',
        completedToday: 12,
        activeJobs: 2,
        earnings: 725
    },
    {
        id: '2',
        name: 'Anu Designer',
        email: 'anu@pvk.com',
        phone: '+91 98765 43211',
        status: 'active',
        designerType: 'normal',
        joinedAt: '2024-02-20',
        completedToday: 8,
        activeJobs: 1,
        earnings: 610
    },
    {
        id: '3',
        name: 'Deepa PVC Designer',
        email: 'deepa@pvk.com',
        phone: '+91 98765 43212',
        status: 'active',
        designerType: 'pvc_card',
        joinedAt: '2024-03-10',
        completedToday: 15,
        activeJobs: 3,
        earnings: 640
    },
    {
        id: '4',
        name: 'Arun PVC Designer',
        email: 'arun@pvk.com',
        phone: '+91 98765 43219',
        status: 'active',
        designerType: 'pvc_card',
        joinedAt: '2024-06-01',
        completedToday: 10,
        activeJobs: 2,
        earnings: 500
    },
    {
        id: '5',
        name: 'Priya Designer',
        email: 'priya@pvk.com',
        phone: '+91 98765 43214',
        status: 'inactive',
        designerType: 'normal',
        joinedAt: '2024-04-05',
        completedToday: 0,
        activeJobs: 0,
        earnings: 0
    },
];

const DesignersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'normal' | 'pvc_card'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDesignerType, setNewDesignerType] = useState<'normal' | 'pvc_card'>('normal');

    const filteredDesigners = MOCK_DESIGNERS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
        const matchesType = typeFilter === 'all' || d.designerType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const totalDesigners = MOCK_DESIGNERS.length;
    const activeDesigners = MOCK_DESIGNERS.filter(d => d.status === 'active').length;
    const normalDesigners = MOCK_DESIGNERS.filter(d => d.designerType === 'normal').length;
    const pvcDesigners = MOCK_DESIGNERS.filter(d => d.designerType === 'pvc_card').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                        <Palette className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Designers</h1>
                        <p className="text-muted-foreground">Manage designer accounts and assignments</p>
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
                                <Select value={newDesignerType} onValueChange={(v) => setNewDesignerType(v as 'normal' | 'pvc_card')}>
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
                                        <SelectItem value="pvc_card">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                PVC Card Designer
                                            </div>
                                        </SelectItem>
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
                                <div className="text-2xl font-bold text-emerald-600">{normalDesigners}</div>
                                <p className="text-xs text-muted-foreground">Normal Designers</p>
                            </div>
                            <FileImage className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-purple-600">{pvcDesigners}</div>
                                <p className="text-xs text-muted-foreground">PVC Card Designers</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {MOCK_DESIGNERS.reduce((sum, d) => sum + d.completedToday, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">Completed Today</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                <div className="flex gap-2 flex-wrap">
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
                        variant={typeFilter === 'pvc_card' ? 'default' : 'outline'}
                        onClick={() => setTypeFilter('pvc_card')}
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
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${designer.designerType === 'pvc_card'
                                        ? 'bg-purple-100 dark:bg-purple-900/30'
                                        : 'bg-emerald-100 dark:bg-emerald-900/30'
                                        }`}>
                                        {designer.designerType === 'pvc_card' ? (
                                            <CreditCard className="h-6 w-6 text-purple-600" />
                                        ) : (
                                            <FileImage className="h-6 w-6 text-emerald-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{designer.name}</p>
                                            <Badge className={designer.designerType === 'pvc_card'
                                                ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                            }>
                                                {designer.designerType === 'pvc_card' ? 'PVC Designer' : 'Normal Designer'}
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
                                            {designer.activeJobs} active • ₹{designer.earnings} earned
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
        </div>
    );
};

export default DesignersPage;
