import React, { useState } from 'react';
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
    Filter
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
import { useAuth } from '@/contexts/AuthContext';

// Role options based on who is creating
const ADMIN_CAN_CREATE = [
    { value: 'manager', label: 'Manager' },
    { value: 'designer', label: 'Designer' },
    { value: 'printer', label: 'Printer' },
    { value: 'sales', label: 'Sales / Line Staff' },
    { value: 'pan_card_team', label: 'PAN Card Team' },
    { value: 'seal_team', label: 'Seal Team' },
    { value: 'finance', label: 'Finance' },
    { value: 'stock_keeper', label: 'Stock Keeper' },
    { value: 'dealer', label: 'Dealer' },
];

const MANAGER_CAN_CREATE = [
    { value: 'designer', label: 'Designer' },
    { value: 'printer', label: 'Printer' },
    { value: 'sales', label: 'Sales / Line Staff' },
    { value: 'pan_card_team', label: 'PAN Card Team' },
    { value: 'seal_team', label: 'Seal Team' },
    { value: 'finance', label: 'Finance' },
    { value: 'stock_keeper', label: 'Stock Keeper' },
    { value: 'dealer', label: 'Dealer' },
];

// Mock users data
const MOCK_USERS = [
    { id: '1', name: 'John Designer', email: 'john@pvk.com', phone: '+91 98765 43210', role: 'designer', status: 'active', joinedAt: '2024-01-15' },
    { id: '2', name: 'Priya Printer', email: 'priya@pvk.com', phone: '+91 98765 43211', role: 'printer', status: 'active', joinedAt: '2024-02-20' },
    { id: '3', name: 'Rahul Sales', email: 'rahul@pvk.com', phone: '+91 98765 43212', role: 'sales', status: 'active', joinedAt: '2024-03-10' },
    { id: '4', name: 'Anita Finance', email: 'anita@pvk.com', phone: '+91 98765 43213', role: 'finance', status: 'active', joinedAt: '2024-01-25' },
    { id: '5', name: 'Suresh Stock', email: 'suresh@pvk.com', phone: '+91 98765 43214', role: 'stock_keeper', status: 'inactive', joinedAt: '2023-12-01' },
    { id: '6', name: 'Meena PAN', email: 'meena@pvk.com', phone: '+91 98765 43215', role: 'pan_card_team', status: 'active', joinedAt: '2024-04-05' },
    { id: '7', name: 'Kumar Seal', email: 'kumar@pvk.com', phone: '+91 98765 43216', role: 'seal_team', status: 'active', joinedAt: '2024-03-28' },
    { id: '8', name: 'ABC Prints', email: 'abc@prints.com', phone: '+91 98765 43217', role: 'dealer', status: 'active', joinedAt: '2024-05-15' },
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
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};

const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
        admin: 'Admin',
        manager: 'Manager',
        designer: 'Designer',
        printer: 'Printer',
        sales: 'Sales / Line Staff',
        finance: 'Finance',
        stock_keeper: 'Stock Keeper',
        pan_card_team: 'PAN Card Team',
        seal_team: 'Seal Team',
        dealer: 'Dealer',
    };
    return labels[role] || role;
};

const UserManagement = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: '' });

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const roleOptions = isAdmin ? ADMIN_CAN_CREATE : MANAGER_CAN_CREATE;

    // Filter users
    const filteredUsers = MOCK_USERS.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleAddUser = () => {
        // Mock add user
        console.log('Adding user:', newUser);
        setIsAddModalOpen(false);
        setNewUser({ name: '', email: '', phone: '', role: '' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage all users and their roles</p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account. They will receive login credentials via email.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="+91 98765 43210"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddUser}>Create User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{MOCK_USERS.length}</div>
                        <p className="text-xs text-muted-foreground">Total Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-600">
                            {MOCK_USERS.filter(u => u.status === 'active').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Active Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-orange-500">
                            {MOCK_USERS.filter(u => u.status === 'inactive').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Inactive Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {MOCK_USERS.filter(u => u.role === 'dealer').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Dealers</p>
                    </CardContent>
                </Card>
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
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {roleOptions.map((role) => (
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
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{user.name}</p>
                                            <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                            {user.status === 'inactive' && (
                                                <Badge variant="outline" className="text-xs text-orange-500 border-orange-500">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {user.phone}
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
                                            Edit User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Shield className="h-4 w-4 mr-2" />
                                            Change Role
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {user.status === 'active' ? (
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
                        ))}

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
