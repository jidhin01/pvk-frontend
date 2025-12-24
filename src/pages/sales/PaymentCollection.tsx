import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Building2, Clock, QrCode, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_TODAY_FINANCIALS, MOCK_PAYMENT_RECORDS, PaymentRecord, getPaymentMethodLabel } from '@/data/mockSalesData';

const PaymentCollection = () => {
    const [showQR, setShowQR] = useState(false);
    const [paymentRecords] = useState<PaymentRecord[]>(MOCK_PAYMENT_RECORDS);
    const financials = MOCK_TODAY_FINANCIALS;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payment Collection</h1>
                <p className="text-muted-foreground">Manage payments via Cash, GPay, Bank Transfer, or Credit.</p>
            </div>

            {/* Payment Method Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{financials.cashCollected.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Today's cash</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GPay/UPI</CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{financials.onlineReceived.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Digital payments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bank Transfer</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹0</div>
                        <p className="text-xs text-muted-foreground">NEFT/IMPS</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credit Due</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{financials.creditGiven.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Pending credit</p>
                    </CardContent>
                </Card>
            </div>

            {/* QR Code Section */}
            <Card>
                <CardHeader>
                    <CardTitle>QR Code for Payment</CardTitle>
                </CardHeader>
                <CardContent>
                    {!showQR ? (
                        <div className="flex flex-col items-center py-6">
                            <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">Generate QR for customers to scan and pay</p>
                            <Button onClick={() => { setShowQR(true); toast.success('QR Generated'); }}>
                                <QrCode className="h-4 w-4 mr-2" /> Generate QR Code
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4">
                            <div className="p-3 bg-white rounded-lg border mb-3">
                                <div className="w-40 h-40 bg-black p-2 rounded">
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <QrCode className="h-28 w-28 text-black" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-medium">PVK Enterprises</p>
                            <p className="text-xs text-muted-foreground mb-3">pvk@upi</p>
                            <Button variant="outline" onClick={() => setShowQR(false)}>Hide QR</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    {paymentRecords.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No payments recorded today</div>
                    ) : (
                        <div className="space-y-2">
                            {paymentRecords.map((record) => {
                                const time = new Date(record.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <div key={record.id} className="flex items-center justify-between p-3 rounded border">
                                        <div>
                                            <p className="font-medium">{record.customerName}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="outline">{getPaymentMethodLabel(record.method)}</Badge>
                                                <span>{time}</span>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-primary">+₹{record.amount.toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentCollection;
