import React, { useState } from 'react';
import {
    Store,
    UserCircle,
    Users,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    UserCheck,
    UserX,
    Edit,
    Eye,
    ShoppingCart,
    Navigation,
    CheckCircle,
    CheckSquare,
    Calendar,
    Building2,
    Upload,
    Image,
    X,
    Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Import existing DealerApprovals component
import DealerApprovals from './DealerApprovals';

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
    { id: '5', name: 'Prime Stationery', email: 'prime@stat.com', phone: '+91 98765 43240', status: 'inactive', route: 'north_route', company: 'Prime Stationery Ltd', ordersThisMonth: 2, totalRevenue: 5000, approvalStatus: 'approved' },
];

const MOCK_CUSTOMERS = [
    { id: '1', name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '+91 98765 43236', status: 'active', totalOrders: 12, lastOrder: '2 days ago', totalSpent: 8500 },
    { id: '2', name: 'Priya Sharma', email: 'priya.s@gmail.com', phone: '+91 98765 43237', status: 'active', totalOrders: 8, lastOrder: '1 week ago', totalSpent: 5600 },
    { id: '3', name: 'Arjun Singh', email: 'arjun@email.com', phone: '+91 98765 43238', status: 'active', totalOrders: 5, lastOrder: '3 days ago', totalSpent: 3200 },
    { id: '4', name: 'Meera Patel', email: 'meera.p@gmail.com', phone: '+91 98765 43239', status: 'inactive', totalOrders: 2, lastOrder: '1 month ago', totalSpent: 1200 },
    { id: '5', name: 'Vikram Reddy', email: 'vikram@email.com', phone: '+91 98765 43241', status: 'inactive', totalOrders: 1, lastOrder: '2 months ago', totalSpent: 450 },
];

interface DealerForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    companyName: string;
    gstNumber: string;
    businessAddress: string;
    route: string;
    shopImage: File | null;
}

interface CustomerForm {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const DealerCustomerManagement: React.FC = () => {
    const [activeMainTab, setActiveMainTab] = useState('dealers');

    // Dealer state
    const [dealerSearchQuery, setDealerSearchQuery] = useState('');
    const [dealerStatusFilter, setDealerStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddDealerModalOpen, setIsAddDealerModalOpen] = useState(false);
    const [dealerForm, setDealerForm] = useState<DealerForm>({
        name: '', email: '', phone: '', password: '',
        companyName: '', gstNumber: '', businessAddress: '', route: '', shopImage: null
    });

    // Customer state
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [customerStatusFilter, setCustomerStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [customerForm, setCustomerForm] = useState<CustomerForm>({
        name: '', email: '', phone: '', password: ''
    });

    // Dealer form validation
    const isDealerFormValid = dealerForm.name && dealerForm.email && dealerForm.phone && dealerForm.password &&
        dealerForm.companyName && dealerForm.gstNumber && dealerForm.businessAddress && dealerForm.route;

    // Customer form validation
    const isCustomerFormValid = customerForm.name && customerForm.email && customerForm.phone && customerForm.password;

    const resetDealerForm = () => {
        setDealerForm({
            name: '', email: '', phone: '', password: '',
            companyName: '', gstNumber: '', businessAddress: '', route: '', shopImage: null
        });
    };

    const resetCustomerForm = () => {
        setCustomerForm({ name: '', email: '', phone: '', password: '' });
    };

    const handleAddDealer = () => {
        toast.success('Dealer registered! Approval pending.');
        setIsAddDealerModalOpen(false);
        resetDealerForm();
    };

    const handleAddCustomer = () => {
        toast.success('Customer registered successfully!');
        setIsAddCustomerModalOpen(false);
        resetCustomerForm();
    };

    // Dealer filtering
    const filteredDealers = MOCK_DEALERS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(dealerSearchQuery.toLowerCase()) || d.email.toLowerCase().includes(dealerSearchQuery.toLowerCase());
        return matchesSearch && (dealerStatusFilter === 'all' || d.status === dealerStatusFilter);
    });

    const totalDealers = MOCK_DEALERS.length;
    const activeDealers = MOCK_DEALERS.filter(d => d.status === 'active').length;
    const inactiveDealers = MOCK_DEALERS.filter(d => d.status === 'inactive').length;
    const approvedDealers = MOCK_DEALERS.filter(d => d.approvalStatus === 'approved').length;

