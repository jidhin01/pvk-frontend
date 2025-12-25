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
import { Textarea } from '@/components/ui/textarea';

interface MaterialIssueModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inventory: InventoryItem[];
    onSubmit: (data: any) => void;
}

const DEPARTMENTS = ["Printing", "Binding", "Lamination", "Sales / Front Office", "Dispatch"];

export function MaterialIssueModal({ open, onOpenChange, inventory, onSubmit }: MaterialIssueModalProps) {
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [quantity, setQuantity] = useState('');
    const [to, setTo] = useState(''); // Dept or Job ID
    const [toType, setToType] = useState<'DEPT' | 'JOB'>('DEPT');
    const [issueType, setIssueType] = useState<'PRODUCTION' | 'WASTAGE'>('PRODUCTION');
    const [reason, setReason] = useState('');
    const [sourceLoc, setSourceLoc] = useState<'GODOWN' | 'SHOP'>('SHOP'); // Default to Shop for Issues

    // Derived
    const selectedItem = inventory.find(i => i.id === selectedItemId);
    const [unitType, setUnitType] = useState<'PURCHASE' | 'BASE'>('BASE');

    const stockInSource = selectedItem
        ? selectedItem.stockLevels[sourceLoc.toLowerCase() as 'godown' | 'shop']
        : 0;

    const handleSubmit = () => {
        if (!selectedItemId || !quantity || !to) return;

        let finalQty = Number(quantity);
        if (unitType === 'PURCHASE' && selectedItem) {
            finalQty = finalQty * selectedItem.conversionRatio;
        }

        // Validate stock
        if (stockInSource < finalQty) {
            // Let parent handle or show error here
            // Using parent toast for consistency, but improved UX would be here.
        }

        onSubmit({
            itemId: selectedItemId,
            quantity: finalQty,
            to: toType === 'DEPT' ? `Dept: ${to}` : `Job: ${to}`,
            type: issueType,
            reason: issueType === 'WASTAGE' ? reason : undefined,
            sourceLoc // Pass this
        });
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        setSelectedItemId('');
        setQuantity('');
        setTo('');
        setReason('');
        setIssueType('PRODUCTION');
        setSourceLoc('SHOP');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Issue Material</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Material</Label>
                        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Search Item..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                {inventory.map(item => {
                                    const total = item.stockLevels ? (item.stockLevels.godown + item.stockLevels.shop) : 0;
                                    return (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name} ({total} {item.baseUnit})
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedItem && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Source Location</Label>
                                <Select value={sourceLoc} onValueChange={(v: any) => setSourceLoc(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SHOP">Retail Shop</SelectItem>
                                        <SelectItem value="GODOWN">Main Godown</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Available: <span className={stockInSource === 0 ? "text-red-500 font-bold" : "text-emerald-600 font-bold"}>
                                        {stockInSource} {selectedItem.baseUnit}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        className="font-bold tabular-nums"
                                    />
                                    <div className="w-[120px]">
                                        <Select value={unitType} onValueChange={(v: any) => setUnitType(v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BASE">{selectedItem.baseUnit}</SelectItem>
                                                <SelectItem value="PURCHASE">{selectedItem.purchaseUnit}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {unitType === 'PURCHASE' && quantity && (
                                    <p className="text-xs text-muted-foreground text-right">
                                        = {Number(quantity) * selectedItem.conversionRatio} {selectedItem.baseUnit}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label>Issue Type</Label>
                                <Select value={issueType} onValueChange={(v: any) => setIssueType(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PRODUCTION">Standard Production</SelectItem>
                                        <SelectItem value="WASTAGE">Wastage / Loss</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Issued To</Label>
                        <div className="flex gap-2 mb-2">
                            <Button
                                size="sm"
                                variant={toType === 'DEPT' ? 'default' : 'outline'}
                                onClick={() => setToType('DEPT')}
                                className="flex-1"
                            >
                                Department
                            </Button>
                            <Button
                                size="sm"
                                variant={toType === 'JOB' ? 'default' : 'outline'}
                                onClick={() => setToType('JOB')}
                                className="flex-1"
                            >
                                Job Order
                            </Button>
                        </div>

                        {toType === 'DEPT' ? (
                            <Select value={to} onValueChange={setTo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                placeholder="Enter Job ID (e.g. JB-1234)"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                            />
                        )}
                    </div>

                    {issueType === 'WASTAGE' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-red-500">Reason for Wastage (Required)</Label>
                            <Textarea
                                placeholder="Describe why this material is wasted..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                className="border-red-200 focus-visible:ring-red-500 bg-red-50/50"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedItemId || !quantity || !to || (issueType === 'WASTAGE' && !reason)}
                        className={issueType === 'WASTAGE' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        Issue Material
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
