
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { InventoryList } from './InventoryList';
import { StockHistory } from './StockHistory';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    Archive,
    ArrowDownToLine,
    Box,
    History,
    Upload,
    ClipboardCheck
} from 'lucide-react';
import { BulkUploadModal } from './BulkUploadModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { StockShiftingModal } from './StockShiftingModal';
import { StockAuditModal } from './StockAuditModal';
import { PurchaseIndents } from './PurchaseIndents';
import { useInventoryLogic } from '@/hooks/useInventoryLogic';
import { StockAudit } from '@/data/mockInventoryData';
import { toast } from 'sonner';
import { MaterialIssueModal } from './MaterialIssueModal';
import { MaterialReturnModal } from './MaterialReturnModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FileText, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

export default function StockDashboard() {
    const {
        inventory,
        movements,
        transactions,
        handleAddStock,
        handleTransfer,
        handleStockTransfer,
        handleAdjustment,
        handleBulkImport,
        handleSwap,
        handleAuditLog,
        // New
        handleReceiveGoods,
        handleIssueMaterial,
        handleReturnMaterial,
        purchaseRequests,
        setPurchaseRequests
    } = useInventoryLogic();

    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
    const [showShiftingModal, setShowShiftingModal] = useState(false);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Force re-render of list if needed

    const handleDownloadReport = (type: 'USAGE' | 'AUDIT') => {
        let data: any[] = [];
        let filename = '';

        const sourceData = transactions && transactions.length > 0 ? transactions : movements;

        if (type === 'USAGE') {
            data = sourceData.filter(t => (t as any).type === 'ISSUE' || (t as any).type === 'OUTWARD' || (t as any).type === 'DAMAGE_LOSS').map(t => ({
                Date: new Date(t.date).toLocaleDateString(),
                Item: inventory.find(i => i.id === t.itemId)?.name || t.itemId,
                Quantity: t.quantity,
                Type: t.type,
                Reference: (t as any).refId || (t as any).location,
                Reason: (t as any).reason || (t as any).notes || ''
            }));
            filename = 'Material_Usage_Report.csv';
        } else {
            data = sourceData.filter(t => t.type === 'ADJUSTMENT' || t.type === 'AUDIT_ADJUSTMENT').map(t => ({
                Date: new Date(t.date).toLocaleDateString(),
                Item: inventory.find(i => i.id === t.itemId)?.name || t.itemId,
                Quantity: t.quantity,
                Reason: (t as any).reason || (t as any).notes || ''
            }));
            filename = 'Audit_Log.csv';
        }

        if (data.length === 0) {
            toast.error("No data found for report.");
            return;
        }

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    // Derived Logic
    const lowStockItems = inventory.filter(i => (i.stockLevels.godown + i.stockLevels.shop) < i.minLevel);
    const deadStockItems = inventory.filter(i => {
        // Ensure lastMovedDate is valid, otherwise assumes fresh
        if (!i.lastMovedDate) return false;
        const lastMoved = new Date(i.lastMovedDate);
        const today = new Date();
        const days = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
        return days > i.deadStockDuration;
    });

    const stats = [
        { label: 'Total Items', value: inventory.length, sub: 'SKUs Managed', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Low Stock Alerts', value: lowStockItems.length, sub: 'Restock Immediately', icon: ArrowDownToLine, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Dead Stock', value: deadStockItems.length, sub: 'Non-moving Assets', icon: Archive, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    ];

    // Global Handler to route actions from InventoryList
    const handleListAction = (type: string, data: any) => {
        if (type === 'INWARD') {
            const { success } = handleReceiveGoods(
                data.itemId,
                Number(data.quantity),
                data.supplier || data.vendor,
                data.invoiceNo || '',
                Number(data.unitCost || data.purchasePrice),
                data.targetLoc || 'GODOWN'
            );
            if (success) toast.success("Stock Received Successfully");
        } else if (type === 'TRANSFER') {
            const item = inventory.find(i => i.id === data.itemId);
            const from = item ? item.location : 'Unknown';
            const to = data.location;
            handleTransfer(data.itemId, from, to, Number(data.quantity), data.notes);
            toast.success("Transfer Recorded");
        } else if (type === 'EXCHANGE') { // Swap
            toast.info("Exchange feature is currently disabled.");
        } else if (type === 'OPEN_SHIFT_MODAL') {
            // Just open the modal with the item
            setShiftItem(data.itemId);
            setShowShiftingModal(true);
        }
        setRefreshKey(k => k + 1); // Trigger UI refresh
    };

    const [shiftItem, setShiftItem] = useState<string>('');

    return (
        <DashboardLayout>
            {({ activeTab }) => {
                const renderContent = () => {
                    switch (activeTab) {
                        case 'dashboard':
                            return (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    {/* Stats Grid */}
                                    <div className="grid gap-4 md:grid-cols-3 text-slate-900 dark:text-slate-100">
                                        {stats.map((stat, i) => (
                                            <Card key={i} className="dark:bg-slate-950 dark:border-slate-800">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                                        <p className="text-xs text-muted-foreground">{stat.sub}</p>
                                                    </div>
                                                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                                                        <stat.icon className="h-6 w-6" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Critical Alerts Section */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <h3 className="font-bold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                                <AlertTriangle className="h-5 w-5" />
                                                Low Stock Alerts
                                            </h3>
                                            <InventoryList
                                                key={`low-${refreshKey}`}
                                                data={lowStockItems}
                                                onAction={handleListAction}
                                                variant="widget"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-bold flex items-center gap-2 text-red-700 dark:text-red-400">
                                                <Archive className="h-5 w-5" />
                                                Dead Stock Candidates
                                            </h3>
                                            <InventoryList
                                                key={`dead-${refreshKey}`}
                                                data={deadStockItems}
                                                onAction={handleListAction}
                                                variant="widget"
                                            />
                                        </div>
                                    </div>

                                    {/* Recent Activity Mini-View */}
                                    <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                                        <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                                            <History className="h-5 w-5" />
                                            Recent Movements
                                        </h3>
                                        <StockHistory data={movements.slice(0, 3)} />
                                    </div>
                                </div>
                            );

                        case 'inventory':
                            return (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Master Inventory</h2>
                                            <p className="text-muted-foreground">Manage all your stock items.</p>
                                        </div>
                                        <div className="flex gap-2 w-full xl:w-auto flex-wrap justify-start xl:justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Reports</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleDownloadReport('USAGE')}>
                                                        Usage Report (Issues)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDownloadReport('AUDIT')}>
                                                        Audit Logs
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <Button variant="outline" onClick={() => setShowShiftingModal(true)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                                <ArrowRightLeft className="mr-2 h-4 w-4" /> Shift
                                            </Button>
                                            <Button variant="outline" onClick={() => setShowReturnModal(true)} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                                <TrendingUp className="mr-2 h-4 w-4" /> Return
                                            </Button>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowIssueModal(true)}>
                                                <TrendingDown className="mr-2 h-4 w-4" /> Issue
                                            </Button>

                                            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setShowAdjustmentModal(true)}>
                                                <ClipboardCheck className="mr-2 h-4 w-4" /> Quick Adjust
                                            </Button>
                                            <Button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setShowAuditModal(true)}>
                                                <ClipboardCheck className="mr-2 h-4 w-4" /> Start Audit
                                            </Button>
                                            <Button className="flex-1 md:flex-none" onClick={() => setShowBulkModal(true)}>
                                                <Upload className="mr-2 h-4 w-4" /> Bulk Import
                                            </Button>
                                        </div>
                                    </div>
                                    <InventoryList
                                        key={`master-${refreshKey}`}
                                        data={inventory}
                                        onAction={handleListAction}
                                        variant="default"
                                    />
                                </div>
                            );

                        case 'dead-stock':
                            return (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Dead Stock Management</h2>
                                        <p className="text-muted-foreground">Items that haven't moved past their duration limit.</p>
                                    </div>
                                    <InventoryList
                                        key={`dead-full-${refreshKey}`}
                                        data={deadStockItems}
                                        onAction={handleListAction}
                                        variant="default"
                                    />
                                </div>
                            );

                        case 'alerts':
                            return (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">Active Alerts</h2>
                                        <p className="text-muted-foreground">Items requiring immediate attention.</p>
                                    </div>
                                    <InventoryList
                                        key={`alert-full-${refreshKey}`}
                                        data={lowStockItems}
                                        onAction={handleListAction}
                                        variant="default"
                                    />
                                </div>
                            );

                        case 'purchase':
                            return (
                                <PurchaseIndents
                                    requests={purchaseRequests}
                                    inventory={inventory}
                                    onRequestUpdate={setPurchaseRequests}
                                />
                            );

                        default:
                            return <div>Select a tab</div>;
                    }
                };

                return (
                    <>
                        {renderContent()}
                        <BulkUploadModal
                            open={showBulkModal}
                            onOpenChange={setShowBulkModal}
                            onImport={(items) => {
                                handleBulkImport(items);
                                setShowBulkModal(false);
                            }}
                        />
                        <StockAdjustmentModal
                            open={showAdjustmentModal}
                            onOpenChange={setShowAdjustmentModal}
                            inventory={inventory}
                            onSubmit={(data) => {
                                handleAdjustment(data.itemId, data.location, data.type === 'DAMAGE_LOSS' ? 'REMOVE' : 'ADD', data.quantity, data.reason, data.targetLoc);
                                setRefreshKey(k => k + 1);
                                toast.success("Stock Adjusted");
                            }}
                        />
                        <StockAuditModal
                            open={showAuditModal}
                            onOpenChange={setShowAuditModal}
                            inventory={inventory}
                            onCompleteAudit={(adjustments) => {
                                // 1. Apply Adjustments
                                adjustments.forEach(adj => {
                                    const type = adj.type === 'INWARD' ? 'ADD' : 'REMOVE';
                                    handleAdjustment(adj.itemId, adj.location, type, adj.quantity, adj.reason);
                                });

                                // 2. Log Audit History
                                const auditRecord: StockAudit = {
                                    id: `AUDIT-${Date.now()}`,
                                    date: new Date().toISOString().split('T')[0],
                                    status: 'COMPLETED',
                                    itemsToCheck: inventory.map(i => i.id), // We audited everything in filter
                                    findings: adjustments.map(adj => ({
                                        itemId: adj.itemId,
                                        systemQty: 0, // Not captured in simple callback
                                        physicalQty: 0,
                                        variance: adj.type === 'INWARD' ? adj.quantity : -adj.quantity
                                    }))
                                };
                                handleAuditLog(auditRecord);

                                setRefreshKey(k => k + 1);
                            }}
                        />
                        <MaterialIssueModal
                            open={showIssueModal}
                            onOpenChange={setShowIssueModal}
                            inventory={inventory}
                            onSubmit={(data) => {
                                const { success } = handleIssueMaterial(
                                    data.itemId,
                                    data.quantity,
                                    data.to,
                                    data.type,
                                    data.reason,
                                    data.sourceLoc
                                );
                                if (success) {
                                    toast.success("Material Issued Successfully");
                                    setRefreshKey(k => k + 1);
                                }
                            }}
                        />
                        <MaterialReturnModal
                            open={showReturnModal}
                            onOpenChange={setShowReturnModal}
                            inventory={inventory}
                            onSubmit={(data) => {
                                const { success } = handleReturnMaterial(data.itemId, data.quantity, data.from, data.targetLoc);
                                if (success) {
                                    toast.success("Material Returned Successfully");
                                    setRefreshKey(k => k + 1);
                                }
                            }} />
                        <StockShiftingModal
                            open={showShiftingModal}
                            onOpenChange={(open) => {
                                setShowShiftingModal(open);
                                if (!open) setShiftItem('');
                            }}
                            initialItemId={shiftItem}
                            inventory={inventory}
                            onSubmit={(data) => {
                                const { success } = handleStockTransfer(data.itemId, data.from, data.to, data.quantity);
                                if (success) {
                                    toast.success("Stock Shifted Successfully");
                                    setRefreshKey(k => k + 1);
                                }
                            }}
                        />
                    </>
                );
            }}
        </DashboardLayout>
    );
}
