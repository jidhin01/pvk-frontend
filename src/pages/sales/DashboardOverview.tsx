import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    CheckCircle,
    Clock,
    Wallet,
    Truck,
    ArrowRight,
    Package,
    Undo2,
    Phone,
    Eye
} from 'lucide-react';
import {
    MOCK_DELIVERIES,
    MOCK_TODAY_FINANCIALS,
    MOCK_LINE_STAFF,
    getPaymentStatusColor,
    getRouteLabel,
    getRouteColor,
    getStatusColor,
} from '@/data/mockSalesData';

const DashboardOverview = () => {
    const staffInfo = MOCK_LINE_STAFF;

    // Filter deliveries to show only those in staff's assigned route
    const myDeliveries = MOCK_DELIVERIES.filter(d => d.route === staffInfo.assignedRoute);
    const pendingDeliveries = myDeliveries.filter(d => d.status === 'pending' || d.status === 'in-transit');
    const completedToday = myDeliveries.filter(d => d.status === 'delivered');
    const returnsToday = myDeliveries.filter(d => d.status === 'returned');
    const financials = MOCK_TODAY_FINANCIALS;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center pb-2">
                <Badge className={`text-sm px-4 py-1.5 mb-3 ${getRouteColor(staffInfo.assignedRoute)}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {getRouteLabel(staffInfo.assignedRoute)}
                </Badge>
                <h1 className="text-2xl font-bold">Good Morning, {staffInfo.name.split(' ')[0]}</h1>
                <p className="text-muted-foreground">Here's your delivery overview for today</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-bold">{pendingDeliveries.length}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold">{completedToday.length}</p>
                        <p className="text-xs text-muted-foreground">Done</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-2">
                            <Undo2 className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold">{returnsToday.length}</p>
                        <p className="text-xs text-muted-foreground">Returns</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">₹{(financials.cashCollected / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-muted-foreground">Collected</p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Deliveries */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Today's Deliveries</CardTitle>
                        <Badge variant="secondary">{pendingDeliveries.length} pending</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {pendingDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                            <p className="font-medium">All done!</p>
                            <p className="text-sm">No pending deliveries</p>
                        </div>
                    ) : (
                        pendingDeliveries.map((delivery) => (
                            <div
                                key={delivery.id}
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <div className={`w-2 h-12 rounded-full ${delivery.status === 'in-transit' ? 'bg-blue-500' : 'bg-amber-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">{delivery.customerName}</p>
                                        {delivery.takenForDelivery && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Truck className="h-3 w-3 mr-1" /> On way
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{delivery.itemDescription}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {delivery.location.split(',')[0]}
                                        </span>
                                        <Badge className={`text-xs ${getPaymentStatusColor(delivery.paymentStatus)}`}>
                                            {delivery.paymentStatus === 'paid' ? '✓ Paid' : `₹${delivery.amount - delivery.amountPaid}`}
                                        </Badge>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Cash Summary */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Today's Cash</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <p className="text-lg font-bold text-green-600">₹{financials.cashCollected.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Collected</p>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                            <p className="text-lg font-bold text-orange-600">₹{(financials.salaryTaken + financials.otherExpenses).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Expenses</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10">
                            <p className="text-lg font-bold text-primary">₹{financials.cashToDeposit.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">To Deposit</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;
