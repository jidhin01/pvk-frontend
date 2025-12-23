import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Edit,
    Lock,
    Clock,
    CheckCircle2,
    Printer as PrinterIcon,
    XCircle,
    LayoutList
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RECENT_ORDERS, Order } from '@/data/mockDealerData';

export default function OrdersPage() {
    const [filter, setFilter] = useState('all');

    const filteredOrders = RECENT_ORDERS.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'processing') return ['printing', 'processing'].includes(order.status);
        if (filter === 'delivered') return order.status === 'delivered';
        return true;
    });

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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Active Orders</h2>
                    <p className="text-muted-foreground">Manage ongoing jobs and view order history.</p>
                </div>

            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LayoutList className="h-5 w-5 text-primary" />
                            Order List
                        </CardTitle>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search job name..." className="pl-9" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All Orders</TabsTrigger>
                            <TabsTrigger value="processing">In Production</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                        </TabsList>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Name</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Cost</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order, index) => (
                                            <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium text-foreground">
                                                    {order.jobName}
                                                    {order.goodsType && <div className="text-xs text-muted-foreground capitalize">{order.goodsType}</div>}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-normal">{order.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                <TableCell className="text-right font-semibold">₹{order.cost}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Pending Actions */}
                                                        {order.status === 'pending' && (
                                                            <>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Edit Order</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}

                                                        {/* Production Actions (Locked) */}
                                                        {order.status === 'printing' && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground cursor-not-allowed bg-muted/20">
                                                                            <Lock className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Order is locked for production</TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}

                                                        {/* Delivered Actions */}
                                                        {order.status === 'delivered' && (
                                                            <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                                                                <Download className="h-3 w-3 mr-1" /> Challan
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                No orders found matching the selected filter.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
