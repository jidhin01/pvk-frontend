import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet, Building2, Clock, QrCode } from 'lucide-react';

const PaymentCollection = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payment Collection</h1>
                <p className="text-muted-foreground">Manage payments via Cash, GPay, Bank Transfer, or Credit.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹8,500</div>
                        <p className="text-xs text-muted-foreground">Today's cash collection</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GPay</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹3,200</div>
                        <p className="text-xs text-muted-foreground">Digital payments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bank Transfer</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹1,500</div>
                        <p className="text-xs text-muted-foreground">Bank transfers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credit</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹2,750</div>
                        <p className="text-xs text-muted-foreground">Pending credit</p>
                    </CardContent>
                </Card>
            </div>

            {/* QR Code Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        QR Code for Payment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                            <QrCode className="h-24 w-24 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Scan to pay via UPI/GPay</p>
                        <Button variant="outline">Generate New QR</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No payment history available.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentCollection;
