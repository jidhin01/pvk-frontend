import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SealOrder } from '@/data/mockSealData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Printer, Flame, Box, AlertCircle, ArrowRight, Eye } from 'lucide-react';

// --- VISUAL SCALE CONSTANTS ---
// 1mm = 3px on screen
const SCALE = 2.5;
const SHEET_WIDTH_MM = 210;
const SHEET_HEIGHT_MM = 297;
const SHEET_WIDTH_PX = SHEET_WIDTH_MM * SCALE;
const SHEET_HEIGHT_PX = SHEET_HEIGHT_MM * SCALE;

// --- TYPES ---
interface PlacedItem {
    id: string;
    orderId: string;
    order: SealOrder;
    x: number;
    y: number;
    width: number;
    height: number;
}

// Helper: Size String Parsing
const parseDimensions = (sizeStr: string) => {
    const s = sizeStr.toLowerCase().replace('mm', '').trim();
    const parts = s.split('x');
    if (parts.length === 2) {
        return { w: parseFloat(parts[0]), h: parseFloat(parts[1]) };
    }
    if (s.includes('inch')) return { w: 50, h: 50 }; // approx 2 inch
    // round seal handling
    if (s.includes('round')) return { w: 40, h: 40 };
    return { w: 40, h: 20 }; // default
};

interface BatchingStationProps {
    orders: SealOrder[];
    onCreateBatch: (orders: SealOrder[]) => void;
    onViewDetails: (order: SealOrder) => void;
}

const DraggableOrderCard = ({ order, onAddToBatch, onViewDetails }: { order: SealOrder, onAddToBatch: () => void, onViewDetails: () => void }) => {
    const isOld = new Date(order.orderDate) < new Date(Date.now() - 2 * 86400000);

    return (
        <Card className="mb-3 cursor-grab hover:shadow-md hover:border-purple-300 transition-all border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm group relative">
            <CardContent className="p-3 flex items-center justify-between relative z-10">
                <div className="flex-1 min-w-0" onClick={onViewDetails}>
                    <div className="flex items-center gap-2 mb-1">
                        {order.isUrgent && <Flame className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />}
                        <span className={`font-bold text-sm ${order.isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {order.size}
                        </span>
                        {isOld && <Badge variant="outline" className="text-[10px] h-4 px-1 text-orange-600 border-orange-200">Late</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground w-full truncate pr-2 hover:underline cursor-pointer" title="View Details">
                        {order.content}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{order.type}</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-purple-600" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); onAddToBatch(); }}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const BatchingStation = ({ orders, onCreateBatch, onViewDetails }: BatchingStationProps) => {
    // Local state for the scratchpad (placed items)
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const sheetRef = useRef<HTMLDivElement>(null);

    // Filter out placed orders from the props list to show in queue
    const placedOrderIds = useMemo(() => new Set(placedItems.map(i => i.orderId)), [placedItems]);
    const queue = useMemo(() => orders.filter(o => !placedOrderIds.has(o.id)), [orders, placedOrderIds]);

    const addToBatch = (order: SealOrder) => {
        const dims = parseDimensions(order.size);
        const newItem: PlacedItem = {
            id: `${order.id}-${Date.now()}`,
            orderId: order.id,
            order: order,
            x: 10 + (placedItems.length * 5) % 100, // simple stagger
            y: 10 + (placedItems.length * 5) % 200,
            width: dims.w,
            height: dims.h
        };
        setPlacedItems(prev => [...prev, newItem]);
    };

    const returnToQueue = (itemId: string) => {
        setPlacedItems(prev => prev.filter(i => i.id !== itemId));
    };

    // Metrics
    const usedArea = placedItems.reduce((acc, item) => acc + (item.width * item.height), 0);
    const totalArea = SHEET_WIDTH_MM * SHEET_HEIGHT_MM;
    const efficiency = Math.round((usedArea / totalArea) * 100);

    const handleCreate = () => {
        // map placed Items back to orders
        const ordersToProcess = placedItems.map(p => p.order);
        onCreateBatch(ordersToProcess);
        setPlacedItems([]); // Clear local scratchpad
    };

    return (
        <div className="h-[calc(100vh-14rem)] flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-5">

            {/* LEFT: THE QUEUE */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider">Pending Orders ({queue.length})</h3>
                </div>

                <ScrollArea className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-2">
                    {queue.length === 0 && placedItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Box className="h-8 w-8 mb-2 opacity-50" />
                            <span className="text-xs">All clear!</span>
                        </div>
                    ) : queue.map(order => (
                        <DraggableOrderCard
                            key={order.id}
                            order={order}
                            onAddToBatch={() => addToBatch(order)}
                            onViewDetails={() => onViewDetails(order)}
                        />
                    ))}
                </ScrollArea>
            </div>

            {/* RIGHT: THE DARKROOM (FILM SHEET) */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="flex items-center justify-between bg-zinc-900 text-zinc-100 p-4 rounded-xl shadow-lg border border-zinc-800">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Film Usage</span>
                            <span className={`text-xl font-bold ${efficiency > 80 ? 'text-green-400' : 'text-zinc-300'}`}>
                                {efficiency}%
                            </span>
                        </div>
                        <div className="h-8 w-px bg-zinc-700" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Items</span>
                            <span className="text-xl font-bold text-zinc-300">{placedItems.length}</span>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        onClick={handleCreate}
                        disabled={placedItems.length === 0}
                        className="bg-white text-black hover:bg-zinc-200"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Negative
                    </Button>
                </div>

                <div className="flex-1 bg-zinc-950/80 rounded-xl border border-zinc-800 relative overflow-hidden flex justify-center items-center p-8 shadow-inner ring-1 ring-inset ring-black/50">
                    {/* GLOW EFFECT BEHIND SHEET */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />

                    {/* THE A4 SHEET */}
                    <div
                        ref={sheetRef}
                        className="bg-white relative transition-all shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)]"
                        style={{
                            width: SHEET_WIDTH_PX,
                            height: SHEET_HEIGHT_PX,
                            backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                            backgroundSize: `${10 * SCALE}px ${10 * SCALE}px`
                        }}
                    >
                        <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 select-none">A4 NEGATIVE FILM</div>

                        {placedItems.map(item => (
                            <motion.div
                                key={item.id}
                                drag
                                dragMomentum={false}
                                dragConstraints={sheetRef}
                                className="absolute cursor-move active:cursor-grabbing group z-10 hover:z-50"
                                style={{
                                    width: item.width * SCALE,
                                    height: item.height * SCALE,
                                    left: item.x * SCALE,
                                    top: item.y * SCALE,
                                    position: 'absolute'
                                }}
                            >
                                <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center text-[8px] shadow-sm select-none border border-white/20">
                                    <span className="font-bold opacity-90 scale-x-[-1] whitespace-nowrap overflow-hidden max-w-full px-1">{item.order.content}</span>
                                </div>

                                <button
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    onClick={() => returnToQueue(item.id)}
                                >
                                    <AlertCircle className="h-3 w-3" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
