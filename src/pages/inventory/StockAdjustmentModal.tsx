
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InventoryItem } from '@/data/mockInventoryData';
import { ClipboardEdit, AlertOctagon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface StockAdjustmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inventory: InventoryItem[];
    onSubmit: (data: any) => void;
}

export function StockAdjustmentModal({ open, onOpenChange, inventory, onSubmit }: StockAdjustmentModalProps) {
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE'>('REMOVE');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [unitType, setUnitType] = useState<'BASE' | 'PURCHASE'>('BASE');
    const [targetLoc, setTargetLoc] = useState<'GODOWN' | 'SHOP'>('GODOWN');

    // Find the current selected item to show current stock
    const currentItem = inventory.find(i => i.id === selectedItemId);
    const currentStock = currentItem ? currentItem.stockLevels[targetLoc.toLowerCase() as 'godown' | 'shop'] : 0;

    const handleSubmit = () => {
        let finalQty = Number(quantity);
        if (unitType === 'PURCHASE' && currentItem) {
            finalQty = finalQty * currentItem.conversionRatio;
        }

        onSubmit({
            itemId: selectedItemId,
            location: targetLoc, // Logging string
            targetLoc: targetLoc, // Logic param
            type: adjustmentType === 'REMOVE' ? 'DAMAGE_LOSS' : 'INWARD',
            quantity: finalQty,
            reason
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-orange-700">
                        <ClipboardEdit className="h-5 w-5" />
                        Manual Stock Adjustment
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Item to Correct</Label>
                        <Select onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Search item..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                {inventory.map(item => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Select value={targetLoc} onValueChange={(v: any) => setTargetLoc(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GODOWN">Godown</SelectItem>
                                    <SelectItem value="SHOP">Note: Shop</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedItemId && (
                            <div className="space-y-2">
                                <Label>Current Stock</Label>
                                <div className="p-2 bg-muted/40 rounded text-sm font-mono font-bold border h-10 flex items-center">
                                    {currentStock}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={adjustmentType} onValueChange={(v: any) => setAdjustmentType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REMOVE">Remove (Loss/Damage)</SelectItem>
                                    <SelectItem value="ADD">Add (Found)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Adjustment Quantity</Label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className={adjustmentType === 'REMOVE' ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}
                                />
                            </div>
                            <div className="w-[140px]">
                                <Select
                                    value={unitType}
                                    onValueChange={(val: 'PURCHASE' | 'BASE') => setUnitType(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BASE">{currentItem?.baseUnit || 'Base'}</SelectItem>
                                        {currentItem?.purchaseUnit && (
                                            <SelectItem value="PURCHASE">{currentItem.purchaseUnit}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {unitType === 'PURCHASE' && currentItem && quantity && (
                            <p className="text-xs text-muted-foreground text-right">
                                = {Number(quantity) * currentItem.conversionRatio} {currentItem.baseUnit}
                            </p>
                        )}

                        {adjustmentType === 'REMOVE' && currentItem && quantity && (
                            <div className="p-2 bg-red-50 text-red-700 rounded text-xs flex items-center justify-between border border-red-100">
                                <span>Estimated Financial Loss:</span>
                                <span className="font-bold">
                                    ₹{Math.round((
                                        (unitType === 'PURCHASE' ? Number(quantity) * currentItem.conversionRatio : Number(quantity)) / currentItem.conversionRatio
                                    ) * currentItem.purchasePrice).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Reason (Mandatory)</Label>
                        <Textarea
                            placeholder={adjustmentType === 'REMOVE' ? "Describe damage or reason for loss..." : "Reason for surplus..."}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        {adjustmentType === 'REMOVE' && !reason && (
                            <p className="text-[10px] text-red-500 flex items-center gap-1">
                                <AlertOctagon className="h-3 w-3" /> Audit requires a reason for stock removal.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant={adjustmentType === 'REMOVE' ? 'destructive' : 'default'}
                        disabled={!selectedItemId || !quantity || (adjustmentType === 'REMOVE' && !reason)}
                    >
                        Confirm Adjustment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
