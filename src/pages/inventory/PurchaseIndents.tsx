
import React, { useState } from 'react';
import { PurchaseRequest, InventoryItem } from '@/data/mockInventoryData';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PurchaseIndentsProps {
    requests: PurchaseRequest[];
    inventory: InventoryItem[]; // To pick items to request
    onRequestUpdate: (updatedRequests: PurchaseRequest[]) => void;
}

export function PurchaseIndents({ requests, inventory, onRequestUpdate }: PurchaseIndentsProps) {
    const handleStatusChange = (id: string, newStatus: PurchaseRequest['status']) => {
        const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
        onRequestUpdate(updated);
        toast.success(`Order marked as ${newStatus}`);
    };

    const handleAutoGenerate = () => {
        const lowStock = inventory.filter(i => i.quantity < i.minLevel);
        const newRequests: PurchaseRequest[] = lowStock.map(i => {
            const baseNeed = i.minLevel * 2;
            const purchaseNeed = Math.ceil(baseNeed / i.conversionRatio);
            const finalBaseQty = purchaseNeed * i.conversionRatio;

            return {
                id: `PR-${Date.now()}-${i.id}`,
                itemId: i.id,
                itemName: i.name,
                currentStock: i.quantity,
                requestedQty: finalBaseQty, // Round up to full Packs
                status: 'PENDING',
                supplier: i.lastSupplier || 'Unknown',
                urgency: 'HIGH',
                date: new Date().toISOString().split('T')[0]
            };
        });

        // Filter out duplicates (if already pending)
        const existingItemIds = new Set(requests.filter(r => r.status === 'PENDING').map(r => r.itemId));
        const filteredNew = newRequests.filter(r => !existingItemIds.has(r.itemId));

        if (filteredNew.length === 0) {
            toast.info("No new low stock items to order.");
            return;
        }

        onRequestUpdate([...filteredNew, ...requests]);
        toast.success(`Generated ${filteredNew.length} purchase requests.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                        Purchase Indents
                    </h2>
                    <p className="text-muted-foreground">Manage shopping lists and supplier orders.</p>
                </div>
                <Button onClick={handleAutoGenerate}>
                    <Plus className="mr-2 h-4 w-4" /> Auto-Fill Low Stock
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-right">Current Stock</TableHead>
                            <TableHead className="text-right">To Buy</TableHead>
                            <TableHead>Urgency</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    No active purchase requests.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <div className="font-medium">{req.itemName}</div>
                                        <div className="text-xs text-muted-foreground">{req.date}</div>
                                    </TableCell>
                                    <TableCell>{req.supplier}</TableCell>
                                    <TableCell className="text-right tabular-nums text-red-600 font-medium">
                                        {req.currentStock} {inventory.find(i => i.id === req.itemId)?.baseUnit}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-bold text-lg">
                                        {(() => {
                                            const item = inventory.find(i => i.id === req.itemId);
                                            if (item && item.conversionRatio > 1) {
                                                const purchaseQty = Math.ceil(req.requestedQty / item.conversionRatio);
                                                return <span title={`${req.requestedQty} ${item.baseUnit}`}>{purchaseQty} {item.purchaseUnit}</span>;
                                            }
                                            return <span>{req.requestedQty} {item?.baseUnit}</span>;
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={req.urgency === 'HIGH' ? "destructive" : "secondary"}>
                                            {req.urgency}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            req.status === 'PENDING' ? "border-orange-300 text-orange-700 bg-orange-50" :
                                                req.status === 'ORDERED' ? "border-blue-300 text-blue-700 bg-blue-50" :
                                                    "border-emerald-300 text-emerald-700 bg-emerald-50"
                                        )}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'PENDING' && (
                                            <Button size="sm" onClick={() => handleStatusChange(req.id, 'ORDERED')}>
                                                Mark Ordered
                                            </Button>
                                        )}
                                        {req.status === 'ORDERED' && (
                                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200" onClick={() => handleStatusChange(req.id, 'RECEIVED')}>
                                                <CheckCircle className="mr-2 h-3 w-3" /> Received
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