    // Customer filtering
    const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || c.email.toLowerCase().includes(customerSearchQuery.toLowerCase());
        return matchesSearch && (customerStatusFilter === 'all' || c.status === customerStatusFilter);
    });

    const totalCustomers = MOCK_CUSTOMERS.length;
    const activeCustomers = MOCK_CUSTOMERS.filter(c => c.status === 'active').length;
    const inactiveCustomers = MOCK_CUSTOMERS.filter(c => c.status === 'inactive').length;

    const getRouteBadge = (routeId: string) => {
        const route = ROUTES.find(r => r.id === routeId);
        return route ? <Badge className={`${route.color} border-0`}><Navigation className="h-3 w-3 mr-1" />{route.label}</Badge> : null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dealers & Customers</h1>
                    <p className="text-muted-foreground mt-1">Manage dealer and customer accounts</p>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="dealers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Store className="h-4 w-4" />
                        Dealers ({totalDealers})
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <UserCircle className="h-4 w-4" />
                        Customers ({totalCustomers})
                    </TabsTrigger>
                    <TabsTrigger value="approval" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <CheckSquare className="h-4 w-4" />
                        Approvals
                    </TabsTrigger>
                </TabsList>

                {/* Dealers Tab */}
                <TabsContent value="dealers" className="space-y-6">
                    {/* Stats Cards */}
                    {/* Stats Cards */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Active Dealers</p><div className="text-2xl font-bold">{activeDealers}/{totalDealers}</div></div><div className="p-2 rounded-full bg-emerald-100"><Users className="h-4 w-4 text-emerald-600" /></div></CardContent></Card>
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Approved</p><div className="text-2xl font-bold text-green-600">{activeDealers}</div></div><div className="p-2 rounded-full bg-green-100"><CheckCircle className="h-4 w-4 text-green-600" /></div></CardContent></Card>
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Orders (Month)</p><div className="text-2xl font-bold text-blue-600">{MOCK_DEALERS.reduce((s, d) => s + d.ordersThisMonth, 0)}</div></div><div className="p-2 rounded-full bg-blue-100"><ShoppingCart className="h-4 w-4 text-blue-600" /></div></CardContent></Card>
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Revenue</p><div className="text-2xl font-bold text-emerald-600">₹{(MOCK_DEALERS.reduce((s, d) => s + d.totalRevenue, 0) / 1000).toFixed(0)}K</div></div><div className="p-2 rounded-full bg-emerald-100"><Store className="h-4 w-4 text-emerald-600" /></div></CardContent></Card>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search dealers..." className="pl-9" value={dealerSearchQuery} onChange={(e) => setDealerSearchQuery(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <Button variant={dealerStatusFilter === 'all' ? 'default' : 'outline'} onClick={() => setDealerStatusFilter('all')}>All ({totalDealers})</Button>
                            <Button variant={dealerStatusFilter === 'active' ? 'default' : 'outline'} onClick={() => setDealerStatusFilter('active')} className={dealerStatusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}>Active ({activeDealers})</Button>
                            <Button variant={dealerStatusFilter === 'inactive' ? 'default' : 'outline'} onClick={() => setDealerStatusFilter('inactive')} className={dealerStatusFilter === 'inactive' ? 'bg-orange-600 hover:bg-orange-700' : ''}>Inactive ({inactiveDealers})</Button>
                        </div>
                        <Dialog open={isAddDealerModalOpen} onOpenChange={(open) => { setIsAddDealerModalOpen(open); if (!open) resetDealerForm(); }}>
                            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Dealer</Button></DialogTrigger>
                            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2"><Store className="h-5 w-5" />Add New Dealer</DialogTitle>
                                    <DialogDescription>Register a new dealer. Requires approval before activation.</DialogDescription>
                                </DialogHeader>

                                {/* Approval Notice */}
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                                    <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-orange-700 dark:text-orange-300">Dealers require admin approval before they can log in and place orders.</p>
                                </div>

                                <div className="space-y-4 py-2">
                                    {/* Basic Information */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2"><UserCircle className="h-4 w-4" />Basic Information</h4>
                                        <div className="grid gap-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="dealer-name">Full Name *</Label>
                                                <Input id="dealer-name" placeholder="Owner's full name" value={dealerForm.name} onChange={(e) => setDealerForm({ ...dealerForm, name: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="dealer-email">Email *</Label>
                                                    <Input id="dealer-email" type="email" placeholder="email@example.com" value={dealerForm.email} onChange={(e) => setDealerForm({ ...dealerForm, email: e.target.value })} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="dealer-phone">Phone *</Label>
                                                    <Input id="dealer-phone" placeholder="+91 98765 43210" value={dealerForm.phone} onChange={(e) => setDealerForm({ ...dealerForm, phone: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="dealer-password">Password *</Label>
                                                <Input id="dealer-password" type="password" placeholder="Enter password" value={dealerForm.password} onChange={(e) => setDealerForm({ ...dealerForm, password: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Business Information */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2"><Building2 className="h-4 w-4" />Business Information</h4>
                                        <div className="grid gap-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="company-name">Company Name *</Label>
                                                <Input id="company-name" placeholder="Business / Company name" value={dealerForm.companyName} onChange={(e) => setDealerForm({ ...dealerForm, companyName: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="gst-number">GST Number *</Label>
                                                <Input id="gst-number" placeholder="GSTIN (e.g., 32AABCU9603R1ZX)" value={dealerForm.gstNumber} onChange={(e) => setDealerForm({ ...dealerForm, gstNumber: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="business-address">Business Address *</Label>
                                                <Input id="business-address" placeholder="Full business address" value={dealerForm.businessAddress} onChange={(e) => setDealerForm({ ...dealerForm, businessAddress: e.target.value })} />
                                            </div>

                                            {/* Shop Front Image */}
                                            <div className="grid gap-2">
                                                <Label className="flex items-center gap-2"><Image className="h-4 w-4" />Shop Front Image</Label>
                                                <p className="text-xs text-muted-foreground">Upload a clear photo of your shop front for verification (optional).</p>
                                                <div
                                                    className={`relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-muted/30 ${dealerForm.shopImage ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-muted-foreground/30'}`}
                                                    onClick={() => document.getElementById('dealer-shop-image')?.click()}
                                                >
                                                    <input
                                                        id="dealer-shop-image"
                                                        type="file"
                                                        accept="image/png, image/jpeg"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file && file.size <= 5 * 1024 * 1024) {
                                                                setDealerForm({ ...dealerForm, shopImage: file });
                                                            }
                                                        }}
                                                    />
                                                    {dealerForm.shopImage ? (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                                    <Image className="h-5 w-5 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">{dealerForm.shopImage.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{(dealerForm.shopImage.size / 1024).toFixed(1)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setDealerForm({ ...dealerForm, shopImage: null }); }}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-2">
                                                            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                                                            <p className="text-sm text-muted-foreground">Click to upload</p>
                                                            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Route Assignment */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2"><Navigation className="h-4 w-4 text-blue-600" />Delivery Route Assignment</h4>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dealer-route">Assigned Route *</Label>
                                            <Select value={dealerForm.route} onValueChange={(value) => setDealerForm({ ...dealerForm, route: value })}>
                                                <SelectTrigger><SelectValue placeholder="Select a delivery route" /></SelectTrigger>
                                                <SelectContent>
                                                    {ROUTES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">This route will be assigned for deliveries to this dealer.</p>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDealerModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddDealer} disabled={!isDealerFormValid}>Register Dealer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Dealer List */}
                    <div className="space-y-3">
                        {filteredDealers.map((d) => (
                            <Card key={d.id} className="hover:shadow-sm transition-all group border-l-4 border-l-emerald-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center"><Store className="h-5 w-5 text-muted-foreground" /></div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold">{d.name}</p>
                                                    <Badge className="bg-emerald-100 text-emerald-700 font-normal">Dealer</Badge>
                                                    {getRouteBadge(d.route)}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    <span className="font-medium text-foreground/80">{d.company}</span>
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{d.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-semibold">{d.ordersThisMonth} orders</p>
                                                <p className="text-xs text-muted-foreground">₹{(d.totalRevenue / 1000).toFixed(0)}K revenue</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
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
                        {filteredDealers.length === 0 && (
                            <Card><CardContent className="py-12 text-center"><Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" /><p className="text-muted-foreground">No dealers found</p></CardContent></Card>
                        )}
                    </div>
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="space-y-6">
                    {/* Stats Cards */}
                    {/* Stats Cards */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Active Customers</p><div className="text-2xl font-bold">{activeCustomers}/{totalCustomers}</div></div><div className="p-2 rounded-full bg-slate-100"><Users className="h-4 w-4 text-slate-600" /></div></CardContent></Card>
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Orders</p><div className="text-2xl font-bold text-blue-600">{MOCK_CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0)}</div></div><div className="p-2 rounded-full bg-blue-100"><ShoppingCart className="h-4 w-4 text-blue-600" /></div></CardContent></Card>
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Revenue</p><div className="text-2xl font-bold text-green-600">₹{MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div></div><div className="p-2 rounded-full bg-green-100"><UserCircle className="h-4 w-4 text-green-600" /></div></CardContent></Card>
                        <Card><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Avg. Value</p><div className="text-2xl font-bold text-purple-600">₹{Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / (totalCustomers || 1))}</div></div><div className="p-2 rounded-full bg-purple-100"><Calendar className="h-4 w-4 text-purple-600" /></div></CardContent></Card>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search customers..." className="pl-9" value={customerSearchQuery} onChange={(e) => setCustomerSearchQuery(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <Button variant={customerStatusFilter === 'all' ? 'default' : 'outline'} onClick={() => setCustomerStatusFilter('all')}>All ({totalCustomers})</Button>
                            <Button variant={customerStatusFilter === 'active' ? 'default' : 'outline'} onClick={() => setCustomerStatusFilter('active')} className={customerStatusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}>Active ({activeCustomers})</Button>
                            <Button variant={customerStatusFilter === 'inactive' ? 'default' : 'outline'} onClick={() => setCustomerStatusFilter('inactive')} className={customerStatusFilter === 'inactive' ? 'bg-orange-600 hover:bg-orange-700' : ''}>Inactive ({inactiveCustomers})</Button>
                        </div>
                        <Dialog open={isAddCustomerModalOpen} onOpenChange={(open) => { setIsAddCustomerModalOpen(open); if (!open) resetCustomerForm(); }}>
                            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Customer</Button></DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2"><UserCircle className="h-5 w-5" />Add New Customer</DialogTitle>
                                    <DialogDescription>Register a new customer account.</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-2">
                                    <div className="grid gap-3">
                                        <div className="grid gap-2">
                                            <Label htmlFor="customer-name">Full Name *</Label>
                                            <Input id="customer-name" placeholder="Enter full name" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="customer-email">Email *</Label>
                                                <Input id="customer-email" type="email" placeholder="email@example.com" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="customer-phone">Phone *</Label>
                                                <Input id="customer-phone" placeholder="+91 98765 43210" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="customer-password">Password *</Label>
                                            <Input id="customer-password" type="password" placeholder="Enter password" value={customerForm.password} onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddCustomerModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddCustomer} disabled={!isCustomerFormValid}>Register Customer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Customer List */}
                    <div className="space-y-3">
                        {filteredCustomers.map((c) => (
                            <Card key={c.id} className="hover:shadow-sm transition-all group border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center"><UserCircle className="h-5 w-5 text-muted-foreground" /></div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold">{c.name}</p>
                                                    <Badge className="bg-blue-100 text-blue-700 font-normal">Customer</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span><span className="hidden sm:flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block"><p className="text-sm font-semibold">{c.totalOrders} orders</p><p className="text-xs text-muted-foreground">Last: {c.lastOrder} • ₹{c.totalSpent.toLocaleString()}</p></div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
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
                        {filteredCustomers.length === 0 && (
                            <Card><CardContent className="py-12 text-center"><UserCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" /><p className="text-muted-foreground">No customers found</p></CardContent></Card>
                        )}
                    </div>
                </TabsContent>

                {/* Approval Tab - Reuse existing DealerApprovals component */}
                <TabsContent value="approval">
                    <DealerApprovals />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DealerCustomerManagement;
