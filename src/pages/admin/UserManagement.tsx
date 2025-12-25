import React, { useState, useMemo, useRef } from 'react';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Filter,
    Navigation,
    Palette,
    Printer as PrinterIcon,
    Truck,
    Package,
    CreditCard,
    Stamp,
    Wallet,
    Store,
    UserCircle,
    ChevronRight,
    Building2,
    Info,
    Briefcase,
    Settings2,
    MapPin,
    Crown,
    Upload,
    Eye,
    EyeOff,
    Image,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Route, ROUTES, getRouteLabel } from '@/data/mockSalesData';

// Role Categories with Icons
const ROLE_CATEGORIES = {
    management: {
        id: 'management',
        label: 'Management',
        icon: Crown,
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
        description: 'Administrative and oversight roles'
    },
    production: {
        id: 'production',
        label: 'Production',
        icon: Palette,
        color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30',
        description: 'Design and printing operations'
    },
    operations: {
        id: 'operations',
        label: 'Operations',
        icon: Truck,
        color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
        description: 'Delivery, sales, and stock management'
    },
    services: {
        id: 'services',
        label: 'Support Services',
        icon: Briefcase,
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
        description: 'PAN Card, Seal, and Finance teams'
    },
    partners: {
        id: 'partners',
        label: 'Partners',
        icon: Store,
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
        description: 'Dealers and customers'
    }
};

// Comprehensive Role Configuration
interface RoleConfig {
    value: string;
    label: string;
    category: keyof typeof ROLE_CATEGORIES;
    icon: any;
    permissions: string[];
    requiresApproval?: boolean;
    hasRouteAssignment?: boolean;
    hasDesignerType?: boolean;
    hasLocationAssignment?: boolean;
    description: string;
}

const ROLE_CONFIGS: RoleConfig[] = [
    {
        value: 'manager',
        label: 'Manager',
        category: 'management',
        icon: Crown,
        permissions: ['Create users', 'Approve dealers', 'View all reports', 'Manage operations'],
        description: 'Oversees operations and can create most user roles'
    },
    {
        value: 'designer',
        label: 'Designer',
        category: 'production',
        icon: Palette,
        permissions: ['Accept design jobs', 'Upload designs', 'View job queue'],
        hasDesignerType: true,
        description: 'Creates designs for print orders'
    },
    {
        value: 'printer',
        label: 'Printer',
        category: 'production',
        icon: PrinterIcon,
        permissions: ['View print queue', 'Update print status', 'Mark jobs complete'],
        description: 'Handles printing operations'
    },
    {
        value: 'sales',
        label: 'Sales / Line Staff',
        category: 'operations',
        icon: Truck,
        permissions: ['View deliveries', 'Collect payments', 'Update delivery status', 'Report expenses'],
        hasRouteAssignment: true,
        description: 'Handles deliveries and payment collection'
    },
    {
        value: 'stock_keeper',
        label: 'Stock Keeper',
        category: 'operations',
        icon: Package,
        permissions: ['Manage inventory', 'Stock alerts', 'Track dead stock', 'Stock transfers'],
        hasLocationAssignment: true,
        description: 'Manages inventory at Godown or Shop'
    },
    {
        value: 'pan_card_team',
        label: 'PAN Card Team',
        category: 'services',
        icon: CreditCard,
        permissions: ['Process PAN applications', 'Upload documents', 'Track PAN status'],
        description: 'Handles PAN card processing'
    },
    {
        value: 'seal_team',
        label: 'Seal Team',
        category: 'services',
        icon: Stamp,
        permissions: ['Process seal orders', 'Create seal designs', 'Update seal status'],
        description: 'Handles rubber seal and self-ink orders'
    },
    {
        value: 'finance',
        label: 'Finance',
        category: 'services',
        icon: Wallet,
        permissions: ['View all transactions', 'Track expenses', 'Manage refunds', 'Generate reports'],
        description: 'Handles financial tracking and reporting'
    },
    {
        value: 'dealer',
        label: 'Dealer',
        category: 'partners',
        icon: Store,
        permissions: ['Place orders', 'View dealer pricing', 'Track order status'],
        requiresApproval: true,
        hasRouteAssignment: true,
        description: 'Business partner with special pricing'
    },
    {
        value: 'customer',
        label: 'Customer',
        category: 'partners',
        icon: UserCircle,
        permissions: ['Place orders', 'View retail pricing', 'Track orders'],
        description: 'Regular customer with retail pricing'
    }
];

