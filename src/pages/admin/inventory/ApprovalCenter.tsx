import React, { useState } from 'react';
import { useInventoryContext } from '@/contexts/InventoryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, FileText, AlertTriangle } from 'lucide-react';
import { PurchaseRequest } from '@/data/mockInventoryData';
import { toast } from 'sonner';

export default function ApprovalCenter() {
    const {
        purchaseRequests,
        setPurchaseRequests,
        pendingAdjustments,
        approveAdjustment,
        rejectAdjustment
    } = useInventoryContext();
    const [activeTab, setActiveTab] = useState('purchase');

    // Filter Pending Requests
    const pendingPurchaseRequests = purchaseRequests.filter(req => req.status === 'PENDING');

    const handleApprovePurchase = (request: PurchaseRequest) => {
        // In a real app, this would generate a PO. 
        // For simulation, we might auto-receive or check 'ORDERED' status.
        // Let's mark it as ORDERED first.
        setPurchaseRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'ORDERED' } : r));
        toast.success(`Purchase Order generated for ${request.itemName}`);
    };

    const handleRejectPurchase = (id: string) => {
        // Technically we might want a REJECTED status, but let's just remove it or mark REJECTED if supported
        setPurchaseRequests(prev => prev.filter(r => r.id !== id));
        toast.info("Request Rejected");
    };

    // Dummy data for Adjustments as we didn't mock a separate "Pending Adjustment" list
    // In a real scenario, adjustments might need approval before effecting stock.
    // Currently handleAdjustment effects stock immediately. 
    // We will simulate a "Pending Write-off" list here for valid UI demonstration.
    const handleApproveAdjustment = (id: string) => {
        approveAdjustment(id);
    };

    const handleRejectAdjustment = (id: string) => {
        rejectAdjustment(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Approval Center</h2>
                    <p className="text-muted-foreground">Review and authorize inventory actions.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="purchase" className="relative">
                        Purchase Requests
                        {pendingPurchaseRequests.length > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                                {pendingPurchaseRequests.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="adjustments">
                        Stock Write-offs
                        {pendingAdjustments.length > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] text-white">
                                {pendingAdjustments.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="purchase" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Purchase Requests</CardTitle>
                            <CardDescription>Requests from Stock Keepers for new materials.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Item Details</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Urgency</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingPurchaseRequests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                No pending requests.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pendingPurchaseRequests.map(req => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-mono text-xs">{req.date}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{req.itemName}</div>
                                                    <div className="text-xs text-muted-foreground">Stock: {req.currentStock}</div>
                                                </TableCell>
                                                <TableCell className="font-bold">{req.requestedQty}</TableCell>
                                                <TableCell>{req.supplier}</TableCell>
                                                <TableCell>
                                                    <Badge variant={req.urgency === 'HIGH' ? 'destructive' : 'secondary'}>
                                                        {req.urgency}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRejectPurchase(req.id)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprovePurchase(req)}>
                                                            <Check className="mr-2 h-4 w-4" /> Approve PO
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="adjustments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Stock Write-offs</CardTitle>
                            <CardDescription>Review damage reports and confirmed thefts/losses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Loss Quantity</TableHead>
                                        <TableHead>Cost Impact</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingAdjustments.map((adj) => (
                                        <TableRow key={adj.id}>
                                            <TableCell className="font-mono text-xs">{adj.date}</TableCell>
                                            <TableCell className="font-medium">{adj.itemName}</TableCell>
                                            <TableCell>{adj.qty} {adj.unit}</TableCell>
                                            <TableCell className="text-red-600 font-bold">₹{adj.cost}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                                    {adj.reason}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleRejectAdjustment(adj.id)}>
                                                        Reject
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleApproveAdjustment(adj.id)}>
                                                        Authorize Write-off
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
