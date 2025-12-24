import React, { useState } from 'react';
import { SealOrder } from '@/data/mockSealData';
import { InventoryItem } from '@/data/mockInventoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, AlertTriangle, CheckCircle2, EyeOff, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface AssemblyStationProps {
    orders: SealOrder[];
    onComplete: (id: string) => void;
    checkStock: (order: SealOrder) => { hasStock: boolean; item: InventoryItem | null; qty: number };
    onViewDetails: (order: SealOrder) => void;
}

export const AssemblyStation = ({ orders, onComplete, checkStock, onViewDetails }: AssemblyStationProps) => {
    // ... existing ...
    const [showBlocked, setShowBlocked] = useState(false);

    // Filter and Process Orders with Stock Info
    const processedOrders = orders.map(order => {
        const stockInfo = checkStock(order);
        return { ...order, stockInfo };
    });

    const visibleOrders = processedOrders.filter(o =>
        showBlocked ? true : o.stockInfo.hasStock
    );

    const hiddenCount = processedOrders.length - visibleOrders.length;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 pb-20">

            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Assembly Queue</h2>
                    <Badge variant="outline" className="ml-2">{visibleOrders.length} Ready</Badge>
                </div>

                {hiddenCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBlocked(!showBlocked)}
                        className="text-muted-foreground"
                    >
                        {showBlocked ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showBlocked ? 'Hide Blocked Jobs' : `Show ${hiddenCount} Blocked Jobs`}
                    </Button>
                )}
            </div>

            {/* Empty State */}
            {visibleOrders.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800">
                    <Hammer className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Workbench Clear</h3>
                    <p className="text-slate-500">No jobs ready for assembly (or stock is missing).</p>
                </div>
            )}

            {/* Job List */}
            <div className="space-y-4">
                {visibleOrders.map(order => (
                    <JobTicket
                        key={order.id}
                        order={order}
                        stockInfo={order.stockInfo}
                        onComplete={() => onComplete(order.id)}
                        onViewDetails={() => onViewDetails(order)}
                    />
                ))}
            </div>
        </div>
    );
};

const JobTicket = ({
    order,
    stockInfo,
    onComplete,
    onViewDetails
}: {
    order: SealOrder,
    stockInfo: { hasStock: boolean; item: InventoryItem | null; qty: number },
    onComplete: () => void,
    onViewDetails: () => void
}) => {

    const isLowStock = stockInfo.hasStock && stockInfo.qty < 5;
    const isOut = !stockInfo.hasStock;

    return (
        <Card className={`
            overflow-hidden transition-all duration-300
            ${isOut ? 'opacity-60 grayscale bg-slate-100 dark:bg-slate-950 border-slate-200' : 'bg-white dark:bg-slate-900 border-l-4 border-l-orange-500 shadow-md hover:shadow-lg'}
        `}>
            <CardContent className="p-0 flex flex-col md:flex-row">

                {/* 1. VISUAL IDENTIFIER (Thumbnail) */}
                <div className="w-full md:w-32 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 border-r dark:border-slate-800">
                    {/* Simulated Seal Visual */}
                    <div className={`
                        flex items-center justify-center border-2 border-slate-900 dark:border-slate-400 rounded-full
                        ${order.type === 'WOODEN' ? 'h-16 w-16' : 'h-16 w-24 rounded-lg'}
                    `}>
                        <span className="text-[10px] uppercase font-bold text-slate-500 text-center leading-tight px-1">
                            {order.content.substring(0, 10)}
                        </span>
                    </div>
                </div>

                {/* 2. INSTRUCTIONS */}
                <div className="flex-1 p-5 flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{order.id}</span>
                        {order.isUrgent && <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        {order.machineModel || "Wooden Handle"}
                        <span className="text-sm font-normal text-slate-500">
                            {stockInfo.item ? `(Stock: ${stockInfo.qty})` : ''}
                        </span>
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            Ink: <span className="font-semibold text-slate-900 dark:text-slate-200">Blue</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            Size: <span className="font-semibold text-slate-900 dark:text-slate-200">{order.size}</span>
                        </div>
                    </div>

                    {isLowStock && (
                        <div className="flex items-center gap-2 mt-2 text-amber-600 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit">
                            <AlertTriangle className="h-3 w-3" />
                            Warning: Low Stock ({stockInfo.qty} left)
                        </div>
                    )}
                    {isOut && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded w-fit">
                            <AlertTriangle className="h-3 w-3" />
                            Out of Stock - Cannot Assemble
                        </div>
                    )}
                </div>

                {/* 3. ACTIONS */}
                <div className="w-full md:w-48 p-4 flex flex-col gap-2 justify-center bg-slate-50 dark:bg-slate-950/30 border-l dark:border-slate-800">
                    <Button
                        size="lg"
                        disabled={isOut}
                        className={`
                            h-12 w-full font-bold shadow-sm transition-all
                            ${isOut ? '' : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]'}
                        `}
                        onClick={onComplete}
                    >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        {isOut ? 'No Stock' : 'Mark Assembled'}
                    </Button>

                    <Button variant="outline" size="sm" className="w-full text-xs text-muted-foreground" onClick={onViewDetails}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Full Details
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-xs text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => toast("Report flagged to manager")}>
                        <AlertTriangle className="mr-2 h-3 w-3" />
                        Report Issue
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};
