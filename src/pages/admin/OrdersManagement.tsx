import React, { useState } from 'react';
import {
    Search,
    Clock,
    CheckCircle2,
    Printer as PrinterIcon,
    ChevronDown,
    ChevronUp,
    Package,
    Calendar,
    FileText,
    Layers,
    IndianRupee,
    Eye,
    User,
    Truck,
    Palette,
    Store,
    UserCheck,
    Box,
    ShoppingCart,
    Filter,
    Download,
    Play,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Enhanced order data with all statuses
const MOCK_ALL_ORDERS = [
    {
        id: 'ORD-2024-001',
        partnerName: 'ABC Prints & Graphics',
        partnerType: 'dealer',
        partnerEmail: 'abc@prints.com',
        date: '2024-12-24',
        type: 'PRINT',
        jobName: 'Business Cards - 1000 pcs',
        status: 'pending',
        cost: 2500,
        quantity: 1000,
        priority: 'normal',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-24 10:30 AM', role: 'Dealer', person: 'ABC Prints', action: 'Uploaded order' },
            { stage: 'Manager Review', completed: false, date: null, role: 'Manager', person: null, action: 'Pending approval' },
            { stage: 'Designer Assigned', completed: false, date: null, role: 'Designer', person: null, action: 'Awaiting assignment' },
            { stage: 'Design Completed', completed: false, date: null, role: 'Designer', person: null, action: 'Pending design' },
            { stage: 'Printing', completed: false, date: null, role: 'Printer', person: null, action: 'Pending print' },
            { stage: 'Ready for Delivery', completed: false, date: null, role: 'Line Staff', person: null, action: 'Pending pickup' },
        ]
    },
    {
        id: 'ORD-2024-002',
        partnerName: 'Quick Print Hub',
        partnerType: 'dealer',
        partnerEmail: 'quick@hub.com',
        date: '2024-12-23',
        type: 'PRINT',
        jobName: 'Brochures A4 - 500 pcs',
        status: 'designing',
        cost: 4500,
        quantity: 500,
        priority: 'urgent',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-23 02:15 PM', role: 'Dealer', person: 'Quick Print Hub', action: 'Uploaded order' },
            { stage: 'Manager Approved', completed: true, date: '2024-12-23 02:45 PM', role: 'Manager', person: 'Suresh M.', action: 'Approved order' },
            { stage: 'Designer Assigned', completed: true, date: '2024-12-23 03:00 PM', role: 'Designer', person: 'Rajan K.', action: 'Picked from pool' },
            { stage: 'Design in Progress', completed: false, date: null, role: 'Designer', person: 'Rajan K.', action: 'Working on design' },
            { stage: 'Printing', completed: false, date: null, role: 'Printer', person: null, action: 'Pending' },
            { stage: 'Ready for Delivery', completed: false, date: null, role: 'Line Staff', person: null, action: 'Pending' },
        ]
    },
    {
        id: 'ORD-2024-003',
        partnerName: 'Ramesh Kumar',
        partnerType: 'customer',
        partnerEmail: 'ramesh@gmail.com',
        date: '2024-12-22',
        type: 'PAN',
        jobName: 'PAN Card - Emergency',
        status: 'printing',
        cost: 300,
        quantity: 1,
        priority: 'urgent',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-22 09:00 AM', role: 'Customer', person: 'Ramesh Kumar', action: 'Submitted PAN request' },
            { stage: 'Document Verified', completed: true, date: '2024-12-22 09:30 AM', role: 'PAN Team', person: 'Anitha S.', action: 'Verified Aadhaar & Photo' },
            { stage: 'PAN Generated', completed: true, date: '2024-12-22 10:00 AM', role: 'PAN Team', person: 'Anitha S.', action: 'PAN number generated' },
            { stage: 'Printing', completed: true, date: '2024-12-22 10:30 AM', role: 'Printer', person: 'Manoj P.', action: 'Card printed' },
            { stage: 'Quality Check', completed: true, date: '2024-12-22 11:00 AM', role: 'Printer', person: 'Manoj P.', action: 'QC passed' },
            { stage: 'Ready for Delivery', completed: false, date: null, role: 'Line Staff', person: null, action: 'Pending pickup' },
        ]
    },
    {
        id: 'ORD-2024-004',
        partnerName: 'Express Graphics',
        partnerType: 'dealer',
        partnerEmail: 'express@gfx.com',
        date: '2024-12-21',
        type: 'SEAL',
        jobName: 'Company Seal - Self Ink',
        status: 'completed',
        cost: 450,
        quantity: 2,
        priority: 'normal',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-21 11:00 AM', role: 'Dealer', person: 'Express Graphics', action: 'Submitted seal request' },
            { stage: 'Design Approved', completed: true, date: '2024-12-21 11:30 AM', role: 'Seal Team', person: 'Vijay R.', action: 'Approved seal text' },
            { stage: 'Production', completed: true, date: '2024-12-21 03:00 PM', role: 'Seal Team', person: 'Vijay R.', action: 'Seal manufactured' },
            { stage: 'Packed', completed: true, date: '2024-12-21 04:00 PM', role: 'Seal Team', person: 'Vijay R.', action: 'Ready for dispatch' },
            { stage: 'Picked by Staff', completed: true, date: '2024-12-22 08:00 AM', role: 'Line Staff', person: 'Anil K.', action: 'Collected for delivery' },
            { stage: 'Delivered', completed: true, date: '2024-12-22 10:00 AM', role: 'Line Staff', person: 'Anil K.', action: 'Delivered to dealer' },
        ]
    },
    {
        id: 'ORD-2024-005',
        partnerName: 'Priya Nair',
        partnerType: 'customer',
        partnerEmail: 'priya@gmail.com',
        date: '2024-12-20',
        type: 'PRINT',
        jobName: 'Wedding Invitation - 200 pcs',
        status: 'completed',
        cost: 3500,
        quantity: 200,
        priority: 'normal',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-20 08:00 AM', role: 'Customer', person: 'Priya Nair', action: 'Uploaded design files' },
            { stage: 'Manager Approved', completed: true, date: '2024-12-20 08:30 AM', role: 'Manager', person: 'Suresh M.', action: 'Approved job' },
            { stage: 'Designer Assigned', completed: true, date: '2024-12-20 09:00 AM', role: 'Designer', person: 'Lakshmi V.', action: 'Accepted job' },
            { stage: 'Design Finalized', completed: true, date: '2024-12-20 11:00 AM', role: 'Designer', person: 'Lakshmi V.', action: 'Customer approved design' },
            { stage: 'Printing Completed', completed: true, date: '2024-12-20 02:00 PM', role: 'Printer', person: 'Manoj P.', action: 'Printed 200 invitations' },
            { stage: 'Quality Check', completed: true, date: '2024-12-20 03:00 PM', role: 'Printer', person: 'Manoj P.', action: 'QC passed' },
            { stage: 'Packed', completed: true, date: '2024-12-20 03:30 PM', role: 'Stock Keeper', person: 'Reena T.', action: 'Packed for delivery' },
            { stage: 'Picked by Staff', completed: true, date: '2024-12-21 08:00 AM', role: 'Line Staff', person: 'Anil K.', action: 'Out for delivery' },
            { stage: 'Delivered', completed: true, date: '2024-12-21 10:00 AM', role: 'Line Staff', person: 'Anil K.', action: 'Delivered & payment collected' },
        ]
    },
    {
        id: 'ORD-2024-006',
        partnerName: 'Metro Signs',
        partnerType: 'dealer',
        partnerEmail: 'metro@signs.com',
        date: '2024-12-24',
        type: 'PRINT',
        jobName: 'Flex Banner 10x5 ft',
        status: 'pending',
        cost: 1800,
        quantity: 1,
        priority: 'urgent',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-24 11:00 AM', role: 'Dealer', person: 'Metro Signs', action: 'Uploaded banner design' },
            { stage: 'Pending Review', completed: false, date: null, role: 'Manager', person: null, action: 'Awaiting approval' },
        ]
    },
    {
        id: 'ORD-2024-007',
        partnerName: 'City Cards Hub',
        partnerType: 'dealer',
        partnerEmail: 'city@cards.com',
        date: '2024-12-23',
        type: 'PRINT',
        jobName: 'PVC Cards - 500 pcs',
        status: 'printing',
        cost: 7500,
        quantity: 500,
        priority: 'normal',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-23 09:00 AM', role: 'Dealer', person: 'City Cards Hub', action: 'Submitted order' },
            { stage: 'Approved', completed: true, date: '2024-12-23 09:30 AM', role: 'Manager', person: 'Suresh M.', action: 'Approved' },
            { stage: 'Design Done', completed: true, date: '2024-12-23 11:00 AM', role: 'Designer', person: 'Deepa K.', action: 'Design completed' },
            { stage: 'Printing', completed: false, date: null, role: 'Printer', person: 'Arun K.', action: 'In progress - 60%' },
        ]
    },
    {
        id: 'ORD-2024-008',
        partnerName: 'Digital Prints Co',
        partnerType: 'dealer',
        partnerEmail: 'digital@prints.com',
        date: '2024-12-22',
        type: 'SEAL',
        jobName: 'Rubber Stamps - 10 pcs',
        status: 'in-production',
        cost: 2500,
        quantity: 10,
        priority: 'normal',
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-22 10:00 AM', role: 'Dealer', person: 'Digital Prints Co', action: 'Submitted order' },
            { stage: 'Approved', completed: true, date: '2024-12-22 10:30 AM', role: 'Seal Team', person: 'Vijay R.', action: 'Design verified' },
            { stage: 'Production', completed: false, date: null, role: 'Seal Team', person: 'Vijay R.', action: 'Manufacturing in progress' },
        ]
    },
];

