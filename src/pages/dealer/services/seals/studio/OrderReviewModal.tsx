import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SealTemplate, StampBlock, INK_COLORS } from '@/data/mockSealCatalog';
import Step3_LivePreview from '../Step3_LivePreview';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useOrderSubmission, SubmissionSpecs } from './useOrderSubmission';
import { MOCK_INVENTORY } from '@/data/mockInventoryData';

interface OrderReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: SealTemplate;
    blocks: StampBlock[];
    color: string;
}

const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
    isOpen, onClose, template, blocks, color
}) => {
    const { isSubmitting, generateOrderPayload, submitOrder } = useOrderSubmission();

    // Form State
    const [quantity, setQuantity] = useState(1);
    const [remarks, setRemarks] = useState('');
    const [selectedModel, setSelectedModel] = useState<string>('INV-007'); // Default to our mock item
    const [inkColor, setInkColor] = useState(color);

    // Filter Inventory for Machines (Mock Logic)
    const machineOptions = MOCK_INVENTORY.filter(i => i.name.includes("Shiny") || i.name.includes("Stamp"));

    // Calculation
    const typeBasePrice = 350;
    const templatePrice = template.priceModifier;
    const itemsPrice = blocks.filter(b => b.type === 'PLACEHOLDER').length * 50;
    const modelPrice = machineOptions.find(m => m.id === selectedModel)?.sellingPrice || 0;

    // Note: In real app, Base Price might be 0 if Machine Model covers it, or additive.
    // For now, assuming Machine Model is an ADD-ON cost or replacement for Base Price.
    // Let's assume Machine Model Price REPLACES Base Price if selected?
    // User Requirement: "Base Price + Add-on Costs = Total".
    // I'll keep Type Base Price + Model Price (Assume model is the hardware, Type is service).

    const totalPrice = (typeBasePrice + templatePrice + itemsPrice + modelPrice) * quantity;

    const handleConfirm = async () => {
        // Mock Preview Image (In real app, use html2canvas)
        const mockPreviewUrl = "data:image/png;base64,...";

        const specs: SubmissionSpecs = {
            size: template.dimensions,
            mountType: "Self-Inking",
            inkColor: inkColor,
            machineModelId: selectedModel,
            quantity: quantity,
            remarks: remarks
        };

        const payload = generateOrderPayload(blocks, template, mockPreviewUrl, specs);
        await submitOrder(payload);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
            <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-background flex flex-col md:flex-row h-[85vh] md:h-[650px] border-border">

                {/* LEFT: VISUAL PREVIEW */}
                <div className="flex-1 bg-muted/30 dark:bg-muted/10 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border relative">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Snapshot</span>
                    </div>
                    <div className="scale-75 md:scale-90 shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-lg overflow-hidden border border-border bg-card">
                        <Step3_LivePreview template={template} blocks={blocks} color={inkColor} scale={1} />
                    </div>
                </div>

                {/* RIGHT: CONFIGURATION FORM */}
                <div className="w-full md:w-[450px] flex flex-col bg-background">
                    <DialogHeader className="p-6 border-b border-border">
                        <DialogTitle className="text-xl font-bold text-foreground">Finalize Order</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">

                        {/* 1. Machine Model */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Machine Model</Label>
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Machine" />
                                </SelectTrigger>
                                <SelectContent>
                                    {machineOptions.map(m => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.name} (+₹{m.sellingPrice})
                                        </SelectItem>
                                    ))}
                                    {machineOptions.length === 0 && <SelectItem value="generic">Generic Machine</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 2. Ink & Quantity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase">Ink Color</Label>
                                <Select value={inkColor} onValueChange={setInkColor}>
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: inkColor }} />
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INK_COLORS.map(c => (
                                            <SelectItem key={c.hex} value={c.hex}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: c.hex }} />
                                                    {c.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase">Quantity</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                />
                            </div>
                        </div>

                        {/* 3. Remarks */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Remarks</Label>
                            <Textarea
                                placeholder="Special instructions (e.g., Urgent, Call before delivery)"
                                className="h-20 resize-none"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm border border-border">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Service Cost</span>
                                <span>₹{typeBasePrice + templatePrice}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Machine Cost</span>
                                <span>₹{modelPrice}</span>
                            </div>
                            <div className="h-px bg-border my-2" />
                            <div className="flex justify-between font-bold text-lg text-primary">
                                <span>Total ({quantity}x)</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-background border-t border-border flex flex-col gap-3">
                        <Button
                            className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    Confirm & Place Order <ShoppingCart className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={onClose} disabled={isSubmitting}>
                            Back to Design
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderReviewModal;
