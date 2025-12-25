import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MapPin, Phone, CheckCircle, XCircle, QrCode, Package } from 'lucide-react';
import { toast } from 'sonner';
import {
    Delivery,
    PaymentMethod,
    PAYMENT_METHODS,
    getStatusColor,
} from '@/data/mockSalesData';

interface DeliveryDetailModalProps {
    delivery: Delivery | null;
    isOpen: boolean;
    onClose: () => void;
    onDeliveryComplete: (deliveryId: string, updates: Partial<Delivery>) => void;
}

const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
    delivery,
    isOpen,
    onClose,
    onDeliveryComplete,
}) => {
    const [isQuantityVerified, setIsQuantityVerified] = useState(false);
    const [isDesignVerified, setIsDesignVerified] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
    const [showQR, setShowQR] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [returnReason, setReturnReason] = useState('');

    React.useEffect(() => {
        if (delivery) {
            setIsQuantityVerified(delivery.isQuantityVerified);
            setIsDesignVerified(delivery.isDesignVerified);
            setPaymentMethod(delivery.paymentMethod || '');
            setShowQR(false);
            setShowReturnForm(false);
            setReturnReason(delivery.returnReason || '');
        }
    }, [delivery]);

    if (!delivery) return null;

    const balanceDue = delivery.amount - delivery.amountPaid;
    const canComplete = isQuantityVerified && isDesignVerified && (delivery.paymentStatus === 'paid' || paymentMethod);

    const handleMarkDelivered = () => {
        if (!canComplete) {
            toast.error('Complete all verifications first');
            return;
        }
        onDeliveryComplete(delivery.id, {
            status: 'delivered',
            isQuantityVerified: true,
            isDesignVerified: true,
            paymentMethod: paymentMethod as PaymentMethod || delivery.paymentMethod,
            paymentStatus: 'paid',
            amountPaid: delivery.amount,
            deliveredAt: new Date().toISOString(),
        });
        toast.success('Delivery completed!');
        onClose();
    };

    const handleSalesReturn = () => {
        if (!returnReason.trim()) {
            toast.error('Enter return reason');
            return;
        }
        onDeliveryComplete(delivery.id, { status: 'returned', returnReason });
        toast.warning('Marked as return');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Delivery Details</DialogTitle>
                        <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status === 'in-transit' ? 'On Way' : delivery.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Customer */}
                    <div className="p-3 rounded-lg bg-muted/50">
                        <p className="font-semibold text-lg">{delivery.customerName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" />
                            {delivery.customerPhone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {delivery.location}
                        </div>
                    </div>

                    {/* Item */}
                    <div className="p-3 rounded-lg border">
                        <div className="flex items-start gap-3">
                            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">{delivery.itemDescription}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {delivery.quantity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Verification */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Verify before delivery</p>
                        <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                            <Checkbox
                                checked={isQuantityVerified}
                                onCheckedChange={(c) => setIsQuantityVerified(c === true)}
                            />
                            <span>Quantity matches ({delivery.quantity} items)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                            <Checkbox
                                checked={isDesignVerified}
                                onCheckedChange={(c) => setIsDesignVerified(c === true)}
                            />
                            <span>Design/Print is correct</span>
                        </label>
                    </div>

                    {/* Payment */}
                    <div className="p-3 rounded-lg border space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold">₹{delivery.amount}</span>
                        </div>
                        {balanceDue > 0 && (
                            <>
                                <div className="flex justify-between text-primary font-medium">
                                    <span>Balance Due</span>
                                    <span>₹{balanceDue}</span>
                                </div>
                                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_METHODS.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowQR(!showQR)}>
                                    <QrCode className="h-4 w-4 mr-2" />
                                    {showQR ? 'Hide QR' : 'Show Payment QR'}
                                </Button>
                                {showQR && (
                                    <div className="flex flex-col items-center py-3 bg-white rounded border">
                                        <div className="w-28 h-28 bg-black p-2 rounded">
                                            <div className="w-full h-full bg-white flex items-center justify-center rounded">
                                                <QrCode className="h-20 w-20 text-black" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">pvk@upi • ₹{balanceDue}</p>
                                    </div>
                                )}
                            </>
                        )}
                        {delivery.paymentStatus === 'paid' && (
                            <Badge className="w-full justify-center bg-green-100 text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" /> Payment Complete
                            </Badge>
                        )}
                    </div>

                    {/* Return Option */}
                    {!showReturnForm ? (
                        <Button variant="ghost" size="sm" className="w-full text-red-600" onClick={() => setShowReturnForm(true)}>
                            Mark as Return
                        </Button>
                    ) : (
                        <div className="space-y-2 p-3 rounded-lg border border-red-200 bg-red-50/50">
                            <Textarea
                                placeholder="Return reason..."
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="min-h-[60px]"
                            />
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowReturnForm(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" size="sm" className="flex-1" onClick={handleSalesReturn}>
                                    <XCircle className="h-3 w-3 mr-1" /> Confirm
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
                    <Button
                        className="flex-1"
                        onClick={handleMarkDelivered}
                        disabled={!canComplete || showReturnForm}
                    >
                        <CheckCircle className="h-4 w-4 mr-1" /> Delivered
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryDetailModal;
