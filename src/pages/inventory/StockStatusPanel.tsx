import React from 'react';
import { useInventoryContext } from '@/contexts/InventoryContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

export function StockStatusPanel() {
    const { purchaseRequests, scrapReports, pendingAdjustments } = useInventoryContext();

    const pendingRequests = purchaseRequests.filter(r => r.status === 'PENDING');
    const recentApprovals = purchaseRequests.filter(r => r.status !== 'PENDING').slice(0, 5);
    const myPendingAdjustments = pendingAdjustments.filter(a => a.requestedBy === 'Stock Keeper');

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Purchase Request Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Pending Approval</span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                {pendingRequests.length}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Recent Updates</span>
                            <ScrollArea className="h-[150px]">
                                {recentApprovals.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic">No recent updates.</p>
                                ) : (
                                    recentApprovals.map(req => (
                                        <div key={req.id} className="flex items-start gap-2 text-xs py-2 border-b last:border-0">
                                            {req.status === 'ORDERED' || req.status === 'RECEIVED' ? (
                                                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-3 w-3 text-red-600 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="font-medium">{req.itemName}</p>
                                                <p className="text-muted-foreground">
                                                    qty: {req.requestedQty} • <span className={req.status === 'ORDERED' ? "text-green-600" : "text-red-600"}>{req.status}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </CardContent>
            </Card>


            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pending Approvals (Write-offs)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[150px]">
                        {myPendingAdjustments.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No pending write-off requests.</p>
                        ) : (
                            myPendingAdjustments.map(adj => (
                                <div key={adj.id} className="flex items-start gap-2 text-xs py-2 border-b last:border-0">
                                    <Clock className="h-3 w-3 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium">{adj.itemName}</p>
                                        <p className="text-muted-foreground">{adj.qty} {adj.unit} • {adj.reason}</p>
                                        <p className="text-[10px] text-orange-600">Waiting for Admin</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div >
    );
}
