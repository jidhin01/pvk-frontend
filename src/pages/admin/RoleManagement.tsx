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
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Save,
    ShoppingCart,
    IndianRupee,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import PartnersOrdersTab from './components/PartnersOrdersTab';
import PartnersPricingTab from './components/PartnersPricingTab';
import PartnersActivityTab from './components/PartnersActivityTab';

interface RoleManagementProps {
    roleId: string;
    roleName: string;
    roleIcon: React.ReactNode;
}

// Mock data generator for each role
const getMockDataForRole = (roleId: string) => {
    const mockUsers: Record<string, any[]> = {
        designer: [
            { id: '1', name: 'Anu Designer', email: 'anu@pvk.com', phone: '+91 98765 43210', status: 'active', completedToday: 12, earnings: '₹725' },
            { id: '2', name: 'Ravi Designer', email: 'ravi@pvk.com', phone: '+91 98765 43211', status: 'active', completedToday: 8, earnings: '₹610' },
            { id: '3', name: 'Deepa Designer', email: 'deepa@pvk.com', phone: '+91 98765 43212', status: 'active', completedToday: 15, earnings: '₹640' },
        ],
        printer: [
            { id: '1', name: 'Printer Team 1', email: 'printer1@pvk.com', phone: '+91 98765 43220', status: 'active', pendingJobs: 24, completedToday: 156 },
            { id: '2', name: 'Printer Team 2', email: 'printer2@pvk.com', phone: '+91 98765 43221', status: 'active', pendingJobs: 18, completedToday: 142 },
        ],
        sales: [
            { id: '1', name: 'Rahul Sales', email: 'rahul@pvk.com', phone: '+91 98765 43230', status: 'active', deliveriesToday: 15, collected: '₹45,200' },
            { id: '2', name: 'Suresh Sales', email: 'suresh@pvk.com', phone: '+91 98765 43231', status: 'active', deliveriesToday: 12, collected: '₹38,500' },
            { id: '3', name: 'Anil Sales', email: 'anil@pvk.com', phone: '+91 98765 43232', status: 'inactive', deliveriesToday: 0, collected: '₹0' },
        ],
        finance: [
            { id: '1', name: 'Anita Finance', email: 'anita@pvk.com', phone: '+91 98765 43240', status: 'active' },
            { id: '2', name: 'Kumar Finance', email: 'kumar@pvk.com', phone: '+91 98765 43241', status: 'active' },
        ],
        stock: [
            { id: '1', name: 'Suresh Stock', email: 'sureshstock@pvk.com', phone: '+91 98765 43250', status: 'active', location: 'Godown' },
            { id: '2', name: 'Mohan Stock', email: 'mohan@pvk.com', phone: '+91 98765 43251', status: 'active', location: 'Shop' },
        ],
        pancard: [
            { id: '1', name: 'Meena PAN', email: 'meena@pvk.com', phone: '+91 98765 43260', status: 'active', normalPending: 8, emergencyPending: 2 },
            { id: '2', name: 'Gopi PAN', email: 'gopi@pvk.com', phone: '+91 98765 43261', status: 'active', normalPending: 5, emergencyPending: 1 },
        ],
        seal: [
            { id: '1', name: 'Kumar Seal', email: 'kumarseal@pvk.com', phone: '+91 98765 43270', status: 'active', selfInkPending: 6, normalSealPending: 4 },
            { id: '2', name: 'Priya Seal', email: 'priyaseal@pvk.com', phone: '+91 98765 43271', status: 'active', selfInkPending: 3, normalSealPending: 2 },
        ],
        dealer: [
            { id: '1', name: 'ABC Prints', email: 'abc@prints.com', phone: '+91 98765 43280', status: 'active', totalOrders: 145, revenue: '₹2,45,000' },
            { id: '2', name: 'Quick Print Hub', email: 'quick@hub.com', phone: '+91 98765 43281', status: 'active', totalOrders: 98, revenue: '₹1,82,000' },
            { id: '3', name: 'Express Graphics', email: 'express@gfx.com', phone: '+91 98765 43282', status: 'active', totalOrders: 67, revenue: '₹1,15,000' },
        ],
        customer: [
            { id: '1', name: 'Ramesh Kumar', email: 'ramesh@gmail.com', phone: '+91 98765 43290', status: 'active', totalOrders: 5, lastOrder: '2024-12-20' },
            { id: '2', name: 'Priya Nair', email: 'priya@gmail.com', phone: '+91 98765 43291', status: 'active', totalOrders: 3, lastOrder: '2024-12-18' },
        ],
    };
    return mockUsers[roleId] || [];
};

