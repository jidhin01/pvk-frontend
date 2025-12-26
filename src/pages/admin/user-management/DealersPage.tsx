import React, { useState } from 'react';
import {
    Store, Search, Plus, MoreVertical, Mail, Phone,
    UserCheck, UserX, Edit, Eye, Users, ShoppingCart, Navigation, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ROUTES = [
    { id: 'north_route', label: 'North Route', color: 'bg-blue-100 text-blue-700' },
    { id: 'city_center', label: 'City Center', color: 'bg-purple-100 text-purple-700' },
    { id: 'south_zone', label: 'South Zone', color: 'bg-green-100 text-green-700' },
];

const MOCK_DEALERS = [
    { id: '1', name: 'ABC Prints', email: 'abc@prints.com', phone: '+91 98765 43217', status: 'active', route: 'city_center', company: 'ABC Prints Pvt Ltd', ordersThisMonth: 45, totalRevenue: 125000, approvalStatus: 'approved' },
    { id: '2', name: 'Star Graphics', email: 'star@graphics.com', phone: '+91 98765 43233', status: 'active', route: 'north_route', company: 'Star Graphics & Sons', ordersThisMonth: 38, totalRevenue: 98000, approvalStatus: 'approved' },
    { id: '3', name: 'Metro Ads', email: 'metro@ads.com', phone: '+91 98765 43234', status: 'active', route: 'south_zone', company: 'Metro Ads Agency', ordersThisMonth: 25, totalRevenue: 65000, approvalStatus: 'approved' },
    { id: '4', name: 'Fresh Prints', email: 'fresh@prints.com', phone: '+91 98765 43235', status: 'inactive', route: 'city_center', company: 'Fresh Prints Co', ordersThisMonth: 0, totalRevenue: 0, approvalStatus: 'pending' },
];

const DealersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filtered = MOCK_DEALERS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (statusFilter === 'all' || d.status === statusFilter);
    });

    const total = MOCK_DEALERS.length;
    const active = MOCK_DEALERS.filter(d => d.status === 'active').length;
    const approved = MOCK_DEALERS.filter(d => d.approvalStatus === 'approved').length;

    const getRouteBadge = (routeId: string) => {
        const route = ROUTES.find(r => r.id === routeId);
        return route ? <Badge className={`${route.color} border-0`}><Navigation className="h-3 w-3 mr-1" />{route.label}</Badge> : null;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <Store className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dealers</h1>
                        <p className="text-muted-foreground">Manage registered dealer accounts</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Dealer</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Dealer</DialogTitle><DialogDescription>Register a new dealer</DialogDescription></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Business Name</Label><Input placeholder="Enter business name" /></div>
                            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Enter email" /></div>
                            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
                            <div className="space-y-2"><Label>Assigned Route</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                                    <SelectContent>{ROUTES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Dealer registered'); setIsAddModalOpen(false); }}>Register</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{active}/{total}</div><p className="text-xs text-muted-foreground">Active Dealers</p></div><Users className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-green-600">{approved}</div><p className="text-xs text-muted-foreground">Approved</p></div><CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-blue-600">{MOCK_DEALERS.reduce((s, d) => s + d.ordersThisMonth, 0)}</div><p className="text-xs text-muted-foreground">Orders This Month</p></div><ShoppingCart className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-emerald-600">₹{(MOCK_DEALERS.reduce((s, d) => s + d.totalRevenue, 0) / 1000).toFixed(0)}K</div><p className="text-xs text-muted-foreground">Total Revenue</p></div><Store className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search dealers..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                <div className="flex gap-2">
                    <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All ({total})</Button>
                    <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active ({active})</Button>
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((d) => (
                    <Card key={d.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Store className="h-6 w-6 text-emerald-600" /></div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{d.name}</p>
                                            <Badge className="bg-emerald-100 text-emerald-700">Dealer</Badge>
                                            {getRouteBadge(d.route)}
                                            <Badge variant="outline" className={d.status === 'active' ? 'text-green-600 border-green-300' : 'text-orange-500 border-orange-300'}>{d.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground"><span>{d.company}</span><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{d.email}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block"><p className="text-sm font-semibold">{d.ordersThisMonth} orders</p><p className="text-xs text-muted-foreground">₹{(d.totalRevenue / 1000).toFixed(0)}K revenue</p></div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                            <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className={d.status === 'active' ? 'text-orange-600' : 'text-green-600'}>{d.status === 'active' ? <><UserX className="h-4 w-4 mr-2" />Deactivate</> : <><UserCheck className="h-4 w-4 mr-2" />Activate</>}</DropdownMenuItem>
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

export default DealersPage;
