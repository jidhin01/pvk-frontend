import React, { useState } from 'react';
import {
    Crown,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    UserCheck,
    UserX,
    Edit,
    Eye,
    Users
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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock Managers Data
const MOCK_MANAGERS = [
    {
        id: '1',
        name: 'Vikram Manager',
        email: 'vikram@pvk.com',
        phone: '+91 98765 43218',
        status: 'active',
        joinedAt: '2024-01-01',
        usersCreated: 45,
        dealersApproved: 12
    },
    {
        id: '2',
        name: 'Sunita Manager',
        email: 'sunita@pvk.com',
        phone: '+91 98765 43220',
        status: 'active',
        joinedAt: '2024-02-15',
        usersCreated: 32,
        dealersApproved: 8
    },
    {
        id: '3',
        name: 'Anil Manager',
        email: 'anil@pvk.com',
        phone: '+91 98765 43221',
        status: 'inactive',
        joinedAt: '2023-11-20',
        usersCreated: 28,
        dealersApproved: 5
    },
];

const ManagersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredManagers = MOCK_MANAGERS.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalManagers = MOCK_MANAGERS.length;
    const activeManagers = MOCK_MANAGERS.filter(m => m.status === 'active').length;
    const inactiveManagers = MOCK_MANAGERS.filter(m => m.status === 'inactive').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Crown className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Managers</h1>
                        <p className="text-muted-foreground">Manage manager accounts and permissions</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Manager
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Manager</DialogTitle>
                            <DialogDescription>Create a new manager account</DialogDescription>
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
                                <Label>Password</Label>
                                <Input type="password" placeholder="Enter password" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Manager created'); setIsAddModalOpen(false); }}>
                                Create Manager
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-3">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{totalManagers}</div>
                                <p className="text-xs text-muted-foreground">Total Managers</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{activeManagers}</div>
                                <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-600">{inactiveManagers}</div>
                                <p className="text-xs text-muted-foreground">Inactive</p>
                            </div>
                            <UserX className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search managers..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({totalManagers})
                    </Button>
                    <Button
                        variant={statusFilter === 'active' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('active')}
                    >
                        Active ({activeManagers})
                    </Button>
                    <Button
                        variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('inactive')}
                    >
                        Inactive ({inactiveManagers})
                    </Button>
                </div>
            </div>

            {/* Managers List */}
            <div className="space-y-3">
                {filteredManagers.map((manager) => (
                    <Card key={manager.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <Crown className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{manager.name}</p>
                                            <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                                                Manager
                                            </Badge>
                                            {manager.status === 'active' ? (
                                                <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {manager.email}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {manager.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-semibold">{manager.usersCreated} users created</p>
                                        <p className="text-xs text-muted-foreground">
                                            {manager.dealersApproved} dealers approved
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
                                            {manager.status === 'active' ? (
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

export default ManagersPage;