// Role-specific settings
const getRoleSettings = (roleId: string) => {
    const settings: Record<string, any> = {
        designer: {
            earningsPerDesign: 5,
            finePerMistake: 50,
            autoAssignJobs: true,
            attentionAlertMinutes: 120,
            maxActiveJobs: 3,
        },
        printer: {
            autoNotifySales: true,
            notifyOnComplete: true,
            maxQueueSize: 50,
            priorityEnabled: true,
        },
        sales: {
            autoGenerateQR: true,
            allowCreditPayments: true,
            maxCreditLimit: 50000,
            routeOptimization: true,
            salaryFromCollection: true,
        },
        finance: {
            autoCalculateEarnings: true,
            showPurchaseCost: true,
            creditTrackingEnabled: true,
            refundApprovalRequired: true,
        },
        stock: {
            deadStockDays: 90,
            minStockThreshold: 10,
            autoAlertEnabled: true,
            exchangeAlertEnabled: true,
        },
        pancard: {
            normalProcessingDays: 7,
            emergencyProcessingDays: 1,
            autoPrintEnabled: false,
            requirePhotoVerification: true,
        },
        seal: {
            selfInkPrice: 450,
            normalSealPrice: 250,
            malayalamSupport: true,
            englishSupport: true,
        },
        dealer: {
            approvalRequired: true,
            separatePricing: true,
            bulkDiscountPercent: 15,
            creditEnabled: true,
            maxCreditAmount: 100000,
        },
        customer: {
            selfRegistrationEnabled: true,
            uploadReward: 10,
            trackingEnabled: true,
        },
    };
    return settings[roleId] || {};
};

