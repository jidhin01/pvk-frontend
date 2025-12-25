
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InventoryItem } from '@/data/mockInventoryData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardCheck, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StockAuditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inventory: InventoryItem[];
    onCompleteAudit: (adjustments: any[]) => void;
}

export function StockAuditModal({ open, onOpenChange, inventory, onCompleteAudit }: StockAuditModalProps) {
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [step, setStep] = useState<'COUNT' | 'REVIEW'>('COUNT');

    const filteredItems = filterCategory === 'ALL'
        ? inventory
        : inventory.filter(i => i.category === filterCategory);

    // Filter out disabled/dead items? Maybe keep them as they need audit too.

    const handleCountChange = (id: string, val: string) => {
        setCounts(prev => ({ ...prev, [id]: Number(val) }));
    };

    const getVariance = (item: InventoryItem) => {
        const measured = counts[item.id];
        if (measured === undefined) return 0;
        return measured - item.quantity;
    };

    const handleSubmit = () => {
        if (step === 'COUNT') {
            setStep('REVIEW');
            return;
        }

        // Final Submit
        const discrepancies = filteredItems.map(item => {
            const variance = getVariance(item);
            if (variance !== 0) {
                return {
                    itemId: item.id,
                    location: item.location, // Assuming full audit at location
                    type: variance > 0 ? 'INWARD' : 'DAMAGE_LOSS', // or dedicated AUDIT type
                    quantity: Math.abs(variance),
                    reason: 'Audit Correction'
                };
            }
            return null;
        }).filter(Boolean);

        if (discrepancies.length === 0) {
            toast.success("Audit matched perfectly! No adjustments needed.");
        } else {
            onCompleteAudit(discrepancies);
            toast.success(`Audit complete. ${discrepancies.length} adjustments made.`);
        }
        onOpenChange(false);
        setStep('COUNT');
        setCounts({});
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-blue-600" />
                        Stock Reconciliation Audit
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-4 py-2 border-b">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            <SelectItem value="PAPER">Paper</SelectItem>
                            <SelectItem value="INK">Ink</SelectItem>
                            <SelectItem value="HARDWARE">Hardware</SelectItem>
                            <SelectItem value="SPARES">Spares</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex-1 text-right text-sm text-muted-foreground">
                        Auditing {filteredItems.length} items
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader className="bg-muted/50 sticky top-0">
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">System Qty</TableHead>
                                <TableHead className="w-[150px] text-right">Physical Count</TableHead>
                                {step === 'REVIEW' && <TableHead className="text-right">Variance</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map(item => {
                                const variance = getVariance(item);
                                const hasEntry = counts[item.id] !== undefined;

                                if (step === 'REVIEW' && variance === 0) return null; // Show only issues in review

                                return (
                                    <TableRow key={item.id} className={step === 'REVIEW' ? 'bg-red-50/50' : ''}>
                                        <TableCell>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">{item.id}</div>
                                        </TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {item.quantity} <span className="text-xs text-muted-foreground">{item.baseUnit}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {step === 'COUNT' ? (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Input
                                                        type="number"
                                                        className="w-24 text-right h-8"
                                                        placeholder="0"
                                                        value={counts[item.id] ?? ''}
                                                        onChange={(e) => handleCountChange(item.id, e.target.value)}
                                                    />
                                                    <span className="text-xs text-muted-foreground w-8 text-left">{item.baseUnit}</span>
                                                </div>
                                            ) : (
                                                <span className="font-bold">{counts[item.id]} {item.baseUnit}</span>
                                            )}
                                        </TableCell>
                                        {step === 'REVIEW' && (
                                            <TableCell className="text-right font-bold tabular-nums">
                                                <span className={variance < 0 ? 'text-red-600' : 'text-emerald-600'}>
                                                    {variance > 0 ? '+' : ''}{variance} {item.baseUnit}
                                                </span>
                                                {variance < 0 && (
                                                    <div className="text-[10px] text-red-500 flex items-center justify-end gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> Loss: ₹{Math.abs(variance / item.conversionRatio * item.purchasePrice).toFixed(0)}
                                                    </div>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                            {step === 'REVIEW' && filteredItems.every(i => getVariance(i) === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-emerald-600 font-medium h-32">
                                        <ClipboardCheck className="h-8 w-8 mx-auto mb-2" />
                                        Perfect match! No variances found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="border-t pt-4">
                    {step === 'REVIEW' && (
                        <Button variant="outline" onClick={() => setStep('COUNT')}>Back to Count</Button>
                    )}
                    <Button onClick={handleSubmit} className={step === 'REVIEW' ? 'bg-red-600 hover:bg-red-700' : ''}>
                        {step === 'COUNT' ? 'Review Variances' : 'Confirm Adjustments'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
