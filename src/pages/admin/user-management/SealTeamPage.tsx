import React, { useState } from 'react';
import {
    Stamp, Search, Plus, MoreVertical, Mail, Phone,
    UserCheck, UserX, Edit, Eye, Users, CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const MOCK_SEAL_TEAM = [
    { id: '1', name: 'Kumar Seal', email: 'kumar@pvk.com', phone: '+91 98765 43216', status: 'active', completedToday: 18, inProduction: 5, earnings: 1250 },
    { id: '2', name: 'Ravi Seal', email: 'ravi.seal@pvk.com', phone: '+91 98765 43229', status: 'active', completedToday: 12, inProduction: 3, earnings: 980 },
    { id: '3', name: 'Anita Seal', email: 'anita.seal@pvk.com', phone: '+91 98765 43230', status: 'inactive', completedToday: 0, inProduction: 0, earnings: 0 },
];

const SealTeamPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filtered = MOCK_SEAL_TEAM.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (statusFilter === 'all' || m.status === statusFilter);
    });

    const total = MOCK_SEAL_TEAM.length;
    const active = MOCK_SEAL_TEAM.filter(m => m.status === 'active').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <Stamp className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Seal Team</h1>
                        <p className="text-muted-foreground">Manage rubber seal production staff</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Member</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Seal Team Member</DialogTitle><DialogDescription>Create a new account</DialogDescription></DialogHeader>
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
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-green-600">{MOCK_SEAL_TEAM.reduce((s, m) => s + m.completedToday, 0)}</div><p className="text-xs text-muted-foreground">Completed Today</p></div><CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-orange-600">{MOCK_SEAL_TEAM.reduce((s, m) => s + m.inProduction, 0)}</div><p className="text-xs text-muted-foreground">In Production</p></div><Clock className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-indigo-600">₹{MOCK_SEAL_TEAM.reduce((s, m) => s + m.earnings, 0).toLocaleString()}</div><p className="text-xs text-muted-foreground">Total Earnings</p></div><DollarSign className="h-8 w-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
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
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Stamp className="h-6 w-6 text-indigo-600" /></div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{m.name}</p>
                                            <Badge className="bg-indigo-100 text-indigo-700">Seal Team</Badge>
                                            <Badge variant="outline" className={m.status === 'active' ? 'text-green-600 border-green-300' : 'text-orange-500 border-orange-300'}>{m.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</span><span className="hidden sm:flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block"><p className="text-sm font-semibold">{m.completedToday} seals today</p><p className="text-xs text-muted-foreground">{m.inProduction} in production • ₹{m.earnings}</p></div>
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

export default SealTeamPage;