type Order = typeof MOCK_ALL_ORDERS[0];

const OrdersManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState('all');
    const [partnerFilter, setPartnerFilter] = useState('all');

    // Calculate stats
    const allOrders = MOCK_ALL_ORDERS;
    const pendingOrders = allOrders.filter(o => o.status === 'pending');
    const inProcessOrders = allOrders.filter(o => ['designing', 'printing', 'in-production'].includes(o.status));
    const completedOrders = allOrders.filter(o => o.status === 'completed');
    const urgentOrders = allOrders.filter(o => o.priority === 'urgent' && o.status !== 'completed');

    // Filter functions
    const filterOrders = (orders: Order[], statusFilter: string) => {
        return orders.filter(order => {
            const matchesSearch = order.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.jobName.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (typeFilter !== 'all' && order.type !== typeFilter) return false;
            if (partnerFilter !== 'all' && order.partnerType !== partnerFilter) return false;

            if (statusFilter === 'all') return true;
            if (statusFilter === 'in-process') return ['designing', 'printing', 'in-production'].includes(order.status);
            if (statusFilter === 'completed') return order.status === 'completed';

            return true;
        });
    };

    const toggleOrder = (orderId: string) => {
        setExpandedOrder(prev => prev === orderId ? null : orderId);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'designing':
                return <Badge className="bg-pink-100 text-pink-700 border-pink-200"><Palette className="w-3 h-3 mr-1" /> Designing</Badge>;
            case 'printing':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><PrinterIcon className="w-3 h-3 mr-1" /> Printing</Badge>;
            case 'in-production':
                return <Badge className="bg-purple-100 text-purple-700 border-purple-200"><Play className="w-3 h-3 mr-1" /> In Production</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'PRINT':
                return <Badge className="bg-purple-100 text-purple-700">Print</Badge>;
            case 'PAN':
                return <Badge className="bg-orange-100 text-orange-700">PAN Card</Badge>;
            case 'SEAL':
                return <Badge className="bg-teal-100 text-teal-700">Seal/Stamp</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Dealer': return <Store className="h-4 w-4 text-green-600" />;
            case 'Customer': return <User className="h-4 w-4 text-blue-600" />;
            case 'Manager': return <UserCheck className="h-4 w-4 text-purple-600" />;
            case 'Designer': return <Palette className="h-4 w-4 text-pink-600" />;
            case 'Printer': return <PrinterIcon className="h-4 w-4 text-orange-600" />;
            case 'PAN Team': return <FileText className="h-4 w-4 text-amber-600" />;
            case 'Seal Team': return <Package className="h-4 w-4 text-teal-600" />;
            case 'Stock Keeper': return <Box className="h-4 w-4 text-indigo-600" />;
            case 'Line Staff': return <Truck className="h-4 w-4 text-cyan-600" />;
            default: return <User className="h-4 w-4 text-gray-600" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'Dealer': 'bg-green-100 text-green-700',
            'Customer': 'bg-blue-100 text-blue-700',
            'Manager': 'bg-purple-100 text-purple-700',
            'Designer': 'bg-pink-100 text-pink-700',
            'Printer': 'bg-orange-100 text-orange-700',
            'PAN Team': 'bg-amber-100 text-amber-700',
            'Seal Team': 'bg-teal-100 text-teal-700',
            'Stock Keeper': 'bg-indigo-100 text-indigo-700',
            'Line Staff': 'bg-cyan-100 text-cyan-700',
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };

    const getProgress = (timeline: { completed: boolean }[]) => {
        const completed = timeline.filter(t => t.completed).length;
        return (completed / timeline.length) * 100;
    };

    // Render order card
    const renderOrderCard = (order: Order) => (
        <Collapsible
            key={order.id}
            open={expandedOrder === order.id}
            onOpenChange={() => toggleOrder(order.id)}
        >
            <Card className={`overflow-hidden transition-all group hover:shadow-sm border-l-4 ${order.status === 'completed' ? 'border-l-green-500' : order.priority === 'urgent' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                <CollapsibleTrigger asChild>
                    <div className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-lg bg-muted/50 text-muted-foreground`}>
                                        {order.type === 'PRINT' ? (
                                            <PrinterIcon className="w-5 h-5" />
                                        ) : order.type === 'PAN' ? (
                                            <FileText className="w-5 h-5" />
                                        ) : (
                                            <Package className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-base">{order.id}</span>
                                            {getTypeBadge(order.type)}
                                            {order.priority === 'urgent' && order.status !== 'completed' && (
                                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Urgent</Badge>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-sm mt-0.5">{order.jobName}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                                            <span className="font-medium text-foreground/80">{order.partnerName}</span>
                                            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full capitalize">{order.partnerType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-lg flex items-center justify-end gap-1">
                                            <IndianRupee className="w-4 h-4" /> {order.cost.toLocaleString()}
                                        </p>
                                        <div className="flex items-center justify-end gap-2 mt-1">
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                                            <Calendar className="w-3 h-3" /> {order.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        {expandedOrder === order.id ? (
                                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="pt-0 pb-4 border-t bg-muted/20">
                        <div className="pt-4 space-y-4">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order Progress</span>
                                    <span className="font-medium">{Math.round(getProgress(order.timeline))}%</span>
                                </div>
                                <Progress value={getProgress(order.timeline)} className="h-2" />
                            </div>

                            {/* Timeline */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Order Timeline
                                </h4>
                                <div className="relative pl-4">
                                    {order.timeline.map((step, index) => (
                                        <div key={index} className="relative pb-4 last:pb-0">
                                            {index < order.timeline.length - 1 && (
                                                <div className={`absolute left-[7px] top-[20px] w-0.5 h-full ${step.completed ? 'bg-green-500' : 'bg-muted'}`} />
                                            )}
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-muted border-2 border-muted-foreground/30'}`}>
                                                    {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {step.stage}
                                                        </p>
                                                        <Badge variant="outline" className={`text-xs gap-1 ${getRoleBadgeColor(step.role)}`}>
                                                            {getRoleIcon(step.role)}
                                                            {step.role}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        {step.person ? (
                                                            <span className="font-medium text-foreground">{step.person}</span>
                                                        ) : (
                                                            <span className="italic">Pending</span>
                                                        )}
                                                        {step.action && <span> — {step.action}</span>}
                                                    </div>
                                                    {step.date && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Clock className="w-3 h-3" /> {step.date}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">Order ID</p>
                                    <p className="font-medium">{order.id}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">Quantity</p>
                                    <p className="font-medium">{order.quantity} pcs</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">Partner Email</p>
                                    <p className="font-medium text-sm truncate">{order.partnerEmail}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">Partner Type</p>
                                    <p className="font-medium capitalize">{order.partnerType}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                </Button>
                                {order.status !== 'completed' && (
                                    <Button variant="outline" size="sm">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Update Status
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all orders</p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Orders
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                            <div className="text-2xl font-bold">{allOrders.length}</div>
                        </div>
                        <div className="p-2 rounded-full bg-slate-100">
                            <ShoppingCart className="h-4 w-4 text-slate-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
                        </div>
                        <div className="p-2 rounded-full bg-yellow-100">
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">In Process</p>
                            <div className="text-2xl font-bold text-blue-600">{inProcessOrders.length}</div>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <Play className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <div className="text-2xl font-bold text-green-600">{completedOrders.length}</div>
                        </div>
                        <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Urgent Alert */}
            {urgentOrders.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <p className="font-medium text-red-700">
                                {urgentOrders.length} urgent order{urgentOrders.length > 1 ? 's' : ''} require immediate attention
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID, name, or job..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="PRINT">Print</SelectItem>
                            <SelectItem value="PAN">PAN Card</SelectItem>
                            <SelectItem value="SEAL">Seal/Stamp</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Partner" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Partners</SelectItem>
                            <SelectItem value="dealer">Dealers</SelectItem>
                            <SelectItem value="customer">Customers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        All Orders ({filterOrders(allOrders, 'all').length})
                    </TabsTrigger>
                    <TabsTrigger value="in-process" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        In Process ({filterOrders(allOrders, 'in-process').length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Completed ({filterOrders(allOrders, 'completed').length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3">
                    {filterOrders(allOrders, 'all').length === 0 ? (
                        <Card className="p-12 text-center border-dashed border-2">
                            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                            <h4 className="text-lg font-medium text-muted-foreground mb-1">No Orders Found</h4>
                            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </Card>
                    ) : (
                        filterOrders(allOrders, 'all').map(order => renderOrderCard(order))
                    )}
                </TabsContent>

                <TabsContent value="in-process" className="space-y-3">
                    {filterOrders(allOrders, 'in-process').length === 0 ? (
                        <Card className="p-12 text-center border-dashed border-2">
                            <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                            <h4 className="text-lg font-medium text-muted-foreground mb-1">No Orders In Process</h4>
                            <p className="text-sm text-muted-foreground">All orders are either pending or completed</p>
                        </Card>
                    ) : (
                        filterOrders(allOrders, 'in-process').map(order => renderOrderCard(order))
                    )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-3">
                    {filterOrders(allOrders, 'completed').length === 0 ? (
                        <Card className="p-12 text-center border-dashed border-2">
                            <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                            <h4 className="text-lg font-medium text-muted-foreground mb-1">No Completed Orders</h4>
                            <p className="text-sm text-muted-foreground">Completed orders will appear here</p>
                        </Card>
                    ) : (
                        filterOrders(allOrders, 'completed').map(order => renderOrderCard(order))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrdersManagement;
