
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SealTemplate, StampBlock, INK_COLORS } from '@/data/mockSealCatalog';
import Step3_LivePreview from '../Step3_LivePreview';
import { Check, ShoppingCart, X } from 'lucide-react';

interface OrderSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    template: SealTemplate;
    blocks: StampBlock[];
    color: string;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
    isOpen, onClose, onConfirm, template, blocks, color
}) => {

    // Calculate Price
    const typeBasePrice = 350; // Mock base price
    const templatePrice = template.priceModifier;
    const itemsPrice = blocks.filter(b => b.type === 'PLACEHOLDER').length * 50; // Extra charge for complexities if needed
    const totalPrice = typeBasePrice + templatePrice + itemsPrice;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-slate-50 flex flex-col md:flex-row h-[80vh] md:h-[600px]">

                {/* LEFT: VISUAL PREVIEW */}
                <div className="flex-1 bg-white flex items-center justify-center p-8 border-r relative pattern-grid-lg">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Preview</span>
                    </div>
                    <div className="scale-75 md:scale-100 shadow-2xl rounded-lg overflow-hidden border">
                        <Step3_LivePreview template={template} blocks={blocks} color={color} scale={1} />
                    </div>
                </div>

                {/* RIGHT: ORDER DETAILS */}
                <div className="w-full md:w-[400px] flex flex-col bg-slate-50">
                    <DialogHeader className="p-6 border-b bg-white">
                        <DialogTitle className="text-xl font-bold text-slate-800">Review Order</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        {/* Breakdown */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Specifications</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white p-3 rounded border">
                                    <div className="text-slate-400 text-xs">Type</div>
                                    <div className="font-medium">Self-Inking</div>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <div className="text-slate-400 text-xs">Shape</div>
                                    <div className="font-medium">{template.shape}</div>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <div className="text-slate-400 text-xs">Dimensions</div>
                                    <div className="font-medium">{template.dimensions}</div>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <div className="text-slate-400 text-xs">Ink Color</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                        <span className="font-medium">{INK_COLORS.find(c => c.hex === color)?.name || 'Black'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Price Breakdown</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Base Unit Price</span>
                                    <span className="font-medium">₹{typeBasePrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{template.name} Template</span>
                                    <span className="font-medium">₹{templatePrice}</span>
                                </div>
                                {itemsPrice > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Complex Layout Charges</span>
                                        <span className="font-medium">₹{itemsPrice}</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-200 my-2" />
                                <div className="flex justify-between text-lg font-bold text-emerald-700">
                                    <span>Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t flex flex-col gap-3">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg" onClick={onConfirm}>
                            Add to Cart <ShoppingCart className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-600" onClick={onClose}>
                            Continue Editing
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default OrderSummaryModal;
