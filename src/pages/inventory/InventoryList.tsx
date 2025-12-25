
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowUpCircle,
    Store,
    CalendarClock,
    TrendingDown,
    IndianRupee,
    Box,
    Building2,
    ShoppingBag,
    ArrowRightLeft
} from 'lucide-react';
import { InventoryItem } from '@/data/mockInventoryData';
import { cn } from '@/lib/utils';
import { StockEntryModal } from '@/pages/inventory/StockEntryModal';

interface InventoryListProps {
    data: InventoryItem[];
    filterType?: 'all' | 'low_stock' | 'dead_stock';
    onAction?: (type: string, data: any) => void;
    variant?: 'default' | 'widget';
}

export function InventoryList({ data, filterType = 'all', onAction, variant = 'default' }: InventoryListProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [modalMode, setModalMode] = useState<'INWARD' | 'TRANSFER' | 'EXCHANGE'>('INWARD');

    // Helper to calculate stock health
    const getStockStatus = (item: InventoryItem) => {
        const totalQty = item.stockLevels ? (item.stockLevels.godown + item.stockLevels.shop) : 0;
        const isLow = totalQty < item.minLevel;

        // Dead Stock Calculation
        const lastMoved = new Date(item.lastMovedDate);
        const today = new Date();
        const daysSinceMove = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
        const isDead = daysSinceMove > item.deadStockDuration;

        if (isDead) return { label: 'Dead Stock', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: CalendarClock, days: daysSinceMove };
        if (isLow) return { label: 'Low Stock', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400', icon: TrendingDown };

        return { label: 'Healthy', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: Store };
    };

    const handleActionClick = (item: InventoryItem, action: string) => {
        setSelectedItem(item);
        if (action === 'inward') setModalMode('INWARD');
    };

    // --- WIDGET VIEW ---
    if (variant === 'widget') {
        return (
            <>
                <div className="flex flex-col gap-3">
                    {data.map((item) => {
                        const status = getStockStatus(item);
                        const isDead = status.label === 'Dead Stock';
                        const totalQty = item.stockLevels ? (item.stockLevels.godown + item.stockLevels.shop) : 0;

                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex flex-col gap-3 p-4 rounded-lg border dark:border-slate-800 bg-card transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50",
                                    isDead ? "border-l-4 border-l-red-500" : "border-l-4 border-l-orange-500"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-muted-foreground font-mono">{item.id}</span>
                                            <Badge variant="secondary" className={cn("h-4 text-[10px] px-1", status.color)}>
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => handleActionClick(item, 'inward')}>
                                        <ArrowUpCircle className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Stock Info */}
                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                Total: {totalQty} {item.baseUnit}
                                            </span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-600" onClick={() => onAction?.('OPEN_SHIFT_MODAL', { itemId: item.id })}>
                                                <ArrowRightLeft className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex gap-2 text-[10px]">
                                            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 px-1.5 h-6">
                                                <Building2 className="h-3 w-3" /> G: {item.stockLevels?.godown || 0}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200 px-1.5 h-6">
                                                <ShoppingBag className="h-3 w-3" /> S: {item.stockLevels?.shop || 0}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {data.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border dashed border-2 rounded-lg">
                            <Box className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No items found.
                        </div>
                    )}
                </div>
                {selectedItem && (
                    <StockEntryModal
                        open={!!selectedItem}
                        onOpenChange={(open) => !open && setSelectedItem(null)}
                        item={selectedItem}
                        mode={modalMode}
                        onSubmit={(formData) => {
                            onAction?.(modalMode, { itemId: selectedItem.id, ...formData });
                            setSelectedItem(null);
                        }}
                    />
                )}
            </>
        );
    }

    // --- DEFAULT TABLE VIEW ---
    return (
        <>
            <div className="rounded-md border bg-card dark:border-slate-800 overflow-x-auto scrollbar-thin">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[200px] text-slate-800 dark:text-slate-200">Item Details</TableHead>
                            <TableHead className="hidden md:table-cell">Cost</TableHead>
                            <TableHead className="min-w-[150px] text-right">Stock Breakdown</TableHead>
                            <TableHead className="hidden md:table-cell">Location Notes</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Last Moved</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => {
                            const status = getStockStatus(item);
                            const isDead = status.label === 'Dead Stock';
                            const totalQty = item.stockLevels ? (item.stockLevels.godown + item.stockLevels.shop) : 0;

                            return (
                                <TableRow key={item.id} className={cn("group", isDead ? "bg-red-50/50 dark:bg-red-900/10" : "")}>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.id} • {item.category}</span>
                                            {/* Mobile Only Alerts */}
                                            <div className="md:hidden flex gap-2 mt-1">
                                                {totalQty < item.minLevel && (
                                                    <Badge variant="outline" className="text-[10px] h-5 border-red-200 text-red-600 bg-red-50">Low Stock</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center text-sm font-medium text-muted-foreground tabular-nums">
                                            <IndianRupee className="h-3 w-3 mr-0.5" />
                                            {item.purchasePrice}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={cn("text-sm font-bold tabular-nums", totalQty < item.minLevel ? "text-red-600" : "")}>
                                                Total: {totalQty} {item.baseUnit}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 h-5 text-[10px] px-1.5" title="Main Godown">
                                                    G: {item.stockLevels?.godown || 0}
                                                </Badge>
                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 h-5 text-[10px] px-1.5" title="Retail Shop">
                                                    S: {item.stockLevels?.shop || 0}
                                                </Badge>
                                            </div>
                                            {item.conversionRatio > 1 && (
                                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                                    ≈ {(totalQty / item.conversionRatio).toFixed(1)} {item.purchaseUnit}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <Badge variant="outline" className="font-mono text-xs w-fit max-w-[100px] truncate" title={item.location}>
                                                {item.location}
                                            </Badge>
                                            {item.binLocation && (
                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                    {item.binLocation}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="secondary" className={cn("font-medium", status.color)}>
                                            <status.icon className="mr-1 h-3 w-3" />
                                            {status.label}
                                            {status.days && ` (${status.days}d)`}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-sm text-muted-foreground">{item.lastMovedDate}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600" onClick={() => onAction?.('OPEN_SHIFT_MODAL', { itemId: item.id })} title="Transfer Stock">
                                                <ArrowRightLeft className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600" onClick={() => handleActionClick(item, 'inward')} title="Inward Stock">
                                                <ArrowUpCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {selectedItem && (
                <StockEntryModal
                    open={!!selectedItem}
                    onOpenChange={(open) => !open && setSelectedItem(null)}
                    item={selectedItem}
                    mode={modalMode}
                    onSubmit={(formData) => {
                        onAction?.(modalMode, { itemId: selectedItem.id, ...formData });
                        setSelectedItem(null);
                    }}
                />
            )}
        </>
    );
}