const DESIGNER_TYPES = [
    { value: 'normal', label: 'Normal Designer', description: 'Posters, brochures, price tags, etc.' },
    { value: 'pvc_card', label: 'PVC Card Designer', description: 'PVC card designs only' }
];

const STOCK_LOCATIONS = [
    { value: 'godown', label: 'Godown', description: 'Main warehouse' },
    { value: 'shop', label: 'Shop', description: 'Retail shop location' }
];

// Extended Mock Users with role-specific attributes
interface MockUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'active' | 'inactive';
    joinedAt: string;
    route?: Route;
    designerType?: 'normal' | 'pvc_card';
    location?: 'godown' | 'shop';
}

const MOCK_USERS: MockUser[] = [
    { id: '1', name: 'John Designer', email: 'john@pvk.com', phone: '+91 98765 43210', role: 'designer', status: 'active', joinedAt: '2024-01-15', designerType: 'normal' },
    { id: '2', name: 'Priya Printer', email: 'priya@pvk.com', phone: '+91 98765 43211', role: 'printer', status: 'active', joinedAt: '2024-02-20' },
    { id: '3', name: 'Rahul Sales', email: 'rahul@pvk.com', phone: '+91 98765 43212', role: 'sales', status: 'active', joinedAt: '2024-03-10', route: 'north_route' },
    { id: '4', name: 'Anita Finance', email: 'anita@pvk.com', phone: '+91 98765 43213', role: 'finance', status: 'active', joinedAt: '2024-01-25' },
    { id: '5', name: 'Suresh Stock', email: 'suresh@pvk.com', phone: '+91 98765 43214', role: 'stock_keeper', status: 'active', joinedAt: '2023-12-01', location: 'godown' },
    { id: '6', name: 'Meena PAN', email: 'meena@pvk.com', phone: '+91 98765 43215', role: 'pan_card_team', status: 'active', joinedAt: '2024-04-05' },
    { id: '7', name: 'Kumar Seal', email: 'kumar@pvk.com', phone: '+91 98765 43216', role: 'seal_team', status: 'active', joinedAt: '2024-03-28' },
    { id: '8', name: 'ABC Prints', email: 'abc@prints.com', phone: '+91 98765 43217', role: 'dealer', status: 'active', joinedAt: '2024-05-15', route: 'city_center' },
    { id: '9', name: 'Vikram Manager', email: 'vikram@pvk.com', phone: '+91 98765 43218', role: 'manager', status: 'active', joinedAt: '2024-01-01' },
    { id: '10', name: 'Arun PVC Designer', email: 'arun@pvk.com', phone: '+91 98765 43219', role: 'designer', status: 'active', joinedAt: '2024-06-01', designerType: 'pvc_card' },
    { id: '11', name: 'Deepa Sales', email: 'deepa@pvk.com', phone: '+91 98765 43220', role: 'sales', status: 'active', joinedAt: '2024-04-15', route: 'south_zone' },
    { id: '12', name: 'Mini Stock', email: 'mini@pvk.com', phone: '+91 98765 43221', role: 'stock_keeper', status: 'inactive', joinedAt: '2024-02-10', location: 'shop' },
];

const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        designer: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        printer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        sales: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        stock_keeper: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        pan_card_team: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
        seal_team: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        dealer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        customer: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};

const getRoleLabel = (role: string) => {
    const config = ROLE_CONFIGS.find(r => r.value === role);
    return config?.label || role;
};

const getRoleConfig = (role: string) => {
    return ROLE_CONFIGS.find(r => r.value === role);
};

interface NewUserForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    route: Route | '';
    designerType: 'normal' | 'pvc_card' | '';
    location: 'godown' | 'shop' | '';
    // Dealer-specific fields
    companyName: string;
    gstNumber: string;
    businessAddress: string;
    shopImage: File | null;
}

