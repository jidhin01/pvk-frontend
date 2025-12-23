import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Edit,
    XCircle,
    Lock,
    Clock,
    CheckCircle2,
    Printer as PrinterIcon
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
import { RECENT_ORDERS, Order } from '@/data/mockDealerData';

export default function Tracking() {
    const [filter, setFilter] = useState('all');

    const filteredOrders = RECENT_ORDERS.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'production') return ['printing', 'processing'].includes(order.status);
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
                <TabsList>
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="production">In Production</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>

                <div className="rounded-md border mt-4">
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
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{order.jobName}</TableCell>
                                        <TableCell>{order.type}</TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="text-right">₹{order.cost}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Pending Actions */}
                                                {order.status === 'pending' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}

                                                {/* Production Actions (Locked) */}
                                                {order.status === 'printing' && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground cursor-not-allowed">
                                                                    <Lock className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Production Started - Cannot Edit</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                {/* Delivered Actions */}
                                                {order.status === 'delivered' && (
                                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                                        <Download className="h-3 w-3 mr-1" /> Challan
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found under this filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>
        </div>
    );
}
