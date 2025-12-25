
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
import { IndianRupee } from 'lucide-react';

interface StockEntryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: InventoryItem;
    mode: 'INWARD' | 'TRANSFER' | 'EXCHANGE'; // Keeping types to avoid breaking parent passing strings, though EXCHANGE is deprecated
    onSubmit: (data: any) => void;
}

const MOCK_SUPPLIERS = ["Paper Mart", "Techno Colors", "PrintColors Inc", "RollMaster", "Flex World", "Local Stationers", "Tech Fix", "Stamp Makers Inc"];

export function StockEntryModal({ open, onOpenChange, item, mode, onSubmit }: StockEntryModalProps) {
    const isTransfer = mode === 'TRANSFER';

    const [formData, setFormData] = useState({
        quantity: '',
        location: item.location,
        targetLoc: 'GODOWN',
        supplier: item.lastSupplier || '',
        invoiceNo: '',
        unitCost: item.purchasePrice.toString(),
        notes: ''
    });

    const [unitType, setUnitType] = useState<'PURCHASE' | 'BASE'>('PURCHASE');

    const currentQty = item.stockLevels ? (item.stockLevels.godown + item.stockLevels.shop) : 0;

    const handleSubmit = () => {
        let finalQty = Number(formData.quantity);
        if (unitType === 'PURCHASE') {
            finalQty = finalQty * item.conversionRatio;
        }

        onSubmit({
            ...formData,
            quantity: finalQty,
            purchasePrice: formData.unitCost, // mapping for compatibility if needed, but StockDashboard should change
            vendor: formData.supplier // mapping
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isTransfer ? 'Transfer Stock' : 'Receive Goods (Inward)'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Details</Label>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm text-muted-foreground">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</span> <br />
                            Current: {currentQty} {item.baseUnit}
                            {item.conversionRatio > 1 && ` (≈ ${(currentQty / item.conversionRatio).toFixed(1)} ${item.purchaseUnit})`}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Quantity</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    placeholder="0"
                                    className="h-10 text-lg font-bold"
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                                <div className="w-[120px]">
                                    <Select
                                        value={unitType}
                                        onValueChange={(v: 'PURCHASE' | 'BASE') => setUnitType(v)}
                                    >
                                        <SelectTrigger className="px-2 h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PURCHASE">{item.purchaseUnit}</SelectItem>
                                            <SelectItem value="BASE">{item.baseUnit}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {unitType === 'PURCHASE' && formData.quantity && (
                                <p className="text-[10px] text-muted-foreground text-right">
                                    = {Number(formData.quantity) * item.conversionRatio} {item.baseUnit}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{isTransfer ? 'From Location' : 'Target Location'}</Label>
                            {isTransfer ? (
                                <Input
                                    value={formData.location} // Legacy
                                    disabled
                                    className="h-10 bg-slate-100"
                                />
                            ) : (
                                <Select
                                    value={formData.targetLoc}
                                    onValueChange={(v) => setFormData({ ...formData, targetLoc: v })}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GODOWN">Main Godown (Bulk)</SelectItem>
                                        <SelectItem value="SHOP">Retail Shop (Daily)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {!isTransfer && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Supplier</Label>
                                    <Select
                                        value={formData.supplier}
                                        onValueChange={(val) => setFormData({ ...formData, supplier: val })}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_custom">Type Manually...</SelectItem>
                                            {Array.from(new Set([item.lastSupplier, ...MOCK_SUPPLIERS].filter(Boolean))).map(s => (
                                                <SelectItem key={s} value={s as string}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Fallback to Input if needed or requested, but User asked for Select. */}
                                </div>
                                <div className="space-y-2">
                                    <Label>Invoice No</Label>
                                    <Input
                                        value={formData.invoiceNo}
                                        placeholder="INV-..."
                                        className="h-10"
                                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Unit Cost (Per {item.purchaseUnit})</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        className="pl-8 h-10"
                                        value={formData.unitCost}
                                        onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                            value={formData.notes}
                            className="h-10"
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Optional remarks..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{isTransfer ? 'Transfer Stock' : 'Receive Goods'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
