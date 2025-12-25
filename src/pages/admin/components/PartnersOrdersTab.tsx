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
    Upload,
    UserCheck,
    Box,
    MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PartnersOrdersTabProps {
    partnerType: 'dealer' | 'customer';
}

// Enhanced timeline with role-based tracking
const MOCK_PARTNER_ORDERS = [
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
        status: 'processing',
        cost: 4500,
        quantity: 500,
        timeline: [
            { stage: 'Order Placed', completed: true, date: '2024-12-23 02:15 PM', role: 'Dealer', person: 'Quick Print Hub', action: 'Uploaded order' },
            { stage: 'Manager Approved', completed: true, date: '2024-12-23 02:45 PM', role: 'Manager', person: 'Suresh M.', action: 'Approved order' },
            { stage: 'Designer Assigned', completed: true, date: '2024-12-23 03:00 PM', role: 'Designer', person: 'Rajan K.', action: 'Picked from pool' },
            { stage: 'Design Completed', completed: true, date: '2024-12-23 04:30 PM', role: 'Designer', person: 'Rajan K.', action: 'Submitted design' },
            { stage: 'Printing', completed: false, date: null, role: 'Printer', person: null, action: 'In queue' },
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
        status: 'delivered',
        cost: 450,
        quantity: 2,
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
        status: 'delivered',
        cost: 3500,
        quantity: 200,
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
];

const PartnersOrdersTab: React.FC<PartnersOrdersTabProps> = ({ partnerType }) => {
    const [filter, setFilter] = useState('all');
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = MOCK_PARTNER_ORDERS.filter(order => {
        const matchesSearch = order.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.jobName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'pending';
        if (filter === 'processing') return ['printing', 'processing'].includes(order.status);
        if (filter === 'delivered') return order.status === 'delivered';
        return true;
    });

    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const expandAll = () => {
        setExpandedOrders(filteredOrders.map(order => order.id));
    };

    const collapseAll = () => {
        setExpandedOrders([]);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'processing':
                return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><Palette className="w-3 h-3 mr-1" /> Design</Badge>;
            case 'printing':
                return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50"><PrinterIcon className="w-3 h-3 mr-1" /> Printing</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'PRINT':
                return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Print</Badge>;
            case 'PAN':
                return <Badge className="bg-orange-100 text-orange-700 border-orange-200">PAN Card</Badge>;
            case 'SEAL':
                return <Badge className="bg-teal-100 text-teal-700 border-teal-200">Seal/Stamp</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Dealer':
                return <Store className="h-4 w-4 text-green-600" />;
            case 'Customer':
                return <User className="h-4 w-4 text-blue-600" />;
            case 'Manager':
                return <UserCheck className="h-4 w-4 text-purple-600" />;
            case 'Designer':
                return <Palette className="h-4 w-4 text-pink-600" />;
            case 'Printer':
                return <PrinterIcon className="h-4 w-4 text-orange-600" />;
            case 'PAN Team':
                return <FileText className="h-4 w-4 text-amber-600" />;
            case 'Seal Team':
                return <Package className="h-4 w-4 text-teal-600" />;
            case 'Stock Keeper':
                return <Box className="h-4 w-4 text-indigo-600" />;
            case 'Line Staff':
                return <Truck className="h-4 w-4 text-cyan-600" />;
            default:
                return <User className="h-4 w-4 text-gray-600" />;
        }
    };

    const getRoleBadge = (role: string) => {
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

    const getProgress = (timeline: { stage: string; completed: boolean }[]) => {
        const completed = timeline.filter(t => t.completed).length;
        return (completed / timeline.length) * 100;
    };

    // Count orders by status
    const pendingCount = MOCK_PARTNER_ORDERS.filter(o => o.status === 'pending').length;
    const processingCount = MOCK_PARTNER_ORDERS.filter(o => ['printing', 'processing'].includes(o.status)).length;
    const deliveredCount = MOCK_PARTNER_ORDERS.filter(o => o.status === 'delivered').length;

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs and Controls */}
            <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList>
                        <TabsTrigger value="all">All ({MOCK_PARTNER_ORDERS.length})</TabsTrigger>
                        <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                        <TabsTrigger value="processing">In Process ({processingCount})</TabsTrigger>
                        <TabsTrigger value="delivered">Delivered ({deliveredCount})</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={expandAll}>
                            <ChevronDown className="w-4 h-4 mr-1" /> Expand All
                        </Button>
                        <Button variant="outline" size="sm" onClick={collapseAll}>
                            <ChevronUp className="w-4 h-4 mr-1" /> Collapse All
                        </Button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3 mt-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <Collapsible
                                key={order.id}
                                open={expandedOrders.includes(order.id)}
                                onOpenChange={() => toggleOrder(order.id)}
                            >
                                <Card className="overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <div className="cursor-pointer hover:bg-muted/50 transition-colors">
                                            <div className="p-4">
                                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-primary/10">
                                                            {order.type === 'PRINT' ? (
                                                                <PrinterIcon className="w-5 h-5 text-primary" />
                                                            ) : order.type === 'PAN' ? (
                                                                <FileText className="w-5 h-5 text-primary" />
                                                            ) : (
                                                                <Package className="w-5 h-5 text-primary" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="font-semibold">{order.jobName}</h3>
                                                                {getTypeBadge(order.type)}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                                                                {order.partnerType === 'dealer' ? (
                                                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs gap-1">
                                                                        <Store className="w-3 h-3" /> DEALER
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs gap-1">
                                                                        <User className="w-3 h-3" /> CUSTOMER
                                                                    </Badge>
                                                                )}
                                                                <span>{order.partnerName}</span>
                                                                <span>•</span>
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{order.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="font-semibold flex items-center justify-end gap-1">
                                                                <IndianRupee className="w-4 h-4" /> {order.cost.toLocaleString()}
                                                            </p>
                                                            <div className="mt-1">
                                                                {getStatusBadge(order.status)}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {expandedOrders.includes(order.id) ? (
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
                                                        <span className="text-muted-foreground">Progress</span>
                                                        <span className="font-medium">{Math.round(getProgress(order.timeline))}%</span>
                                                    </div>
                                                    <Progress value={getProgress(order.timeline)} className="h-2" />
                                                </div>

                                                {/* Detailed Timeline with Role Info */}
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                                        <Layers className="w-4 h-4" /> Order Timeline
                                                    </h4>
                                                    <div className="relative pl-4">
                                                        {order.timeline.map((step, index) => (
                                                            <div key={index} className="relative pb-4 last:pb-0">
                                                                {/* Connector line */}
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
                                                                            {/* Role Badge */}
                                                                            <Badge variant="outline" className={`text-xs gap-1 ${getRoleBadge(step.role)}`}>
                                                                                {getRoleIcon(step.role)}
                                                                                {step.role}
                                                                            </Badge>
                                                                        </div>
                                                                        {/* Person and Action */}
                                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                                            {step.person ? (
                                                                                <span className="font-medium text-foreground">{step.person}</span>
                                                                            ) : (
                                                                                <span className="italic">Pending</span>
                                                                            )}
                                                                            {step.action && (
                                                                                <span> — {step.action}</span>
                                                                            )}
                                                                        </div>
                                                                        {step.date && (
                                                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                                <Clock className="w-3 h-3" />
                                                                                {step.date}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Order Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
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
                                                        <p className="font-medium">{order.partnerEmail}</p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" /> View Full Details
                                                    </Button>
                                                    {order.status !== 'delivered' && (
                                                        <Button variant="outline" size="sm">
                                                            <Truck className="w-4 h-4 mr-2" /> Update Status
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No orders found matching your criteria.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </Tabs>
        </div>
    );
};

export default PartnersOrdersTab;
