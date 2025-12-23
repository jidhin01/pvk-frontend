
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
import { IndianRupee } from 'lucide-react';

interface StockEntryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: InventoryItem;
    mode: 'INWARD' | 'TRANSFER' | 'EXCHANGE';
    onSubmit: (data: any) => void;
}

export function StockEntryModal({ open, onOpenChange, item, mode, onSubmit }: StockEntryModalProps) {
    const [formData, setFormData] = useState({
        quantity: '',
        location: mode === 'INWARD' ? 'godown' : 'shop', // Default to godown for inward, shop for transfer target
        vendor: '',
        purchasePrice: item.purchasePrice.toString(),
        batchNumber: '',
        notes: ''
    });

    const isExchange = mode === 'EXCHANGE';

    const handleSubmit = () => {
        // Validation could go here
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'INWARD' ? 'Add New Stock' : mode === 'EXCHANGE' ? 'Swap / Exchange Stock' : 'Transfer Stock'}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="font-medium text-sm text-muted-foreground pb-2 border-b">
                        {item.name} <span className="text-xs text-slate-400">({item.id})</span>
                    </div>

                    {mode === 'INWARD' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Vendor Name</Label>
                                    <Input
                                        className="h-12"
                                        placeholder="Supplier..."
                                        value={formData.vendor}
                                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Batch No.</Label>
                                    <Input
                                        className="h-12"
                                        placeholder="Optional"
                                        value={formData.batchNumber}
                                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    Purchase Price (Per Unit)
                                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                </Label>
                                <Input
                                    type="number"
                                    className="h-12 text-lg font-bold tabular-nums"
                                    value={formData.purchasePrice}
                                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground">Current cost: ₹{item.purchasePrice}</p>
                            </div>
                        </>
                    )}

                    {!isExchange && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    className="h-12 text-lg font-bold tabular-nums"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{mode === 'INWARD' ? 'Target Location' : 'Transfer To'}</Label>
                                <Select
                                    defaultValue={mode === 'INWARD' ? 'godown' : 'shop'}
                                    onValueChange={(v) => setFormData({ ...formData, location: v })}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="godown">Godown</SelectItem>
                                        <SelectItem value="shop">Shop</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {isExchange && (
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-md text-sm text-orange-800 space-y-3">
                            <p className="font-medium">Exchange Plan:</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-orange-700">
                                <li>Move <b>{item.shopQty} units</b> (Dead Stock) from Shop &rarr; Godown.</li>
                                <li>Move <b>{Math.min(item.shopQty, item.godownQty)} fresh units</b> from Godown &rarr; Shop.</li>
                            </ul>
                            <div className="pt-2">
                                <Label className="text-orange-900">Confirm Quantity to Swap</Label>
                                <Input
                                    type="number"
                                    className="bg-white mt-1 h-12 text-lg font-bold tabular-nums border-orange-200 focus-visible:ring-orange-500"
                                    defaultValue={Math.min(item.shopQty, item.godownQty)}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                            className="h-12"
                            placeholder="Reason for movement..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" className="h-12 w-full sm:w-auto" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="h-12 w-full sm:w-auto" onClick={handleSubmit}>{mode === 'INWARD' ? 'Add Stock' : mode === 'EXCHANGE' ? 'Run Exchange' : 'Transfer'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
