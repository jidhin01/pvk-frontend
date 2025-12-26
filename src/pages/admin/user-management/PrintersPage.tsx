import React, { useState } from 'react';
import {
    Printer,
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
    CheckCircle,
    Clock
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

// Mock Printers Data
const MOCK_PRINTERS = [
    {
        id: '1',
        name: 'Priya Printer',
        email: 'priya@pvk.com',
        phone: '+91 98765 43211',
        status: 'active',
        joinedAt: '2024-02-20',
        printedToday: 45,
        inQueue: 12,
        completionRate: 95
    },
    {
        id: '2',
        name: 'Suresh Printer',
        email: 'suresh.printer@pvk.com',
        phone: '+91 98765 43222',
        status: 'active',
        joinedAt: '2024-03-15',
        printedToday: 38,
        inQueue: 8,
        completionRate: 92
    },
    {
        id: '3',
        name: 'Ramesh Printer',
        email: 'ramesh@pvk.com',
        phone: '+91 98765 43223',
        status: 'inactive',
        joinedAt: '2024-01-10',
        printedToday: 0,
        inQueue: 0,
        completionRate: 88
    },
];

const PrintersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredPrinters = MOCK_PRINTERS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPrinters = MOCK_PRINTERS.length;
    const activePrinters = MOCK_PRINTERS.filter(p => p.status === 'active').length;
    const inactivePrinters = MOCK_PRINTERS.filter(p => p.status === 'inactive').length;
    const totalPrintedToday = MOCK_PRINTERS.reduce((sum, p) => sum + p.printedToday, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Printer className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Printers</h1>
                        <p className="text-muted-foreground">Manage printer operator accounts</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Printer
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Printer</DialogTitle>
                            <DialogDescription>Create a new printer operator account</DialogDescription>
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
                            <Button onClick={() => { toast.success('Printer operator created'); setIsAddModalOpen(false); }}>
                                Create Printer
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
                                <div className="text-2xl font-bold">{activePrinters}/{totalPrinters}</div>
                                <p className="text-xs text-muted-foreground">Active Printers</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{totalPrintedToday}</div>
                                <p className="text-xs text-muted-foreground">Printed Today</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {MOCK_PRINTERS.reduce((sum, p) => sum + p.inQueue, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">In Queue</p>
                            </div>
                            <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Math.round(MOCK_PRINTERS.filter(p => p.status === 'active').reduce((sum, p) => sum + p.completionRate, 0) / activePrinters)}%
                                </div>
                                <p className="text-xs text-muted-foreground">Avg Completion Rate</p>
                            </div>
                            <Printer className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search printers..."
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
                        All ({totalPrinters})
                    </Button>
                    <Button
                        variant={statusFilter === 'active' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('active')}
                    >
                        Active ({activePrinters})
                    </Button>
                    <Button
                        variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('inactive')}
                    >
                        Inactive ({inactivePrinters})
                    </Button>
                </div>
            </div>

            {/* Printers List */}
            <div className="space-y-3">
                {filteredPrinters.map((printer) => (
                    <Card key={printer.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Printer className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{printer.name}</p>
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                                Printer Operator
                                            </Badge>
                                            {printer.status === 'active' ? (
                                                <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {printer.email}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {printer.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            {printer.printedToday} printed today
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {printer.inQueue} in queue • {printer.completionRate}% rate
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
                                            {printer.status === 'active' ? (
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

export default PrintersPage;
