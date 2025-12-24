import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MapPin, Package, ArrowRight } from 'lucide-react';
import DeliveryDetailModal from './DeliveryDetailModal';
import {
    MOCK_DELIVERIES,
    Delivery,
    DeliveryStatus,
    Route,
    ROUTES,
    getStatusColor,
    getPaymentStatusColor,
    getRouteLabel,
} from '@/data/mockSalesData';

const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);
    const [selectedRoute, setSelectedRoute] = useState<Route | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | 'all'>('all');
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredDeliveries = deliveries.filter((d) => {
        const routeMatch = selectedRoute === 'all' || d.route === selectedRoute;
        const statusMatch = selectedStatus === 'all' || d.status === selectedStatus;
        return routeMatch && statusMatch;
    });

    const handleDeliveryClick = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setIsModalOpen(true);
    };

    const handleDeliveryComplete = (deliveryId: string, updates: Partial<Delivery>) => {
        setDeliveries((prev) =>
            prev.map((d) => (d.id === deliveryId ? { ...d, ...updates } : d))
        );
    };

    const counts = {
        pending: deliveries.filter((d) => d.status === 'pending').length,
        delivered: deliveries.filter((d) => d.status === 'delivered').length,
        returned: deliveries.filter((d) => d.status === 'returned').length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Delivery List</h1>
                <p className="text-muted-foreground">Manage today's and pending deliveries.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedRoute} onValueChange={(val) => setSelectedRoute(val as Route | 'all')}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Route" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Routes</SelectItem>
                        {ROUTES.map((route) => (
                            <SelectItem key={route.id} value={route.id}>{route.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as DeliveryStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status ({deliveries.length})</SelectItem>
                        <SelectItem value="pending">Pending ({counts.pending})</SelectItem>
                        <SelectItem value="delivered">Delivered ({counts.delivered})</SelectItem>
                        <SelectItem value="returned">Returned ({counts.returned})</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Delivery List */}
            <Card>
                <CardHeader>
                    <CardTitle>Deliveries ({filteredDeliveries.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredDeliveries.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p>No deliveries found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredDeliveries.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => handleDeliveryClick(delivery)}
                                >
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{delivery.customerName}</span>
                                            <Badge className={`text-xs ${getStatusColor(delivery.status)}`}>
                                                {delivery.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono">{delivery.orderId}</p>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{delivery.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <Badge variant="outline" className="text-xs">{getRouteLabel(delivery.route)}</Badge>
                                            <Badge className={`text-xs ${getPaymentStatusColor(delivery.paymentStatus)}`}>
                                                {delivery.paymentStatus === 'paid' ? 'Paid' : `₹${delivery.amount}`}
                                            </Badge>
                                        </div>
                                        {delivery.status === 'returned' && delivery.returnReason && (
                                            <p className="text-xs text-destructive mt-1">Return: {delivery.returnReason}</p>
                                        )}
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

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
