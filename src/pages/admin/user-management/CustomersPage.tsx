import React, { useState } from 'react';
import {
    UserCircle, Search, Plus, MoreVertical, Mail, Phone,
    UserCheck, UserX, Edit, Eye, Users, ShoppingCart, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const MOCK_CUSTOMERS = [
    { id: '1', name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '+91 98765 43236', status: 'active', totalOrders: 12, lastOrder: '2 days ago', totalSpent: 8500 },
    { id: '2', name: 'Priya Sharma', email: 'priya.s@gmail.com', phone: '+91 98765 43237', status: 'active', totalOrders: 8, lastOrder: '1 week ago', totalSpent: 5600 },
    { id: '3', name: 'Arjun Singh', email: 'arjun@email.com', phone: '+91 98765 43238', status: 'active', totalOrders: 5, lastOrder: '3 days ago', totalSpent: 3200 },
    { id: '4', name: 'Meera Patel', email: 'meera.p@gmail.com', phone: '+91 98765 43239', status: 'inactive', totalOrders: 2, lastOrder: '1 month ago', totalSpent: 1200 },
];

const CustomersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filtered = MOCK_CUSTOMERS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (statusFilter === 'all' || c.status === statusFilter);
    });

    const total = MOCK_CUSTOMERS.length;
    const active = MOCK_CUSTOMERS.filter(c => c.status === 'active').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <UserCircle className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                        <p className="text-muted-foreground">Manage registered customer accounts</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Customer</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Customer</DialogTitle><DialogDescription>Register a new customer</DialogDescription></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter full name" /></div>
                            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Enter email" /></div>
                            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
                            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Enter password" /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Customer registered'); setIsAddModalOpen(false); }}>Register</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{active}/{total}</div><p className="text-xs text-muted-foreground">Active Customers</p></div><Users className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-blue-600">{MOCK_CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0)}</div><p className="text-xs text-muted-foreground">Total Orders</p></div><ShoppingCart className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-green-600">₹{MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div><p className="text-xs text-muted-foreground">Total Revenue</p></div><UserCircle className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-purple-600">₹{Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / total)}</div><p className="text-xs text-muted-foreground">Avg. per Customer</p></div><Calendar className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search customers..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                <div className="flex gap-2">
                    <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All ({total})</Button>
                    <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active ({active})</Button>
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((c) => (
                    <Card key={c.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><UserCircle className="h-6 w-6 text-slate-600" /></div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{c.name}</p>
                                            <Badge className="bg-slate-100 text-slate-700">Customer</Badge>
                                            <Badge variant="outline" className={c.status === 'active' ? 'text-green-600 border-green-300' : 'text-orange-500 border-orange-300'}>{c.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span><span className="hidden sm:flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block"><p className="text-sm font-semibold">{c.totalOrders} orders</p><p className="text-xs text-muted-foreground">Last: {c.lastOrder} • ₹{c.totalSpent.toLocaleString()}</p></div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                            <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className={c.status === 'active' ? 'text-orange-600' : 'text-green-600'}>{c.status === 'active' ? <><UserX className="h-4 w-4 mr-2" />Deactivate</> : <><UserCheck className="h-4 w-4 mr-2" />Activate</>}</DropdownMenuItem>
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

export default CustomersPage;
