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

interface MaterialReturnModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inventory: InventoryItem[];
    onSubmit: (data: any) => void;
}

const DEPARTMENTS = ["Printing", "Binding", "Lamination", "Sales / Front Office", "Dispatch"];

export function MaterialReturnModal({ open, onOpenChange, inventory, onSubmit }: MaterialReturnModalProps) {
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [quantity, setQuantity] = useState('');
    const [from, setFrom] = useState('');
    const [fromType, setFromType] = useState<'DEPT' | 'JOB'>('DEPT');
    const [targetLoc, setTargetLoc] = useState<'GODOWN' | 'SHOP'>('GODOWN');

    // Derived
    const selectedItem = inventory.find(i => i.id === selectedItemId);
    const [unitType, setUnitType] = useState<'BASE'>('BASE');

    const handleSubmit = () => {
        if (!selectedItemId || !quantity || !from) return;

        const finalQty = Number(quantity);

        onSubmit({
            itemId: selectedItemId,
            quantity: finalQty,
            from: fromType === 'DEPT' ? `Dept: ${from}` : `Job: ${from}`,
            targetLoc
        });
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        setSelectedItemId('');
        setQuantity('');
        setFrom('');
        setTargetLoc('GODOWN');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Return Material (Stock In)</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Returned From</Label>
                        <div className="flex gap-2 mb-2">
                            <Button
                                size="sm"
                                variant={fromType === 'DEPT' ? 'default' : 'outline'}
                                onClick={() => setFromType('DEPT')}
                                className="flex-1"
                            >
                                Department
                            </Button>
                            <Button
                                size="sm"
                                variant={fromType === 'JOB' ? 'default' : 'outline'}
                                onClick={() => setFromType('JOB')}
                                className="flex-1"
                            >
                                Job Order
                            </Button>
                        </div>

                        {fromType === 'DEPT' ? (
                            <Select value={from} onValueChange={setFrom}>
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
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Select Material</Label>
                        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Search Item..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                {inventory.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedItem && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity ({selectedItem.baseUnit})</Label>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                    className="font-bold tabular-nums"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Return To Location</Label>
                                <Select value={targetLoc} onValueChange={(v: any) => setTargetLoc(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GODOWN">Godown</SelectItem>
                                        <SelectItem value="SHOP">Shop</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedItemId || !quantity || !from}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Confirm Return
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
