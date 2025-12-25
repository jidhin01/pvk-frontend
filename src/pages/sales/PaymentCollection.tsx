import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CreditCard, Wallet, Building2, Clock, QrCode, Smartphone, CheckCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_TODAY_FINANCIALS, MOCK_PAYMENT_RECORDS, MOCK_LINE_STAFF, PaymentRecord, getPaymentMethodLabel, getRouteLabel, getRouteColor } from '@/data/mockSalesData';

const PaymentCollection = () => {
    const [showQR, setShowQR] = useState(false);
    const [qrAmount, setQrAmount] = useState('');
    const [paymentRecords] = useState<PaymentRecord[]>(MOCK_PAYMENT_RECORDS);
    const financials = MOCK_TODAY_FINANCIALS;
    const staffInfo = MOCK_LINE_STAFF;

    return (
        <div className="space-y-5 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Payments</h1>
                    <p className="text-sm text-muted-foreground">Collect and track payments</p>
                </div>
                <Badge className={`${getRouteColor(staffInfo.assignedRoute)}`}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {getRouteLabel(staffInfo.assignedRoute)}
                </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <Wallet className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">₹{financials.cashCollected.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Cash</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">₹{financials.onlineReceived.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </CardContent>
                </Card>
            </div>

            {/* Credit Due Alert */}
            {financials.creditGiven > 0 && (
                <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
                    <CardContent className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <span className="text-sm">Credit pending</span>
                        </div>
                        <span className="font-bold text-orange-600">₹{financials.creditGiven.toLocaleString()}</span>
                    </CardContent>
                </Card>
            )}

            {/* QR Code */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment QR</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    {!showQR ? (
                        <div className="py-4">
                            <div className="flex items-center gap-2 max-w-xs mx-auto mb-3">
                                <Input
                                    type="number"
                                    placeholder="Amount (optional)"
                                    value={qrAmount}
                                    onChange={(e) => setQrAmount(e.target.value)}
                                />
                                <Button onClick={() => { setShowQR(true); toast.success('QR ready'); }}>
                                    <QrCode className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Generate QR for customer payment</p>
                        </div>
                    ) : (
                        <div className="py-4">
                            <div className="w-36 h-36 bg-black p-2 rounded-lg mx-auto mb-3">
                                <div className="w-full h-full bg-white flex items-center justify-center rounded">
                                    <QrCode className="h-28 w-28 text-black" />
                                </div>
                            </div>
                            <p className="font-medium">PVK Enterprises</p>
                            <p className="text-xs text-muted-foreground">pvk@upi</p>
                            {qrAmount && <Badge className="mt-2">₹{parseFloat(qrAmount).toLocaleString()}</Badge>}
                            <Button variant="outline" size="sm" className="mt-3" onClick={() => { setShowQR(false); setQrAmount(''); }}>
                                Done
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Today's Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {paymentRecords.length === 0 ? (
                        <p className="text-center py-6 text-muted-foreground">No payments yet</p>
                    ) : (
                        paymentRecords.map((record) => {
                            const time = new Date(record.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${record.method === 'cash' ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                            {record.method === 'cash' ?
                                                <Wallet className="h-4 w-4 text-green-600" /> :
                                                <Smartphone className="h-4 w-4 text-blue-600" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-medium">{record.customerName}</p>
                                            <p className="text-xs text-muted-foreground">{getPaymentMethodLabel(record.method)} • {time}</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-green-600">+₹{record.amount.toLocaleString()}</span>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentCollection;
