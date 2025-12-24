import React, { useState, useRef, useMemo } from 'react';
import { motion, useDragControls } from 'framer-motion'; // Using Framer Motion directly
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MOCK_SEAL_ORDERS, SealOrder } from '@/data/mockSealData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Printer, Flame, Box, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { toast } from 'sonner';

// --- VISUAL SCALE CONSTANTS ---
// 1mm = 3px on screen for good visibility (Screen is ~96 DPI, 1mm ~ 3.7px physically, but logical px is different)
// A4 = 210mm x 297mm
const SCALE = 3;
const SHEET_WIDTH_MM = 210;
const SHEET_HEIGHT_MM = 297;
const SHEET_WIDTH_PX = SHEET_WIDTH_MM * SCALE;
const SHEET_HEIGHT_PX = SHEET_HEIGHT_MM * SCALE;

// --- TYPES ---
interface PlacedItem {
    id: string; // Creates a unique ID for the placement instance
    orderId: string;
    order: SealOrder;
    x: number; // mm
    y: number; // mm
    width: number; // mm (derived from size string)
    height: number; // mm
}

// Helper to parse size string "38x14 mm" -> {w, h}
const parseDimensions = (sizeStr: string) => {
    // Normalize string
    const s = sizeStr.toLowerCase().replace('mm', '').trim();
    const parts = s.split('x');
    if (parts.length === 2) {
        return { w: parseFloat(parts[0]), h: parseFloat(parts[1]) };
    }
    // Fallback for "2 inch" etc (Assuming logic, but creating mock default)
    if (s.includes('inch')) return { w: 50, h: 50 }; // approx 2 inch
    return { w: 40, h: 20 }; // default
};