const RoleManagement: React.FC<RoleManagementProps> = ({ roleId, roleName, roleIcon }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Get mock data for this role
    const users = getMockDataForRole(roleId);
    const [settings, setSettings] = useState(getRoleSettings(roleId));

    // Filter users
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSaveSettings = () => {
        console.log('Saving settings for', roleId, settings);
        toast.success(`${roleName} settings saved successfully`);
    };

    // Get role-specific stats
    const getStats = () => {
        switch (roleId) {
            case 'designer':
                return [
                    { label: 'Active Designers', value: users.filter(u => u.status === 'active').length, icon: Users },
                    { label: 'Completed Today', value: users.reduce((acc, u) => acc + (u.completedToday || 0), 0), icon: CheckCircle },
                    { label: 'Total Earnings', value: '₹1,975', icon: DollarSign },
                ];
            case 'printer':
                return [
                    { label: 'Active Teams', value: users.filter(u => u.status === 'active').length, icon: Users },
                    { label: 'Pending Jobs', value: users.reduce((acc, u) => acc + (u.pendingJobs || 0), 0), icon: Clock },
                    { label: 'Printed Today', value: users.reduce((acc, u) => acc + (u.completedToday || 0), 0), icon: CheckCircle },
                ];
            case 'sales':
                return [
                    { label: 'Active Staff', value: users.filter(u => u.status === 'active').length, icon: Users },
                    { label: 'Deliveries Today', value: users.reduce((acc, u) => acc + (u.deliveriesToday || 0), 0), icon: TrendingUp },
                    { label: 'Collected Today', value: '₹83,700', icon: DollarSign },
                ];
            case 'dealer':
                return [
                    { label: 'Total Dealers', value: users.length, icon: Users },
                    { label: 'Active Dealers', value: users.filter(u => u.status === 'active').length, icon: UserCheck },
                    { label: 'Total Revenue', value: '₹5,42,000', icon: DollarSign },
                ];
            default:
                return [
                    { label: 'Total Members', value: users.length, icon: Users },
                    { label: 'Active', value: users.filter(u => u.status === 'active').length, icon: UserCheck },
                    { label: 'Inactive', value: users.filter(u => u.status === 'inactive').length, icon: UserX },
                ];
        }
    };

    // Render role-specific settings
    const renderSettings = () => {
        switch (roleId) {
            case 'designer':
                return (
                    <div className="space-y-4">
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
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                                <Label>Auto-Assign Jobs</Label>
                                <p className="text-xs text-muted-foreground">Automatically assign jobs from pool</p>
                            </div>
                            <Switch
                                checked={settings.autoAssignJobs}
                                onCheckedChange={(checked) => setSettings({ ...settings, autoAssignJobs: checked })}
                            />
                        </div>
                    </div>
                );
            case 'printer':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Queue Size</Label>
                                <Input
                                    type="number"
                                    value={settings.maxQueueSize}
                                    onChange={(e) => setSettings({ ...settings, maxQueueSize: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Auto Notify Sales</Label>
                                    <p className="text-xs text-muted-foreground">Notify sales team when print is complete</p>
                                </div>
                                <Switch
                                    checked={settings.autoNotifySales}
                                    onCheckedChange={(checked) => setSettings({ ...settings, autoNotifySales: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Priority Queue</Label>
                                    <p className="text-xs text-muted-foreground">Enable priority printing for urgent jobs</p>
                                </div>
                                <Switch
                                    checked={settings.priorityEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, priorityEnabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'sales':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Credit Limit (₹)</Label>
                                <Input
                                    type="number"
                                    value={settings.maxCreditLimit}
                                    onChange={(e) => setSettings({ ...settings, maxCreditLimit: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Auto Generate QR Code</Label>
                                    <p className="text-xs text-muted-foreground">Generate payment QR automatically</p>
                                </div>
                                <Switch
                                    checked={settings.autoGenerateQR}
                                    onCheckedChange={(checked) => setSettings({ ...settings, autoGenerateQR: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Allow Credit Payments</Label>
                                    <p className="text-xs text-muted-foreground">Enable credit option for dealers</p>
                                </div>
                                <Switch
                                    checked={settings.allowCreditPayments}
                                    onCheckedChange={(checked) => setSettings({ ...settings, allowCreditPayments: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Salary from Collection</Label>
                                    <p className="text-xs text-muted-foreground">Allow salary deduction from collected amount</p>
                                </div>
                                <Switch
                                    checked={settings.salaryFromCollection}
                                    onCheckedChange={(checked) => setSettings({ ...settings, salaryFromCollection: checked })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'stock':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dead Stock Duration (Days)</Label>
                                <Input
                                    type="number"
                                    value={settings.deadStockDays}
                                    onChange={(e) => setSettings({ ...settings, deadStockDays: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Minimum Stock Threshold</Label>
                                <Input
                                    type="number"
                                    value={settings.minStockThreshold}
                                    onChange={(e) => setSettings({ ...settings, minStockThreshold: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Auto Alert on Low Stock</Label>
                                    <p className="text-xs text-muted-foreground">Send alerts when stock is low</p>
                                </div>
                                <Switch
                                    checked={settings.autoAlertEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, autoAlertEnabled: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Exchange Alert</Label>
                                    <p className="text-xs text-muted-foreground">Alert for shop-godown exchange</p>
                                </div>
                                <Switch
                                    checked={settings.exchangeAlertEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, exchangeAlertEnabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'seal':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Self-Ink Seal Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={settings.selfInkPrice}
                                    onChange={(e) => setSettings({ ...settings, selfInkPrice: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Normal Seal Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={settings.normalSealPrice}
                                    onChange={(e) => setSettings({ ...settings, normalSealPrice: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Malayalam Support</Label>
                                    <p className="text-xs text-muted-foreground">Enable Malayalam language seals</p>
                                </div>
                                <Switch
                                    checked={settings.malayalamSupport}
                                    onCheckedChange={(checked) => setSettings({ ...settings, malayalamSupport: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>English Support</Label>
                                    <p className="text-xs text-muted-foreground">Enable English language seals</p>
                                </div>
                                <Switch
                                    checked={settings.englishSupport}
                                    onCheckedChange={(checked) => setSettings({ ...settings, englishSupport: checked })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'dealer':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Bulk Discount (%)</Label>
                                <Input
                                    type="number"
                                    value={settings.bulkDiscountPercent}
                                    onChange={(e) => setSettings({ ...settings, bulkDiscountPercent: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Credit Amount (₹)</Label>
                                <Input
                                    type="number"
                                    value={settings.maxCreditAmount}
                                    onChange={(e) => setSettings({ ...settings, maxCreditAmount: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Approval Required</Label>
                                    <p className="text-xs text-muted-foreground">Require approval for new dealers</p>
                                </div>
                                <Switch
                                    checked={settings.approvalRequired}
                                    onCheckedChange={(checked) => setSettings({ ...settings, approvalRequired: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Separate Pricing</Label>
                                    <p className="text-xs text-muted-foreground">Different pricing for dealers</p>
                                </div>
                                <Switch
                                    checked={settings.separatePricing}
                                    onCheckedChange={(checked) => setSettings({ ...settings, separatePricing: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Enable Credit</Label>
                                    <p className="text-xs text-muted-foreground">Allow credit purchases</p>
                                </div>
                                <Switch
                                    checked={settings.creditEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, creditEnabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'customer':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Upload Reward (₹)</Label>
                                <Input
                                    type="number"
                                    value={settings.uploadReward}
                                    onChange={(e) => setSettings({ ...settings, uploadReward: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Self Registration</Label>
                                    <p className="text-xs text-muted-foreground">Allow customers to self-register</p>
                                </div>
                                <Switch
                                    checked={settings.selfRegistrationEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, selfRegistrationEnabled: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <Label>Order Tracking</Label>
                                    <p className="text-xs text-muted-foreground">Enable live order tracking</p>
                                </div>
                                <Switch
                                    checked={settings.trackingEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, trackingEnabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-8 text-muted-foreground">
                        <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No specific settings for this role</p>
                    </div>
                );
        }
    };

    const stats = getStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                        {roleIcon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{roleName}</h1>
                        <p className="text-muted-foreground">Manage {roleName.toLowerCase()} settings and members</p>
                    </div>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add {roleName}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New {roleName}</DialogTitle>
                            <DialogDescription>Create a new {roleName.toLowerCase()} account</DialogDescription>
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
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success(`${roleName} created`); setIsAddModalOpen(false); }}>
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                                <stat.icon className="h-8 w-8 text-muted-foreground opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Check if this is a partner management role */}
            {(roleId === 'dealer' || roleId === 'customer') ? (
                /* Partner Management Tabs */
                <Tabs defaultValue="orders" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
                        <TabsTrigger value="orders">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Orders</span>
                        </TabsTrigger>
                        <TabsTrigger value="members">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Members</span>
                        </TabsTrigger>
                        <TabsTrigger value="pricing">
                            <IndianRupee className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Pricing</span>
                        </TabsTrigger>
                        <TabsTrigger value="activity">
                            <Activity className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Activity</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-4">
                        <PartnersOrdersTab partnerType={roleId as 'dealer' | 'customer'} />
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-4">
                        {/* Search */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={`Search ${roleName.toLowerCase()}s...`}
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{roleName} Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {filteredUsers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{member.name}</p>
                                                        {member.status === 'active' ? (
                                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">Active</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-orange-500 border-orange-500 text-xs">Inactive</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
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
                                    ))}

                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p>No {roleName.toLowerCase()}s found</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="space-y-4">
                        <PartnersPricingTab partnerType={roleId as 'dealer' | 'customer'} />
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-4">
                        <PartnersActivityTab partnerType={roleId as 'dealer' | 'customer'} />
                    </TabsContent>
                </Tabs>
            ) : (
                /* Standard Role Management Tabs */
                <Tabs defaultValue="members" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="members">
                            <Users className="h-4 w-4 mr-2" />
                            Members ({users.length})
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings & Pricing
                        </TabsTrigger>
                    </TabsList>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-4">
                        {/* Search */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={`Search ${roleName.toLowerCase()}s...`}
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{roleName} Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {filteredUsers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{member.name}</p>
                                                        {member.status === 'active' ? (
                                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">Active</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-orange-500 border-orange-500 text-xs">Inactive</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
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
                                    ))}

                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p>No {roleName.toLowerCase()}s found</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{roleName} Settings</CardTitle>
                                <CardDescription>Configure pricing, rules, and preferences for {roleName.toLowerCase()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {renderSettings()}
                            </CardContent>
                        </Card>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveSettings}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Settings
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default RoleManagement;
