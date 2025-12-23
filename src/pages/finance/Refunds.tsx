import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock data for refunds
const refundsData = [
    { id: 1, dealer: 'Kumar Cards', orderId: 'ORD-2345', amount: 1500, reason: 'Defective print', status: 'Pending', date: '2024-12-23' },
    { id: 2, dealer: 'Print Hub', orderId: 'ORD-2289', amount: 800, reason: 'Wrong design', status: 'Approved', date: '2024-12-22' },
    { id: 3, dealer: 'City Prints', orderId: 'ORD-2256', amount: 2500, reason: 'Order cancelled', status: 'Processed', date: '2024-12-21' },
    { id: 4, dealer: 'Nisha Graphics', orderId: 'ORD-2234', amount: 450, reason: 'Quantity mismatch', status: 'Rejected', date: '2024-12-20' },
    { id: 5, dealer: 'Rajan Traders', orderId: 'ORD-2198', amount: 3200, reason: 'Late delivery', status: 'Pending', date: '2024-12-23' },
];

const Refunds = () => {
    const pendingRefunds = refundsData.filter(r => r.status === 'Pending');
    const approvedRefunds = refundsData.filter(r => r.status === 'Approved');
    const processedRefunds = refundsData.filter(r => r.status === 'Processed');

    const totalPending = pendingRefunds.reduce((sum, r) => sum + r.amount, 0);
    const totalProcessed = processedRefunds.reduce((sum, r) => sum + r.amount, 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock className="h-4 w-4 text-orange-500" />;
            case 'Approved': return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case 'Processed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'Rejected': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Refunds</h1>
                <p className="text-muted-foreground">Manage refund requests and track processed refunds.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingRefunds.length}</div>
                        <p className="text-xs text-muted-foreground">₹{totalPending.toLocaleString()} total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{approvedRefunds.length}</div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processed</CardTitle>
                        <Receipt className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{processedRefunds.length}</div>
                        <p className="text-xs text-muted-foreground">₹{totalProcessed.toLocaleString()} refunded</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{refundsData.length}</div>
                        <p className="text-xs text-muted-foreground">Total requests</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Refund Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dealer</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Amount (₹)</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {refundsData.map((refund) => (
                                <TableRow key={refund.id}>
                                    <TableCell className="font-medium">{refund.dealer}</TableCell>
                                    <TableCell>{refund.orderId}</TableCell>
                                    <TableCell>₹{refund.amount.toLocaleString()}</TableCell>
                                    <TableCell>{refund.reason}</TableCell>
                                    <TableCell>{refund.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(refund.status)}
                                            <Badge variant={
                                                refund.status === 'Processed' ? 'default' :
                                                    refund.status === 'Approved' ? 'secondary' :
                                                        refund.status === 'Rejected' ? 'destructive' : 'outline'
                                            }>
                                                {refund.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {refund.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="default">Approve</Button>
                                                <Button size="sm" variant="destructive">Reject</Button>
                                            </div>
                                        )}
                                        {refund.status === 'Approved' && (
                                            <Button size="sm" variant="default">Process</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Refunds;
