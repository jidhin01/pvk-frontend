import React from 'react';
import {
    FileText,
    Printer,
    CheckCircle,
    AlertCircle,
    Edit,
    Lock,
    Download,
    CreditCard,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CURRENT_DEALER, RECENT_ORDERS, Order } from '@/data/mockDealerData';

export default function DealerDashboard() {
    const activeOrdersCount = RECENT_ORDERS.filter(o => o.status === 'printing' || o.status === 'pending').length;
    const availableCredit = CURRENT_DEALER.creditLimit - CURRENT_DEALER.currentBalance;
    // Assuming 'rejected' logic - currently 0 based on mock data, but logic is in place
    const actionRequiredCount = RECENT_ORDERS.filter(o => (o as any).status === 'rejected').length;

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200';
            case 'printing': return 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeBadge = (type: Order['type']) => {
        switch (type) {
            case 'PRINT': return <Badge variant="outline" className="border-blue-500 text-blue-500">Print</Badge>;
            case 'PAN': return <Badge variant="outline" className="border-purple-500 text-purple-500">PAN</Badge>;
            case 'SEAL': return <Badge variant="outline" className="border-orange-500 text-orange-500">Seal</Badge>;
            default: return <Badge variant="outline">Other</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeOrdersCount}</div>
                        <p className="text-xs text-muted-foreground">In pipeline (Pending + Printing)</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{availableCredit.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From total limit of ₹{CURRENT_DEALER.creditLimit.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{actionRequiredCount}</div>
                        <p className="text-xs text-muted-foreground">Rejected or disputed items</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {RECENT_ORDERS.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{order.jobName}</span>
                                            {/* Optional details based on type */}
                                            <span className="text-xs text-muted-foreground">
                                                {order.type === 'PRINT' && `Material: ${order.material}`}
                                                {order.type === 'PAN' && `Applicant: ${order.applicant}`}
                                                {order.type === 'SEAL' && `Matter: ${order.matter}`}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(order.type)}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)} variant="outline">
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">₹{order.cost}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            {order.status === 'pending' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Order</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}

                                            {(order.status === 'printing' || order.status === 'delivered') && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground cursor-not-allowed">
                                                                <Lock className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Order Locked</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}

                                            {order.status === 'delivered' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-8 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                                                                <Download className="h-3 w-3 mr-1" /> Challan
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Download Delivery Challan</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
