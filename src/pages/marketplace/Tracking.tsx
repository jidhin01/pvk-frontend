import React, { useState } from 'react';
import {
    Search,
    Filter,
    Clock,
    CheckCircle2,
    Printer as PrinterIcon,
    ChevronDown,
    ChevronUp,
    Package,
    Calendar,
    FileText,
    Layers,
    IndianRupee
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RECENT_ORDERS, Order, PrintOrder, ServiceOrder } from '@/data/mockMarketplaceData';

export default function Tracking() {
    const [filter, setFilter] = useState('all');
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

    const filteredOrders = RECENT_ORDERS.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'production') return ['printing', 'processing'].includes(order.status);
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

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'printing':
                return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><PrinterIcon className="w-3 h-3 mr-1" /> In Production</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: Order['type']) => {
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

    const renderOrderDetails = (order: Order) => {
        if (order.type === 'PRINT') {
            const printOrder = order as PrintOrder;
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Specifications
                        </h4>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-sm"><span className="font-medium">Dimensions:</span> {printOrder.specs.dimensions}</p>
                            <p className="text-sm"><span className="font-medium">Media Type:</span> {printOrder.specs.mediaType}</p>
                            <p className="text-sm"><span className="font-medium">Quality:</span> {printOrder.specs.quality}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" /> File Information
                        </h4>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-sm"><span className="font-medium">File:</span> {printOrder.fileUrl === '#' ? 'Uploaded' : printOrder.fileUrl}</p>
                            {printOrder.goodsType && (
                                <p className="text-sm"><span className="font-medium">Goods Type:</span> {printOrder.goodsType === 'finished' ? 'Finished' : 'Unfinished'}</p>
                            )}
                            {printOrder.printType && (
                                <p className="text-sm"><span className="font-medium">Print Type:</span> {printOrder.printType.toUpperCase()}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Package className="w-4 h-4" /> Order Info
                        </h4>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-sm"><span className="font-medium">Order ID:</span> {order.id}</p>
                            <p className="text-sm"><span className="font-medium">Date:</span> {order.date}</p>
                            <p className="text-sm"><span className="font-medium">Cost:</span> ₹{order.cost}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            const serviceOrder = order as ServiceOrder;
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Service Details
                        </h4>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            {serviceOrder.details && Object.entries(serviceOrder.details).map(([key, value]) => (
                                <p key={key} className="text-sm">
                                    <span className="font-medium capitalize">{key}:</span> {String(value)}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Package className="w-4 h-4" /> Order Info
                        </h4>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-sm"><span className="font-medium">Order ID:</span> {order.id}</p>
                            <p className="text-sm"><span className="font-medium">Date:</span> {order.date}</p>
                            <p className="text-sm"><span className="font-medium">Cost:</span> ₹{order.cost}</p>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Order Tracking</h2>
                    <p className="text-muted-foreground">Monitor status and history of your orders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search job name..." className="pl-9 w-[200px]" />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList>
                        <TabsTrigger value="all">All Orders</TabsTrigger>
                        <TabsTrigger value="production">In Production</TabsTrigger>
                        <TabsTrigger value="delivered">Delivered</TabsTrigger>
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
                                                            <h3 className="font-semibold">{order.jobName}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {getTypeBadge(order.type)}
                                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" /> {order.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="font-semibold flex items-center justify-end gap-1">
                                                                <IndianRupee className="w-4 h-4" /> {order.cost}
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
                                            <div className="pt-4">
                                                {renderOrderDetails(order)}
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
                                <p className="text-muted-foreground">No orders found under this filter.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
