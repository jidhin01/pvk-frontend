
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
    ArrowRightLeft,
    ArrowUpCircle,
    AlertTriangle,
    Store,
    CalendarClock,
    TrendingDown,
    IndianRupee,
    RefreshCw,
    Box
} from 'lucide-react';
import { InventoryItem } from '@/data/mockInventoryData';
import { cn } from '@/lib/utils';
import { StockEntryModal } from '@/pages/inventory/StockEntryModal';
import { toast } from 'sonner';

interface InventoryListProps {
    data: InventoryItem[];
    filterType?: 'all' | 'low_stock' | 'dead_stock';
    onAction?: (type: string, data: any) => void;
    variant?: 'default' | 'widget';
}

export function InventoryList({ data, filterType = 'all', onAction, variant = 'default' }: InventoryListProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [modalMode, setModalMode] = useState<'INWARD' | 'TRANSFER' | 'EXCHANGE'>('TRANSFER');

    // Helper to calculate stock health
    const getStockStatus = (item: InventoryItem) => {
        const isLowShop = item.shopQty < item.minStockLimit;

        // Dead Stock Calculation
        const lastMoved = new Date(item.lastMovedDate);
        const today = new Date();
        const daysSinceMove = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
        const isDead = daysSinceMove > item.deadStockDuration;

        if (isDead) return { label: 'Dead Stock', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: CalendarClock, days: daysSinceMove };
        if (isLowShop) return { label: 'Low in Shop', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400', icon: TrendingDown };

        return { label: 'Healthy', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: Store };
    };

    const handleActionClick = (item: InventoryItem, action: string) => {
        setSelectedItem(item);
        if (action === 'inward') setModalMode('INWARD');
        if (action === 'transfer') setModalMode('TRANSFER');
        if (action === 'exchange') setModalMode('EXCHANGE');
    };

    // --- WIDGET VIEW (No Tables, No Scrollbars) ---
    if (variant === 'widget') {
        return (
            <>
                <div className="flex flex-col gap-3">
                    {data.map((item) => {
                        const status = getStockStatus(item);
                        const isDead = status.label === 'Dead Stock';
                        const total = item.shopQty + item.godownQty;
                        const shopPercent = total > 0 ? (item.shopQty / total) * 100 : 0;

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

                                    {isDead ? (
                                        <Button size="sm" variant="outline" className="h-8 text-xs border-orange-200 text-orange-700 dark:border-orange-900 dark:text-orange-400" onClick={() => handleActionClick(item, 'exchange')}>
                                            Swap
                                        </Button>
                                    ) : (
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => handleActionClick(item, 'inward')}>
                                                <ArrowUpCircle className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => handleActionClick(item, 'transfer')}>
                                                <ArrowRightLeft className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Mini Stock Meter */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                                        <span>Shop: <span className={item.shopQty < item.minStockLimit ? "text-red-500 font-bold" : "text-slate-700 dark:text-slate-300"}>{item.shopQty}</span></span>
                                        <span>Godown: <span className="text-slate-700 dark:text-slate-300">{item.godownQty}</span></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                        <div
                                            className={cn("h-full transition-all", item.shopQty < item.minStockLimit ? "bg-red-500" : "bg-blue-500")}
                                            style={{ width: `${shopPercent}%` }}
                                        />
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
                {/* Modals are shared */}
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
                            <TableHead className="min-w-[120px] text-right">Stock Levels</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Last Moved</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => {
                            const status = getStockStatus(item);
                            const total = item.shopQty + item.godownQty;
                            const shopPercent = total > 0 ? (item.shopQty / total) * 100 : 0;
                            const isDead = status.label === 'Dead Stock';

                            return (
                                <TableRow key={item.id} className={cn("group", isDead ? "bg-red-50/50 dark:bg-red-900/10" : "")}>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.id} • {item.category}</span>
                                            {/* Mobile Only Alerts */}
                                            <div className="md:hidden flex gap-2 mt-1">
                                                {item.shopQty < item.minStockLimit && (
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
                                        {/* Mobile View: Stacked */}
                                        <div className="flex flex-col gap-1 md:hidden items-end">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Shop</span>
                                                <span className={cn("text-lg font-bold tabular-nums", item.shopQty < item.minStockLimit ? "text-red-600" : "text-blue-600")}>
                                                    {item.shopQty}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Godown</span>
                                                <span className="text-sm font-medium text-slate-500 tabular-nums">
                                                    {item.godownQty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Desktop View: Progress Bar */}
                                        <div className="hidden md:block space-y-2 min-w-[200px]">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400"><Store className="h-3 w-3" /> Shop: <span className="tabular-nums text-sm font-bold">{item.shopQty}</span></span>
                                                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Godown: <span className="tabular-nums font-bold">{item.godownQty}</span></span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                                <div
                                                    className={cn("h-full transition-all", item.shopQty < item.minStockLimit ? "bg-red-500" : "bg-blue-500")}
                                                    style={{ width: `${shopPercent}%` }}
                                                />
                                            </div>
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
                                        <div className="flex justify-end gap-3">
                                            {isDead ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 md:h-8 w-full md:w-auto text-orange-700 border-orange-200 hover:bg-orange-50 dark:border-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                                                    disabled={item.godownQty === 0}
                                                    onClick={() => handleActionClick(item, 'exchange')}
                                                >
                                                    <RefreshCw className="mr-2 h-4 w-4" /> Swap Stock
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleActionClick(item, 'inward')}>
                                                        <ArrowUpCircle className="h-5 w-5 md:h-4 md:w-4 text-emerald-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleActionClick(item, 'transfer')}>
                                                        <ArrowRightLeft className="h-5 w-5 md:h-4 md:w-4 text-blue-600" />
                                                    </Button>
                                                </>
                                            )}
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
                        // Pass the raw form data combined with itemId up to the parent
                        onAction?.(modalMode, { itemId: selectedItem.id, ...formData });
                        setSelectedItem(null);
                    }}
                />
            )}
        </>
    );
}
