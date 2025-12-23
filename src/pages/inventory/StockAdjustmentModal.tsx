
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
    const [location, setLocation] = useState<'shop' | 'godown'>('shop');
    const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE'>('REMOVE');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');

    // Find the current selected item to show current stock
    const currentItem = inventory.find(i => i.id === selectedItemId);
    const currentStock = currentItem ? (location === 'shop' ? currentItem.shopQty : currentItem.godownQty) : 0;

    const handleSubmit = () => {
        onSubmit({
            itemId: selectedItemId,
            location,
            type: adjustmentType === 'REMOVE' ? 'DAMAGE_LOSS' : 'INWARD', // Map to movement types
            quantity: Number(quantity),
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
                            <SelectContent>
                                {inventory.map(item => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedItemId && (
                        <div className="p-2 bg-muted/40 rounded text-xs flex justify-between">
                            <span>Current System Stock ({location}):</span>
                            <span className="font-mono font-bold">{currentStock}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Select value={location} onValueChange={(v: any) => setLocation(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="shop">Shop Floor</SelectItem>
                                    <SelectItem value="godown">Godown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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

                    <div className="space-y-2">
                        <Label>Adjustment Quantity</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className={adjustmentType === 'REMOVE' ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">Units</span>
                        </div>
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
