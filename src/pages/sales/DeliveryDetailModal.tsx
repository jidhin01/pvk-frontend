import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import { MapPin, Phone, CheckCircle2, XCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import {
    Delivery,
    PaymentMethod,
    PAYMENT_METHODS,
    getStatusColor,
    getRouteLabel,
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
            toast.error('Please verify quantity, design, and payment method');
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
            toast.error('Please enter a return reason');
            return;
        }
        onDeliveryComplete(delivery.id, { status: 'returned', returnReason });
        toast.warning('Marked as Sales Return');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Delivery Details</DialogTitle>
                    <DialogDescription>{delivery.orderId}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="p-3 rounded-lg border space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{delivery.customerName}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {delivery.customerPhone}
                                </p>
                            </div>
                            <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                        </div>
                        <p className="text-sm flex items-start gap-1">
                            <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {delivery.location}
                        </p>
                        <Badge variant="outline" className="text-xs">{getRouteLabel(delivery.route)}</Badge>
                    </div>

                    {/* Item Info */}
                    <div className="p-3 rounded-lg border">
                        <p className="font-medium">{delivery.itemDescription}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {delivery.quantity}</p>
                    </div>

                    {/* Verification */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Verification</Label>
                        <div className="flex items-center space-x-2 p-2 rounded border">
                            <Checkbox id="qty" checked={isQuantityVerified} onCheckedChange={(c) => setIsQuantityVerified(c === true)} />
                            <Label htmlFor="qty" className="cursor-pointer">Quantity Verified</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded border">
                            <Checkbox id="design" checked={isDesignVerified} onCheckedChange={(c) => setIsDesignVerified(c === true)} />
                            <Label htmlFor="design" className="cursor-pointer">Design Correct</Label>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Total: ₹{delivery.amount}</span>
                            <span>Paid: ₹{delivery.amountPaid}</span>
                            {balanceDue > 0 && <span className="font-medium">Due: ₹{balanceDue}</span>}
                        </div>
                        {balanceDue > 0 && (
                            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHODS.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        <Button variant="outline" className="w-full" onClick={() => setShowQR(!showQR)}>
                            <QrCode className="h-4 w-4 mr-2" />
                            {showQR ? 'Hide QR' : 'Show QR Code'}
                        </Button>
                        {showQR && (
                            <div className="flex justify-center p-4 bg-white rounded border">
                                <div className="w-32 h-32 bg-black p-2 rounded">
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <QrCode className="h-20 w-20 text-black" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Return Form */}
                    {!showReturnForm ? (
                        <Button variant="ghost" className="w-full text-destructive" onClick={() => setShowReturnForm(true)}>
                            Mark as Sales Return
                        </Button>
                    ) : (
                        <div className="space-y-2 p-3 rounded border border-destructive/30">
                            <Label className="text-destructive">Return Reason</Label>
                            <Textarea
                                placeholder="Enter reason..."
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowReturnForm(false)}>Cancel</Button>
                                <Button variant="destructive" className="flex-1" onClick={handleSalesReturn} disabled={!returnReason.trim()}>
                                    <XCircle className="h-4 w-4 mr-1" /> Confirm Return
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button className="w-full" onClick={handleMarkDelivered} disabled={!canComplete || showReturnForm}>
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Delivered
                    </Button>
                    <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryDetailModal;
