
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Stamp,
    Layers,
    Printer,
    Hammer,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Box,
    Eye,
    Pencil
} from 'lucide-react';
import { MOCK_SEAL_ORDERS, SealOrder } from '@/data/mockSealData';
import { MOCK_INVENTORY } from '@/data/mockInventoryData';
import SealStudioLayout from '../dealer/services/seals/studio/SealStudioLayout';
import { SEAL_TEMPLATES } from '@/data/mockSealCatalog';
import { DashboardLayout } from '@/components/layout';
import { toast } from 'sonner';

const SealTeamDashboard = () => {
    // Note: In a real app, filtering would use state management or API
    const [orders, setOrders] = useState<SealOrder[]>(MOCK_SEAL_ORDERS);
    const [editingOrder, setEditingOrder] = useState<SealOrder | null>(null);
    const navigate = useNavigate();

    // Derived State for Workflow Buckets
    const pendingBatch = orders.filter(o => o.status === 'pending_batch');
    const exposureReady = orders.filter(o => o.status === 'exposure_done'); // Ready for mounting
    const mountingInProgress = orders.filter(o => o.status === 'mounting');
    const completed = orders.filter(o => o.status === 'completed');

    // Batch Meter Logic (Assuming 1 A4 sheet fits ~20 small seals)
    const batchFullness = Math.min((pendingBatch.length / 10) * 100, 100);

    const handleStatusUpdate = (id: string, newStatus: SealOrder['status']) => {
        setOrders(prev => prev.map(o =>
            o.id === id ? { ...o, status: newStatus } : o
        ));

        // Simulating Inventory Logic Hook Trigger
        if (newStatus === 'completed') {
            const order = orders.find(o => o.id === id);
            // INVENTORY LOGIC (Simulated)
            let itemToDeduct = null;
            if (order?.type === 'SELF_INK') {
                // Find matching machine
                itemToDeduct = MOCK_INVENTORY.find(i => i.name.includes(order.machineModel || ''));
            } else if (order?.type === 'WOODEN') {
                itemToDeduct = MOCK_INVENTORY.find(i => i.name.includes('Wooden Handle'));
            }

            if (itemToDeduct) {
                toast.success(`Inventory Updated: Deducted 1x ${itemToDeduct.name}`);
                toast.success(`Dealer Notified: Order ${order?.id} is Ready for Pickup`);
            } else {
                toast.success("Order marked as Completed (No stock item linked)");
            }
        } else {
            toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
        }
    };

    const runBatch = () => {
        // Navigate to the Batching Workstation
        navigate('/seal/batching');
    };

    return (
        <DashboardLayout>
            {() => (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Stamp className="h-8 w-8 text-purple-600" />
                            Seal Manufacturing Unit
                        </h1>
                        <p className="text-muted-foreground">Batch production and assembly workflow.</p>
                    </div>

                    {/* The Batch Meter Widget (Crucial Requirement) */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="col-span-2 border-l-4 border-l-purple-500 shadow-sm bg-purple-50/50 dark:bg-purple-900/10 dark:border-slate-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex justify-between">
                                    <span>Exposure Sheet Status</span>
                                    <span className="text-purple-700 dark:text-purple-400">{pendingBatch.length} Orders Pending</span>
                                </CardTitle>
                                <CardDescription>Don't waste film! Wait for the batch to fill up.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <span>0% (Empty)</span>
                                        <span>50% (Recommended)</span>
                                        <span>100% (Full Sheet)</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-600 transition-all duration-700 ease-out"
                                            style={{ width: `${batchFullness}%` }}
                                        />
                                    </div>
                                    <Button
                                        className="w-full mt-2"
                                        onClick={runBatch}
                                        disabled={pendingBatch.length === 0}
                                        variant={batchFullness > 40 ? 'default' : 'secondary'}
                                    >
                                        <Printer className="mr-2 h-4 w-4" />
                                        {batchFullness > 40 ? 'Run Exposure Batch Now' : 'Wait for More Orders'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Mounting Queue</CardTitle>
                                <Hammer className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-orange-600 dark:text-orange-400">
                                    {exposureReady.length + mountingInProgress.length}
                                </div>
                                <p className="text-xs text-muted-foreground">Rubber ready to attach</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                    {completed.length}
                                </div>
                                <p className="text-xs text-muted-foreground">Ready for delivery</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Workflow Swimlanes */}
                    <div className="grid gap-6 md:grid-cols-3">

                        {/* Lane 1: Pending Batch */}
                        <div className="space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Layers className="h-4 w-4" /> Pending Batch
                            </h3>
                            {pendingBatch.map(order => (
                                <SealOrderCard
                                    key={order.id}
                                    order={order}
                                    onEdit={() => setEditingOrder(order)}
                                />
                            ))}
                            {pendingBatch.length === 0 && <EmptyState message="No pending orders" />}
                        </div>

                        {/* Lane 2: Mounting & Assembly */}
                        <div className="space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                <Hammer className="h-4 w-4" /> Assembly Line
                            </h3>
                            {exposureReady.concat(mountingInProgress).map(order => (
                                <SealOrderCard
                                    key={order.id}
                                    order={order}
                                    actionLabel="Mark Assembled"
                                    onAction={() => handleStatusUpdate(order.id, 'completed')}
                                    secondaryAction={order.status === 'exposure_done' ? {
                                        label: 'Start Mounting',
                                        onClick: () => handleStatusUpdate(order.id, 'mounting')
                                    } : undefined}
                                    onEdit={() => setEditingOrder(order)}
                                />
                            ))}
                            {(exposureReady.length + mountingInProgress.length) === 0 && <EmptyState message="Assembly line clear" />}
                        </div>

                        {/* Lane 3: Completed */}
                        <div className="space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" /> Completed
                            </h3>
                            {completed.map(order => (
                                <SealOrderCard key={order.id} order={order} isCompleted />
                            ))}
                        </div>
                    </div>
                    {/* Quick Edit Overlay */}
                    {editingOrder && (
                        <div className="fixed inset-0 z-50 bg-background animate-in fade-in slide-in-from-bottom-5">
                            <SealStudioLayout
                                template={SEAL_TEMPLATES[0]}
                                initialBlocks={[{ id: '1', type: 'TEXT', content: editingOrder.content, fontSize: 12, align: 'center', bold: true }]}
                                onBack={() => setEditingOrder(null)}
                                onComplete={() => {
                                    toast.success("Design Corrections Saved");
                                    setEditingOrder(null);
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

// --- Sub-Components ---

const SealOrderCard = ({
    order,
    actionLabel,
    onAction,
    secondaryAction,
    isCompleted,
    onEdit
}: {
    order: SealOrder,
    actionLabel?: string,
    onAction?: () => void,
    secondaryAction?: { label: string, onClick: () => void },
    isCompleted?: boolean,
    onEdit?: () => void
}) => {
    // Inventory Logic for Card
    const inventoryItem = order.type === 'SELF_INK'
        ? MOCK_INVENTORY.find(i => i.name.includes(order.machineModel || ''))
        : order.type === 'WOODEN'
            ? MOCK_INVENTORY.find(i => i.name.includes('Wooden Handle'))
            : null;

    const isOutOfStock = inventoryItem ? inventoryItem.shopQty <= 0 : false;

    return (
        <Card className={`
            shadow-sm hover:shadow-md transition-all 
            ${order.isUrgent ? 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10' : 'dark:border-slate-800'}
        `}>
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <span className="font-medium text-sm line-clamp-2" title={order.content}>
                        {order.content}
                    </span>
                    <div className="flex items-center gap-1">
                        {onEdit && (
                            <Button size="icon" variant="ghost" className="h-5 w-5 text-muted-foreground" title="Quick Edit" onClick={onEdit}>
                                <Pencil className="h-3 w-3" />
                            </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-5 w-5 text-muted-foreground" title="View Design" onClick={() => toast.info("Opening Design Preview...")}>
                            <Eye className="h-3 w-3" />
                        </Button>
                        {order.isUrgent && <Badge variant="destructive" className="text-[10px] h-5">URGENT</Badge>}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Box className="h-3 w-3" />
                        {order.type === 'WOODEN' ? (
                            <span>Wooden • {order.size}</span>
                        ) : (
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {order.machineModel} ({order.size})
                            </span>
                        )}
                    </div>

                    {/* INVENTORY INDICATOR */}
                    {!isCompleted && inventoryItem && (
                        <div className={`flex items-center gap-2 text-xs border rounded px-1.5 py-0.5 ${isOutOfStock ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            <Box className="h-3 w-3" />
                            <span className="font-medium">
                                Requires: {inventoryItem.name.substring(0, 20)}...
                                {isOutOfStock ?
                                    <span className="font-bold ml-1">OUT OF STOCK (0)</span> :
                                    <span className="font-bold ml-1">IN STOCK ({inventoryItem.shopQty})</span>
                                }
                            </span>
                        </div>
                    )}
                </div>

                {!isCompleted && (
                    <div className="flex gap-2 pt-1">
                        {secondaryAction && (
                            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={secondaryAction.onClick}>
                                {secondaryAction.label}
                            </Button>
                        )}
                        {onAction && (
                            <Button
                                size="sm"
                                disabled={isOutOfStock}
                                className={`flex-1 h-8 text-xs ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900'}`}
                                onClick={onAction}
                            >
                                {isOutOfStock ? 'Stock Required' : actionLabel}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800">
        {message}
    </div>
);

export default SealTeamDashboard;
