
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
import { useInventoryLogic } from '@/hooks/useInventoryLogic';
import { toast } from 'sonner';

export default function StockDashboard() {
    const {
        inventory,
        movements,
        handleAddStock,
        handleTransfer,
        handleAdjustment,
        handleBulkImport,
        handleSwap
    } = useInventoryLogic();

    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Force re-render of list if needed

    // Derived Logic
    const lowStockItems = inventory.filter(i => i.shopQty < i.minStockLimit);
    const deadStockItems = inventory.filter(i => {
        const lastMoved = new Date(i.lastMovedDate);
        const today = new Date();
        const days = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
        return days > i.deadStockDuration;
    });

    const stats = [
        { label: 'Total Items', value: inventory.length, sub: 'SKUs Managed', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Low Stock Alerts', value: lowStockItems.length, sub: 'Restock Shop Immediately', icon: ArrowDownToLine, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Dead Stock', value: deadStockItems.length, sub: 'Non-moving Assets', icon: Archive, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    ];

    // Global Handler to route actions from InventoryList
    const handleListAction = (type: string, data: any) => {
        if (type === 'INWARD') {
            handleAddStock(data.itemId, Number(data.quantity), data.location, Number(data.purchasePrice), data.vendor, data.batchNumber);
        } else if (type === 'TRANSFER') {
            const from = data.location === 'shop' ? 'godown' : 'shop'; // If target is shop, from is godown
            const to = data.location;
            handleTransfer(data.itemId, from, to, Number(data.quantity), data.notes);
        } else if (type === 'EXCHANGE') { // Swap
            handleSwap(data.itemId, Number(data.quantity));
        }
        setRefreshKey(k => k + 1); // Trigger UI refresh
    };

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
                                                Shop Low Stock Alerts
                                            </h3>
                                            <InventoryList
                                                key={`low-${refreshKey}`}
                                                data={lowStockItems}
                                                onAction={handleListAction}
                                                variant="widget" // SWITCH TO WIDGET MODE TO FIX SCROLL
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
                                                variant="widget" // SWITCH TO WIDGET MODE TO FIX SCROLL
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
                                            <p className="text-muted-foreground">Manage stock across Shop and Godown.</p>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setShowAdjustmentModal(true)}>
                                                <ClipboardCheck className="mr-2 h-4 w-4" /> Stock Take / Adjust
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
                                        variant="default" // Keep full table for master list
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
                                        variant="default" // Full table for detailed management
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
                                        data={lowStockItems} // Should reference alert items
                                        onAction={handleListAction}
                                        variant="default"
                                    />
                                </div>
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
                                // Map Adjustment Modal Data to Hook Arg
                                handleAdjustment(data.itemId, data.location, data.type === 'INWARD' ? 'ADD' : 'REMOVE', data.quantity, data.reason);
                                toast.success('Adjustment recorded successfully');
                                setRefreshKey(k => k + 1);
                            }}
                        />
                    </>
                );
            }}
        </DashboardLayout>
    );
}
