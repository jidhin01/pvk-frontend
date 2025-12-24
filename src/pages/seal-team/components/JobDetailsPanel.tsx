import React, { useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SealOrder } from '@/data/mockSealData';
import {
    Phone,
    User,
    Download,
    ZoomIn,
    Clock,
    CheckCircle2,
    Layers,
    Printer,
    Hammer,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface JobDetailsPanelProps {
    order: SealOrder | null;
    open: boolean;
    onClose: () => void;
    onAction?: (action: string) => void;
}

export const JobDetailsPanel = ({ order, open, onClose, onAction }: JobDetailsPanelProps) => {
    if (!order) return null;

    // --- MOCK EXTENDED DATA ---
    const dealerInfo = {
        name: "PVK Enterprises",
        type: "Gold Dealer",
        contact: "+91 98765 43210",
        location: "Kakkanad, Kerala"
    };

    const timeline = [
        { time: '10:00 AM', event: 'Order Placed', details: 'via Dealer Portal', icon: User, active: true },
        { time: '10:05 AM', event: 'Design Approved', details: 'Auto-verified', icon: CheckCircle2, active: true },
        { time: '11:30 AM', event: 'Batched', details: 'Batch #B-102', icon: Layers, active: order.status !== 'pending_batch' },
        { time: '02:00 PM', event: 'Negative Printed', details: 'Darkroom Output', icon: Printer, active: ['exposure_done', 'mounting', 'completed'].includes(order.status) },
        { time: '---', event: 'Assembly', details: 'Waiting for parts', icon: Hammer, active: order.status === 'completed' }
    ];

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 gap-0">

                {/* 1. HEADER */}
                <div className="p-6 border-b bg-slate-50 dark:bg-slate-900">
                    <SheetHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                                    {order.id}
                                    {order.isUrgent && <Badge variant="destructive" className="animate-pulse">🔥 RUSH</Badge>}
                                </SheetTitle>
                                <SheetDescription className="text-base mt-1">
                                    {order.content}
                                </SheetDescription>
                            </div>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="uppercase">
                                {order.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </SheetHeader>
                </div>

                {/* SCROLLABLE DETIALS */}
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">

                        {/* 2. CUSTOMER CARD */}
                        <section className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dealer Information</h4>
                            <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
                                        PV
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm flex items-center gap-2">
                                            {dealerInfo.name}
                                            <Badge variant="outline" className="text-[10px] h-4 text-amber-600 border-amber-200 bg-amber-50">GOLD</Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{dealerInfo.location}</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => window.open(`tel:${dealerInfo.contact}`)}>
                                    <Phone className="h-4 w-4" />
                                </Button>
                            </div>
                        </section>

                        <Separator />

                        {/* 3. TECHNICAL SPEC */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Technical Specs</h4>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                    <Download className="h-3 w-3" /> JSON
                                </Button>
                            </div>

                            {/* PROOF MOCKUP */}
                            <div className="relative group rounded-lg overflow-hidden border bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-8 min-h-[160px]">
                                <div className={`
                                    border-4 border-slate-900 text-slate-900 dark:border-slate-200 dark:text-slate-200 
                                    font-serif text-center font-bold p-4
                                    ${order.type === 'POCKET' ? 'rounded-lg' : 'rounded-full'}
                                `}>
                                    {order.content}
                                </div>
                                <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                    <ZoomIn className="h-3 w-3" /> Zoom
                                </Button>
                            </div>

                            {/* SPECS GRID */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 rounded border bg-slate-50 dark:bg-slate-900/50">
                                    <div className="text-xs text-muted-foreground mb-1">Machine Model</div>
                                    <div className="font-medium flex items-center gap-1">
                                        {order.machineModel || "Wooden Handle"}
                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                    </div>
                                </div>
                                <div className="p-3 rounded border bg-slate-50 dark:bg-slate-900/50">
                                    <div className="text-xs text-muted-foreground mb-1">Ink Color</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-blue-600 block" />
                                        Blue
                                    </div>
                                </div>
                                <div className="p-3 rounded border bg-slate-50 dark:bg-slate-900/50">
                                    <div className="text-xs text-muted-foreground mb-1">Dimensions</div>
                                    <div className="font-medium">{order.size}</div>
                                </div>
                                <div className="p-3 rounded border bg-slate-50 dark:bg-slate-900/50">
                                    <div className="text-xs text-muted-foreground mb-1">Mount Type</div>
                                    <div className="font-medium">{order.type}</div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* 4. AUDIT TRAIL */}
                        <section className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Audit Trail</h4>
                            <div className="space-y-4 pl-2">
                                {timeline.map((step, idx) => (
                                    <div key={idx} className={`relative pl-6 pb-2 border-l-2 ${step.active ? 'border-purple-500' : 'border-slate-200 dark:border-slate-800'}`}>
                                        <div className={`
                                            absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 
                                            ${step.active ? 'bg-purple-500 border-purple-500' : 'bg-background border-slate-300 dark:border-slate-700'}
                                        `} />

                                        <div className={`flex items-center justify-between ${!step.active && 'opacity-50'}`}>
                                            <div>
                                                <div className="text-sm font-medium">{step.event}</div>
                                                <div className="text-xs text-muted-foreground">{step.details}</div>
                                            </div>
                                            <div className="text-xs font-mono text-muted-foreground">{step.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </ScrollArea>

                {/* 5. FOOTER ACTIONS */}
                <SheetFooter className="p-4 border-t bg-slate-50 dark:bg-slate-900">
                    <div className="flex w-full gap-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
                        {order.status === 'pending_batch' && (
                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => onAction?.('add_to_batch')}>
                                <Layers className="mr-2 h-4 w-4" /> Add to Batch
                            </Button>
                        )}
                        {['exposure_done', 'mounting'].includes(order.status) && (
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onAction?.('mark_complete')}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Complete
                            </Button>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
