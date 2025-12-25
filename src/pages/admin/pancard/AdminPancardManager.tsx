import React, { useState } from 'react';
import {
    LayoutDashboard,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Users,
    Settings,
    MoreVertical,
    FileText,
    Download,
    Eye,
    Printer,
    Package,
    AlertCircle,
    IdCard,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_PANCARD_ORDERS, PancardOrder } from '@/data/mockPancardData';
import { useAuth } from '@/contexts/AuthContext';
import RoleManagement from '../RoleManagement';

export default function AdminPancardManager() {
    const [activeTab, setActiveTab] = useState('tracking');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Stats Calculation
    const totalOrders = MOCK_PANCARD_ORDERS.length;
    const pendingOrders = MOCK_PANCARD_ORDERS.filter(o => o.status === 'PENDING').length;
    const processingOrders = MOCK_PANCARD_ORDERS.filter(o => o.status === 'SENT_TO_PRINTER' || o.status === 'PROCESSING').length;
    const completedOrders = MOCK_PANCARD_ORDERS.filter(o => o.status === 'COMPLETED').length;

    // Filter Logic
    const filteredOrders = MOCK_PANCARD_ORDERS.filter(order => {
        const matchesSearch =
            order.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.dealerName || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SENT_TO_PRINTER': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PROCESSING': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStepStatus = (orderStatus: string, stepIndex: number) => {
        // Steps: 1=Verified, 2=Printing, 3=Deliver/Done

        if (orderStatus === 'REJECTED') {
            return 'inactive';
        }

        if (stepIndex === 1) { // User needs to be verified (Status is past pending)
            return orderStatus !== 'PENDING' ? 'completed' : 'inactive';
        }
        if (stepIndex === 2) { // Printing (Status is past Sent to printer)
            return (orderStatus === 'PROCESSING' || orderStatus === 'COMPLETED') ? 'completed' : 'inactive';
        }
        if (stepIndex === 3) { // Done
            return orderStatus === 'COMPLETED' ? 'completed' : 'inactive';
        }
        return 'inactive';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-900/20">
                        <IdCard className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">PAN Card Department</h1>
                        <p className="text-muted-foreground font-medium">Manage applications, track orders, and oversee team performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                                <h3 className="text-2xl font-bold mt-2">{totalOrders}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Verification</p>
                                <h3 className="text-2xl font-bold mt-2">{pendingOrders}</h3>
                            </div>
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Printing / Process</p>
                                <h3 className="text-2xl font-bold mt-2">{processingOrders}</h3>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Printer className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed & Handover</p>
                                <h3 className="text-2xl font-bold mt-2">{completedOrders}</h3>
                            </div>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="tracking" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border">
                    <TabsTrigger value="tracking" className="gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Live Tracking
                    </TabsTrigger>
                    <TabsTrigger value="team" className="gap-2">
                        <Users className="h-4 w-4" />
                        Team & Settings
                    </TabsTrigger>
                </TabsList>

                {/* TRACKING TAB */}
                <TabsContent value="tracking" className="space-y-6">
                    <Card className="shadow-md border-t-4 border-t-primary/20">
                        <CardHeader className="border-b bg-muted/30 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle>Application Lifecycle</CardTitle>
                                    <CardDescription>Track the real-time status of all PAN card applications.</CardDescription>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search applicant or ID..."
                                            className="pl-9 w-full sm:w-[250px]"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Order ID</TableHead>
                                        <TableHead>Applicant Details</TableHead>
                                        <TableHead>Dealer / Source</TableHead>
                                        <TableHead className="w-[120px]">Type</TableHead>
                                        <TableHead className="hidden md:table-cell">Progress Tracking</TableHead>
                                        <TableHead>Current Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <SearchX className="h-10 w-10 opacity-30" />
                                                    <p>No applications found matching your criteria</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-muted/5">
                                                <TableCell className="font-mono font-medium text-xs">{order.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{order.applicantName}</span>
                                                        <span className="text-xs text-muted-foreground font-mono">{order.aadharNumber}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{order.dealerName || 'Direct Customer'}</span>
                                                        {/* Removed dealerType */}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.type === 'EMERGENCY' ? (
                                                        <Badge variant="destructive" className="text-[10px] uppercase">Emergency</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] uppercase">Normal</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell w-[30%]">
                                                    {/* Progress Stepper for Table */}
                                                    <div className="flex items-center w-full gap-1">
                                                        {['Verified', 'Printing', 'Done'].map((step, idx) => {
                                                            const isCompleted = getStepStatus(order.status, idx + 1) === 'completed';

                                                            return (
                                                                <div key={step} className="flex-1 flex flex-col gap-1">
                                                                    <div className={`h-1.5 w-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="flex justify-between text-[9px] text-muted-foreground mt-1 px-0.5">
                                                        <span>Verify</span>
                                                        <span>Print</span>
                                                        <span>Deliver</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${getStatusColor(order.status)} font-medium`}>
                                                        {order.status.replace(/_/g, ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Clock className="h-4 w-4 mr-2" /> View Timeline
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TEAM & SETTINGS TAB */}
                <TabsContent value="team" className="mt-0">
                    <div className="border rounded-xl bg-background/50 backdrop-blur-sm p-4 md:p-6 overflow-hidden">
                        <RoleManagement
                            roleId="pancard"
                            roleName="PAN Card Team List"
                            roleIcon={<IdCard className="h-6 w-6" />}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