const DraggableOrderCard = ({ order, onAddToBatch }: { order: SealOrder, onAddToBatch: () => void }) => {
    const isOld = new Date(order.orderDate) < new Date(Date.now() - 2 * 86400000);

    return (
        <Card className="mb-3 cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing border-slate-200 dark:border-slate-800">
            <CardContent className="p-3 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{order.id}</span>
                        {order.isUrgent && <Flame className="h-3 w-3 text-red-500 fill-red-500" />}
                        {isOld && <Badge variant="outline" className="text-[10px] h-4 px-1 text-orange-600 border-orange-200">Late</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1 w-32" title={order.content}>{order.content}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded inline-block">
                        {order.size} ({order.type})
                    </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onAddToBatch}>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

const BatchLayout = () => {
    // 1. STATE
    // Filter pending orders
    const pendingOrders = useMemo(() => MOCK_SEAL_ORDERS.filter(o => o.status === 'pending_batch'), []);

    const [queue, setQueue] = useState<SealOrder[]>(pendingOrders);
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const sheetRef = useRef<HTMLDivElement>(null);

    // 2. LOGIC
    const addToBatch = (order: SealOrder) => {
        // Simple "Next Available Slot" logic or Center placement
        const dims = parseDimensions(order.size);
        const newItem: PlacedItem = {
            id: `${order.id}-${Date.now()}`,
            orderId: order.id,
            order: order,
            x: 10, // Default padding 10mm
            y: 10,
            width: dims.w,
            height: dims.h
        };

        // Move from Queue to Placed
        setQueue(prev => prev.filter(q => q.id !== order.id));
        setPlacedItems(prev => [...prev, newItem]);
    };

    const returnToQueue = (itemId: string) => {
        const item = placedItems.find(i => i.id === itemId);
        if (!item) return;

        setPlacedItems(prev => prev.filter(i => i.id !== itemId));
        setQueue(prev => [...prev, item.order]);
    };

    const updatePosition = (itemId: string, x: number, y: number) => {
        setPlacedItems(prev => prev.map(i =>
            i.id === itemId ? { ...i, x, y } : i
        ));
    };

    // Calculate Efficiency
    const usedArea = placedItems.reduce((acc, item) => acc + (item.width * item.height), 0);
    const totalArea = SHEET_WIDTH_MM * SHEET_HEIGHT_MM;
    const efficiency = Math.round((usedArea / totalArea) * 100);
    const polymerNeeded = Math.round(usedArea * 0.2); // Assume 0.2ml per mm2? No, huge. 0.2ml per cm2? 
    // mm2 -> cm2 = /100. Assume 2mm depth. 1cm2 * 0.2cm = 0.2cm3 (ml). 
    // So Area(mm2) / 100 * 0.2 = ml.
    const polymerMl = Math.round((usedArea / 100) * 0.2);

    // Batch Action
    const handleCreateBatch = () => {
        toast.success(`Batch Created with ${placedItems.length} orders!`, {
            description: "PDF Generation initiated...",
        });
        // In real app, POST to backend
    };

    return (
        <DashboardLayout>
            {() => (
                <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 animate-in fade-in">

                    {/* LEFT PANEL: QUEUE */}
                    <div className="w-full md:w-80 flex flex-col gap-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                            <h2 className="font-bold flex items-center gap-2">
                                <Layers className="h-4 w-4 text-slate-500" />
                                Production Queue
                                <Badge variant="secondary" className="ml-auto">{queue.length}</Badge>
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Pending orders ready for batching.</p>
                        </div>
                        <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-950/50">
                            {queue.map(order => (
                                <DraggableOrderCard
                                    key={order.id}
                                    order={order}
                                    onAddToBatch={() => addToBatch(order)}
                                />
                            ))}
                            {queue.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground text-sm">
                                    <Box className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    No pending orders
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* RIGHT PANEL: BATCH WORKSTATION */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0">

                        {/* TOOLBAR */}
                        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sheet Usage</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{efficiency}%</div>
                                </div>
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                                <div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Polymer Est.</div>
                                    <div className="text-lg font-mono font-semibold text-purple-600 dark:text-purple-400">{polymerMl} ml</div>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-100 dark:shadow-none"
                                disabled={placedItems.length === 0}
                                onClick={handleCreateBatch}
                            >
                                <Printer className="mr-2 h-4 w-4" /> Create Batch & Print Negative
                            </Button>
                        </div>

                        {/* WORKSPACE & SHEET */}
                        <div className="flex-1 bg-slate-100 dark:bg-slate-950/50 rounded-lg border dark:border-slate-800 relative overflow-auto flex justify-center items-start p-8 shadow-inner">

                            {/* THE A4 SHEET */}
                            <div
                                ref={sheetRef}
                                className="bg-white shadow-2xl relative transition-colors"
                                style={{
                                    width: SHEET_WIDTH_PX,
                                    height: SHEET_HEIGHT_PX,
                                    backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                                    backgroundSize: `${10 * SCALE}px ${10 * SCALE}px` // 1cm scale grid
                                }}
                            >
                                {/* Sheet Labels */}
                                <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400">A4 Negative Film (210x297mm) - Invert: ON</div>

                                {/* Placed Items */}
                                {placedItems.map(item => (
                                    <motion.div
                                        key={item.id}
                                        drag
                                        dragMomentum={false}
                                        dragConstraints={sheetRef}
                                        onDragEnd={(_, info) => {
                                            // Ideally snap to grid logic here
                                            // For now just visual drag
                                        }}
                                        className="absolute cursor-grab active:cursor-grabbing group hover:z-50"
                                        style={{
                                            width: item.width * SCALE,
                                            height: item.height * SCALE,
                                            left: item.x * SCALE, // Initial Left (Framer uses transform, so we set initial)
                                            top: item.y * SCALE,
                                            position: 'absolute'
                                        }}
                                    >
                                        <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center text-[10px] shadow-sm ring-1 ring-slate-900/10 pointer-events-none select-none">
                                            {/* Simulate Negative (Inverted) */}
                                            <span className="font-bold opacity-80 scale-x-[-1]">{item.order.content.substring(0, 8)}...</span>
                                            <span className="text-[8px] opacity-50 font-mono mt-0.5">{item.width}x{item.height}</span>
                                        </div>

                                        {/* Remove Button (Visible on Hover) */}
                                        <button
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
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
            )}
        </DashboardLayout>
    );
};

export default BatchLayout;
