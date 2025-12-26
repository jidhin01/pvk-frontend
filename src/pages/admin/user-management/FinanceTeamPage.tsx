import React, { useState } from 'react';
import {
    Wallet, Search, Plus, MoreVertical, Mail, Phone,
    UserCheck, UserX, Edit, Eye, Users, Receipt, TrendingUp, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const MOCK_FINANCE_TEAM = [
    { id: '1', name: 'Anita Finance', email: 'anita@pvk.com', phone: '+91 98765 43213', status: 'active', txnsToday: 45, pendingReviews: 8, revenueProcessed: 125000 },
    { id: '2', name: 'Krishna Finance', email: 'krishna.fin@pvk.com', phone: '+91 98765 43231', status: 'active', txnsToday: 38, pendingReviews: 5, revenueProcessed: 98000 },
    { id: '3', name: 'Saritha Finance', email: 'saritha@pvk.com', phone: '+91 98765 43232', status: 'inactive', txnsToday: 0, pendingReviews: 0, revenueProcessed: 0 },
];

const FinanceTeamPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filtered = MOCK_FINANCE_TEAM.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (statusFilter === 'all' || m.status === statusFilter);
    });

    const total = MOCK_FINANCE_TEAM.length;
    const active = MOCK_FINANCE_TEAM.filter(m => m.status === 'active').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                        <Wallet className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Finance Team</h1>
                        <p className="text-muted-foreground">Manage finance and accounting staff</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Member</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Finance Team Member</DialogTitle><DialogDescription>Create a new account</DialogDescription></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter full name" /></div>
                            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Enter email" /></div>
                            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
                            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Enter password" /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Member created'); setIsAddModalOpen(false); }}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{active}/{total}</div><p className="text-xs text-muted-foreground">Active Members</p></div><Users className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-green-600">{MOCK_FINANCE_TEAM.reduce((s, m) => s + m.txnsToday, 0)}</div><p className="text-xs text-muted-foreground">Transactions Today</p></div><Receipt className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-orange-600">{MOCK_FINANCE_TEAM.reduce((s, m) => s + m.pendingReviews, 0)}</div><p className="text-xs text-muted-foreground">Pending Reviews</p></div><Clock className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-yellow-600">₹{(MOCK_FINANCE_TEAM.reduce((s, m) => s + m.revenueProcessed, 0) / 1000).toFixed(0)}K</div><p className="text-xs text-muted-foreground">Revenue Processed</p></div><TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                <div className="flex gap-2">
                    <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All ({total})</Button>
                    <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active ({active})</Button>
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((m) => (
                    <Card key={m.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center"><Wallet className="h-6 w-6 text-yellow-600" /></div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{m.name}</p>
                                            <Badge className="bg-yellow-100 text-yellow-700">Finance</Badge>
                                            <Badge variant="outline" className={m.status === 'active' ? 'text-green-600 border-green-300' : 'text-orange-500 border-orange-300'}>{m.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</span><span className="hidden sm:flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block"><p className="text-sm font-semibold">{m.txnsToday} transactions</p><p className="text-xs text-muted-foreground">{m.pendingReviews} pending • ₹{(m.revenueProcessed / 1000).toFixed(0)}K processed</p></div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                            <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className={m.status === 'active' ? 'text-orange-600' : 'text-green-600'}>{m.status === 'active' ? <><UserX className="h-4 w-4 mr-2" />Deactivate</> : <><UserCheck className="h-4 w-4 mr-2" />Activate</>}</DropdownMenuItem>
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

export default FinanceTeamPage;
