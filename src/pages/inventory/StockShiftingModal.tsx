
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem } from '@/data/mockInventoryData';
import { ArrowRightLeft } from 'lucide-react';

interface StockShiftingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inventory: InventoryItem[];
    // Initial Item might be passed if invoked from Row Action
    initialItemId?: string;
    onSubmit: (data: any) => void;
}

export function StockShiftingModal({ open, onOpenChange, inventory, initialItemId, onSubmit }: StockShiftingModalProps) {
    const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId || '');
    const [quantity, setQuantity] = useState('');
    const [fromLoc, setFromLoc] = useState<'GODOWN' | 'SHOP'>('GODOWN');
    // toLoc is derived as opposite for shifting
    const toLoc = fromLoc === 'GODOWN' ? 'SHOP' : 'GODOWN';
    const [notes, setNotes] = useState('');

    React.useEffect(() => {
        if (open && initialItemId) {
            setSelectedItemId(initialItemId);
        } else if (open && !initialItemId) {
            // Keep existing or reset if needed, but usually we just want to ensure we don't hold stale state if opened without init ID
            if (!selectedItemId) setSelectedItemId('');
        }
    }, [open, initialItemId]);

    const selectedItem = inventory.find(i => i.id === selectedItemId);

    // Safety check for stock
    const currentStockInFrom = selectedItem ? selectedItem.stockLevels?.[fromLoc.toLowerCase() as 'godown' | 'shop'] || 0 : 0;

    const handleSubmit = () => {
        if (!selectedItemId || !quantity) return;

        // Stock Validation
        if (Number(quantity) > currentStockInFrom) {
            // Usually parent handles constraint or toast, but we can't submit invalid
            return;
        }

        onSubmit({
            itemId: selectedItemId,
            quantity: Number(quantity),
            from: fromLoc,
            to: toLoc,
            notes
        });
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        if (!initialItemId) setSelectedItemId('');
        setQuantity('');
        setFromLoc('GODOWN');
        setNotes('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <ArrowRightLeft className="h-5 w-5" />
                        Internal Stock Shifting
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Item</Label>
                        <Select
                            value={selectedItemId}
                            onValueChange={setSelectedItemId}
                            disabled={!!initialItemId} // Lock if passed
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Search Item..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                {inventory.map(item => {
                                    const godown = item.stockLevels ? item.stockLevels.godown : 0;
                                    const shop = item.stockLevels ? item.stockLevels.shop : 0;
                                    return (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name} (G: {godown}, S: {shop})
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedItem && (
                        <>
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Source (From)</Label>
                                    <Select value={fromLoc} onValueChange={(v: any) => setFromLoc(v)}>
                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-950 dark:border-slate-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GODOWN">Main Godown</SelectItem>
                                            <SelectItem value="SHOP">Retail Shop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 pb-2 text-center">
                                    <ArrowRightLeft className="mx-auto text-muted-foreground h-4 w-4" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Destination (To)</Label>
                                    <div className="h-10 px-3 py-2 border rounded-md bg-slate-100 dark:bg-slate-950 text-sm font-medium text-slate-700 dark:text-slate-200 dark:border-slate-800 flex items-center">
                                        {toLoc === 'GODOWN' ? 'Main Godown' : 'Retail Shop'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded text-xs text-blue-700 dark:text-blue-400 flex justify-between">
                                <span>Available in {fromLoc === 'GODOWN' ? 'Godown' : 'Shop'}:</span>
                                <span className={currentStockInFrom < Number(quantity || 0) ? "text-red-600 font-bold" : "font-bold"}>
                                    {currentStockInFrom} {selectedItem.baseUnit}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label>Quantity to Shift</Label>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                    placeholder="Enter Qty..."
                                    className="font-bold text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Notes (Optional)</Label>
                                <Input
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="e.g. Daily restocking"
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!selectedItemId || !quantity || Number(quantity) <= 0 || Number(quantity) > currentStockInFrom}>
                        Confirm Shift
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
