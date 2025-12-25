import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    MapPin,
    Package,
    ArrowRight,
    Image,
    Eye,
    Truck,
    CheckCircle,
    Clock,
    Phone,
    Filter
} from 'lucide-react';
import DeliveryDetailModal from './DeliveryDetailModal';
import {
    MOCK_DELIVERIES,
    MOCK_LINE_STAFF,
    Delivery,
    DeliveryStatus,
    getStatusColor,
    getPaymentStatusColor,
    getRouteLabel,
    getRouteColor,
} from '@/data/mockSalesData';

const DeliveryList = () => {
    const staffInfo = MOCK_LINE_STAFF;

    // Filter to show only deliveries in staff's assigned route
    const myRouteDeliveries = MOCK_DELIVERIES.filter(d => d.route === staffInfo.assignedRoute);

    const [deliveries, setDeliveries] = useState<Delivery[]>(myRouteDeliveries);
    const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewDelivery, setPreviewDelivery] = useState<Delivery | null>(null);

    const filteredDeliveries = deliveries.filter(d =>
        statusFilter === 'all' || d.status === statusFilter
    );

    const counts = {
        all: deliveries.length,
        pending: deliveries.filter(d => d.status === 'pending' || d.status === 'in-transit').length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
        returned: deliveries.filter(d => d.status === 'returned').length,
    };

    const handleDeliveryClick = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setIsModalOpen(true);
    };

    const handleMarkTaken = (e: React.MouseEvent, deliveryId: string) => {
        e.stopPropagation();
        setDeliveries(prev =>
            prev.map(d => d.id === deliveryId ? { ...d, takenForDelivery: true, status: 'in-transit' as DeliveryStatus } : d)
        );
    };

    const handleDeliveryComplete = (deliveryId: string, updates: Partial<Delivery>) => {
        setDeliveries(prev =>
            prev.map(d => d.id === deliveryId ? { ...d, ...updates } : d)
        );
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Delivery List</h1>
                    <p className="text-sm text-muted-foreground">Your assigned route deliveries</p>
                </div>
                <Badge className={`${getRouteColor(staffInfo.assignedRoute)}`}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {getRouteLabel(staffInfo.assignedRoute)}
                </Badge>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                >
                    All ({counts.all})
                </Button>
                <Button
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('pending')}
                    className={statusFilter === 'pending' ? '' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}
                >
                    <Clock className="h-3 w-3 mr-1" />
                    Pending ({counts.pending})
                </Button>
                <Button
                    variant={statusFilter === 'delivered' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('delivered')}
                    className={statusFilter === 'delivered' ? '' : 'text-green-600 border-green-200 hover:bg-green-50'}
                >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Done ({counts.delivered})
                </Button>
                <Button
                    variant={statusFilter === 'returned' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('returned')}
                    className={statusFilter === 'returned' ? '' : 'text-red-600 border-red-200 hover:bg-red-50'}
                >
                    Returned ({counts.returned})
                </Button>
            </div>

            {/* Delivery Cards */}
            {filteredDeliveries.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No deliveries found</p>
                        <p className="text-sm">Try a different filter</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredDeliveries.map((delivery) => (
                        <Card
                            key={delivery.id}
                            className="cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => handleDeliveryClick(delivery)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    {/* Status Indicator */}
                                    <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${delivery.status === 'delivered' ? 'bg-green-500' :
                                            delivery.status === 'in-transit' ? 'bg-blue-500' :
                                                delivery.status === 'returned' ? 'bg-red-500' :
                                                    'bg-amber-500'
                                        }`} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold truncate">{delivery.customerName}</p>
                                            <Badge className={`text-xs ${getStatusColor(delivery.status)}`}>
                                                {delivery.status === 'in-transit' ? 'On Way' : delivery.status}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-2 truncate">
                                            {delivery.itemDescription}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {delivery.location.split(',')[0]}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {delivery.customerPhone}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-xs ${getPaymentStatusColor(delivery.paymentStatus)}`}>
                                                    {delivery.paymentStatus === 'paid' ? '✓ Paid' : `₹${delivery.amount} due`}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Qty: {delivery.quantity}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            {delivery.status === 'pending' && !delivery.takenForDelivery && (
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => handleMarkTaken(e, delivery.id)}
                                                >
                                                    <Truck className="h-3 w-3 mr-1" />
                                                    Take
                                                </Button>
                                            )}
                                            {delivery.takenForDelivery && delivery.status !== 'delivered' && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <Truck className="h-3 w-3 mr-1" /> Taken
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <DeliveryDetailModal
                delivery={selectedDelivery}
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedDelivery(null); }}
                onDeliveryComplete={handleDeliveryComplete}
            />
        </div>
    );
};

export default DeliveryList;