const UserManagement = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addStep, setAddStep] = useState<1 | 2 | 3>(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [newUser, setNewUser] = useState<NewUserForm>({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        route: '',
        designerType: '',
        location: '',
        companyName: '',
        gstNumber: '',
        businessAddress: '',
        shopImage: null
    });

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    // Get available roles based on category
    const getRolesForCategory = (category: string) => {
        return ROLE_CONFIGS.filter(r => r.category === category);
    };

    const selectedRoleConfig = useMemo(() => {
        return ROLE_CONFIGS.find(r => r.value === newUser.role);
    }, [newUser.role]);

    // Check if role-specific config is complete
    const isRoleConfigComplete = useMemo(() => {
        if (!selectedRoleConfig) return false;

        if (selectedRoleConfig.hasRouteAssignment && !newUser.route) return false;
        if (selectedRoleConfig.hasDesignerType && !newUser.designerType) return false;
        if (selectedRoleConfig.hasLocationAssignment && !newUser.location) return false;

        // Dealer-specific required fields
        if (newUser.role === 'dealer') {
            if (!newUser.companyName || !newUser.gstNumber || !newUser.businessAddress) {
                return false;
            }
        }

        return true;
    }, [selectedRoleConfig, newUser]);

    // Check if basic info is complete
    const isBasicInfoComplete = newUser.name && newUser.email && newUser.phone && newUser.password;

    // Filter users
    const filteredUsers = MOCK_USERS.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const roleConfig = getRoleConfig(u.role);
        const matchesCategory = categoryFilter === 'all' || roleConfig?.category === categoryFilter;
        return matchesSearch && matchesRole && matchesCategory;
    });

    // Group users by category for stats
    const usersByCategory = useMemo(() => {
        const grouped: Record<string, number> = {};
        MOCK_USERS.forEach(u => {
            const config = getRoleConfig(u.role);
            if (config) {
                grouped[config.category] = (grouped[config.category] || 0) + 1;
            }
        });
        return grouped;
    }, []);

    const handleAddUser = () => {
        console.log('Adding user:', newUser);
        setIsAddModalOpen(false);
        resetAddForm();
    };

    const resetAddForm = () => {
        setAddStep(1);
        setSelectedCategory('');
        setNewUser({
            name: '',
            email: '',
            phone: '',
            password: '',
            role: '',
            route: '',
            designerType: '',
            location: '',
            companyName: '',
            gstNumber: '',
            businessAddress: '',
            shopImage: null
        });
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setNewUser({ ...newUser, role: '', route: '', designerType: '', location: '' });
        setAddStep(2);
    };

    const handleRoleSelect = (role: string) => {
        setNewUser({ ...newUser, role, route: '', designerType: '', location: '' });
        setAddStep(3);
    };

    const handleModalClose = (open: boolean) => {
        if (!open) {
            resetAddForm();
        }
        setIsAddModalOpen(open);
    };

    // Get role-specific info display for user cards
    const getRoleSpecificInfo = (user: MockUser) => {
        const parts: React.ReactNode[] = [];

        if (user.route) {
            parts.push(
                <span key="route" className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    <Navigation className="h-3 w-3" />
                    {getRouteLabel(user.route)}
                </span>
            );
        }

        if (user.designerType) {
            parts.push(
                <span key="designer" className="flex items-center gap-1 text-xs bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full">
                    <Palette className="h-3 w-3" />
                    {user.designerType === 'pvc_card' ? 'PVC Card' : 'Normal'}
                </span>
            );
        }

        if (user.location) {
            parts.push(
                <span key="location" className="flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                    <MapPin className="h-3 w-3" />
                    {user.location === 'godown' ? 'Godown' : 'Shop'}
                </span>
            );
        }

        return parts.length > 0 ? <div className="flex flex-wrap gap-1 mt-1">{parts}</div> : null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage all users with role-specific configurations</p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={handleModalClose}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Add New User
                            </DialogTitle>
                            <DialogDescription>
                                {addStep === 1 && 'Step 1: Select a role category'}
                                {addStep === 2 && 'Step 2: Choose a specific role'}
                                {addStep === 3 && 'Step 3: Enter user details and configuration'}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center gap-2 py-2">
                            {[1, 2, 3].map((step) => (
                                <React.Fragment key={step}>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${addStep >= step
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <ChevronRight className={`h-4 w-4 ${addStep > step ? 'text-primary' : 'text-muted-foreground'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Step 1: Select Category */}
                        {addStep === 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                                {Object.values(ROLE_CATEGORIES).map((category) => {
                                    const Icon = category.icon;
                                    const rolesInCategory = getRolesForCategory(category.id);
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategorySelect(category.id)}
                                            className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary hover:bg-muted/50 ${selectedCategory === category.id ? 'border-primary bg-muted/50' : 'border-transparent bg-muted/30'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${category.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="font-semibold">{category.label}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                                            <p className="text-xs text-primary mt-2">{rolesInCategory.length} roles</p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Step 2: Select Role */}
                        {addStep === 2 && (
                            <div className="space-y-4 py-4">
                                <Button variant="ghost" size="sm" onClick={() => setAddStep(1)} className="mb-2">
                                    ← Back to categories
                                </Button>
                                <div className="grid gap-3">
                                    {getRolesForCategory(selectedCategory).map((role) => {
                                        const Icon = role.icon;
                                        return (
                                            <button
                                                key={role.value}
                                                onClick={() => handleRoleSelect(role.value)}
                                                className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${newUser.role === role.value ? 'border-primary bg-primary/5' : 'border-muted'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ROLE_CATEGORIES[role.category].color}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold">{role.label}</h4>
                                                            {role.requiresApproval && (
                                                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                                                                    Requires Approval
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-0.5">{role.description}</p>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {role.permissions.slice(0, 3).map((perm, i) => (
                                                                <Badge key={i} variant="secondary" className="text-xs">
                                                                    {perm}
                                                                </Badge>
                                                            ))}
                                                            {role.permissions.length > 3 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{role.permissions.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 3: User Details & Role Config */}
                        {addStep === 3 && selectedRoleConfig && (
                            <div className="space-y-4 py-4">
                                <Button variant="ghost" size="sm" onClick={() => setAddStep(2)} className="mb-2">
                                    ← Back to roles
                                </Button>

                                {/* Selected Role Summary */}
                                <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ROLE_CATEGORIES[selectedRoleConfig.category].color}`}>
                                        <selectedRoleConfig.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{selectedRoleConfig.label}</p>
                                        <p className="text-xs text-muted-foreground">{ROLE_CATEGORIES[selectedRoleConfig.category].label}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Basic Info */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <UserCircle className="h-4 w-4" />
                                        Basic Information
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter full name"
                                                value={newUser.name}
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">Phone *</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="+91 98765 43210"
                                                    value={newUser.phone}
                                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password *</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dealer-Specific Fields */}
                                {newUser.role === 'dealer' && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                Business Information
                                            </h4>
                                            <div className="grid gap-3">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="companyName">Company Name *</Label>
                                                    <Input
                                                        id="companyName"
                                                        placeholder="Business Name"
                                                        value={newUser.companyName}
                                                        onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="gstNumber">GST Number *</Label>
                                                    <Input
                                                        id="gstNumber"
                                                        placeholder="GSTIN"
                                                        value={newUser.gstNumber}
                                                        onChange={(e) => setNewUser({ ...newUser, gstNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="businessAddress">Business Address *</Label>
                                                    <Input
                                                        id="businessAddress"
                                                        placeholder="Full address"
                                                        value={newUser.businessAddress}
                                                        onChange={(e) => setNewUser({ ...newUser, businessAddress: e.target.value })}
                                                    />
                                                </div>

                                                {/* Shop Front Image Upload */}
                                                <div className="grid gap-2">
                                                    <Label className="flex items-center gap-2">
                                                        <Image className="h-4 w-4" />
                                                        Shop Front Image
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Upload a clear photo of your shop front for verification.
                                                    </p>
                                                    <div
                                                        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all hover:border-primary hover:bg-muted/30 ${newUser.shopImage ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-muted-foreground/30'
                                                            }`}
                                                        onClick={() => document.getElementById('shopImage')?.click()}
                                                    >
                                                        <input
                                                            id="shopImage"
                                                            type="file"
                                                            accept="image/png, image/jpeg"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file && file.size <= 5 * 1024 * 1024) {
                                                                    setNewUser({ ...newUser, shopImage: file });
                                                                }
                                                            }}
                                                        />
                                                        {newUser.shopImage ? (
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                                        <Image className="h-5 w-5 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium">{newUser.shopImage.name}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {(newUser.shopImage.size / 1024).toFixed(1)} KB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setNewUser({ ...newUser, shopImage: null });
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                                <p className="text-sm text-muted-foreground">Click to upload</p>
                                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Role-Specific Configuration */}
                                {(selectedRoleConfig.hasRouteAssignment || selectedRoleConfig.hasDesignerType || selectedRoleConfig.hasLocationAssignment) && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium flex items-center gap-2">
                                                <Settings2 className="h-4 w-4" />
                                                Role Configuration
                                            </h4>

                                            {/* Route Assignment for Sales / Dealer */}
                                            {selectedRoleConfig.hasRouteAssignment && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="route" className="flex items-center gap-2">
                                                        <Navigation className="h-4 w-4 text-blue-600" />
                                                        Assigned Delivery Route *
                                                    </Label>
                                                    <Select
                                                        value={newUser.route}
                                                        onValueChange={(value) => setNewUser({ ...newUser, route: value as Route })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a delivery route" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ROUTES.map((route) => (
                                                                <SelectItem key={route.id} value={route.id}>
                                                                    {route.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-xs text-muted-foreground">
                                                        This route will be assigned for deliveries{selectedRoleConfig.value === 'dealer' ? ' to this dealer' : ''}.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Designer Type */}
                                            {selectedRoleConfig.hasDesignerType && (
                                                <div className="grid gap-2">
                                                    <Label className="flex items-center gap-2">
                                                        <Palette className="h-4 w-4 text-pink-600" />
                                                        Designer Specialization *
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {DESIGNER_TYPES.map((type) => (
                                                            <button
                                                                key={type.value}
                                                                onClick={() => setNewUser({ ...newUser, designerType: type.value as 'normal' | 'pvc_card' })}
                                                                className={`p-3 rounded-lg border-2 text-left transition-all ${newUser.designerType === type.value ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                                                                    }`}
                                                            >
                                                                <p className="font-medium text-sm">{type.label}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Stock Location */}
                                            {selectedRoleConfig.hasLocationAssignment && (
                                                <div className="grid gap-2">
                                                    <Label className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-orange-600" />
                                                        Assigned Location *
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {STOCK_LOCATIONS.map((loc) => (
                                                            <button
                                                                key={loc.value}
                                                                onClick={() => setNewUser({ ...newUser, location: loc.value as 'godown' | 'shop' })}
                                                                className={`p-3 rounded-lg border-2 text-left transition-all ${newUser.location === loc.value ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                                                                    }`}
                                                            >
                                                                <p className="font-medium text-sm">{loc.label}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{loc.description}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Approval Notice */}
                                {selectedRoleConfig.requiresApproval && (
                                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-orange-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Approval Required</p>
                                                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                                                    This user type requires admin approval before they can access their dashboard.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => handleModalClose(false)}>
                                Cancel
                            </Button>
                            {addStep === 3 && (
                                <Button
                                    onClick={handleAddUser}
                                    disabled={!isBasicInfoComplete || !isRoleConfigComplete}
                                >
                                    Create User
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.values(ROLE_CATEGORIES).map((category) => {
                    const Icon = category.icon;
                    const count = usersByCategory[category.id] || 0;
                    return (
                        <Card
                            key={category.id}
                            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${categoryFilter === category.id ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => setCategoryFilter(categoryFilter === category.id ? 'all' : category.id)}
                        >
                            <CardContent className="pt-4 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${category.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">{count}</div>
                                        <p className="text-xs text-muted-foreground">{category.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {ROLE_CONFIGS.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
                    {categoryFilter !== 'all' && (
                        <CardDescription>
                            Showing {ROLE_CATEGORIES[categoryFilter as keyof typeof ROLE_CATEGORIES]?.label} users
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredUsers.map((u) => {
                            const roleConfig = getRoleConfig(u.role);
                            const RoleIcon = roleConfig?.icon || Users;
                            return (
                                <div
                                    key={u.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${ROLE_CATEGORIES[roleConfig?.category ?? 'partners']?.color}`}>
                                            <RoleIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-medium">{u.name}</p>
                                                <Badge className={`text-xs ${getRoleBadgeColor(u.role)}`}>
                                                    {getRoleLabel(u.role)}
                                                </Badge>
                                                {u.status === 'inactive' && (
                                                    <Badge variant="outline" className="text-xs text-orange-500 border-orange-500">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {u.email}
                                                </span>
                                                <span className="hidden sm:flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {u.phone}
                                                </span>
                                            </div>
                                            {getRoleSpecificInfo(u)}
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
                                                Edit User
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Shield className="h-4 w-4 mr-2" />
                                                Change Role
                                            </DropdownMenuItem>
                                            {roleConfig?.hasRouteAssignment && (
                                                <DropdownMenuItem>
                                                    <Navigation className="h-4 w-4 mr-2" />
                                                    Change Route
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            {u.status === 'active' ? (
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
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No users found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagement;
