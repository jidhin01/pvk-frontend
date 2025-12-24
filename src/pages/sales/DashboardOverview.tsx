import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Clock, Wallet, Truck, ArrowRight } from 'lucide-react';
import {
    MOCK_DELIVERIES,
    MOCK_TODAY_FINANCIALS,
    getReadyForDeliveryCount,
    getPaymentStatusColor,
    getRouteLabel,
} from '@/data/mockSalesData';

const DashboardOverview = () => {
    const pendingDeliveries = MOCK_DELIVERIES.filter(d => d.status === 'pending');
    const completedToday = MOCK_DELIVERIES.filter(d => d.status === 'delivered');
    const returnsToday = MOCK_DELIVERIES.filter(d => d.status === 'returned');
    const readyCount = getReadyForDeliveryCount();
    const financials = MOCK_TODAY_FINANCIALS;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
                <p className="text-muted-foreground">Today's overview and pending deliveries.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingDeliveries.length + completedToday.length}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {readyCount > 0 && <span className="text-primary">{readyCount} ready</span>}
                            {readyCount === 0 && 'Awaiting delivery'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Collected</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{financials.cashCollected.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Cash in hand</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedToday.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {returnsToday.length > 0 ? `${returnsToday.length} returned` : 'Deliveries done'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Deliveries */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            All deliveries completed for today.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingDeliveries.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="font-medium truncate">{delivery.customerName}</div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{delivery.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {getRouteLabel(delivery.route)}
                                            </Badge>
                                            <Badge className={`text-xs ${getPaymentStatusColor(delivery.paymentStatus)}`}>
                                                {delivery.paymentStatus === 'paid' ? 'Paid' : `₹${delivery.amount - delivery.amountPaid}`}
                                            </Badge>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cash Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Cash Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Cash Collected</p>
                            <p className="text-lg font-semibold">₹{financials.cashCollected.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Salary Taken</p>
                            <p className="text-lg font-semibold">₹{financials.salaryTaken.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Expenses</p>
                            <p className="text-lg font-semibold">₹{financials.otherExpenses.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">To Deposit</p>
                            <p className="text-lg font-semibold text-primary">₹{financials.cashToDeposit.toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;
