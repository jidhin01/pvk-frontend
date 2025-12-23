import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Banknote, Smartphone, Building2 } from 'lucide-react';

// Mock data for credit and cash tracking
const paymentsData = [
    { id: 1, dealer: 'Rajan Traders', amount: 15000, method: 'Credit', status: 'Pending', dueDate: '2024-12-28' },
    { id: 2, dealer: 'Kumar Cards', amount: 8500, method: 'Cash', status: 'Received', date: '2024-12-23' },
    { id: 3, dealer: 'Nisha Graphics', amount: 12000, method: 'GPay', status: 'Received', date: '2024-12-23' },
    { id: 4, dealer: 'City Prints', amount: 25000, method: 'Bank Transfer', status: 'Received', date: '2024-12-22' },
    { id: 5, dealer: 'Print Hub', amount: 9500, method: 'Credit', status: 'Overdue', dueDate: '2024-12-20' },
    { id: 6, dealer: 'Digital Zone', amount: 7200, method: 'Cash', status: 'Received', date: '2024-12-22' },
];

const CreditCash = () => {
    const totalCash = paymentsData.filter(p => p.method === 'Cash' && p.status === 'Received')
        .reduce((sum, p) => sum + p.amount, 0);
    const totalOnline = paymentsData.filter(p => (p.method === 'GPay' || p.method === 'Bank Transfer') && p.status === 'Received')
        .reduce((sum, p) => sum + p.amount, 0);
    const totalCredit = paymentsData.filter(p => p.method === 'Credit')
        .reduce((sum, p) => sum + p.amount, 0);
    const overdueCredit = paymentsData.filter(p => p.status === 'Overdue')
        .reduce((sum, p) => sum + p.amount, 0);

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'Cash': return <Banknote className="h-4 w-4" />;
            case 'GPay': return <Smartphone className="h-4 w-4" />;
            case 'Bank Transfer': return <Building2 className="h-4 w-4" />;
            default: return <CreditCard className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Credit & Cash</h1>
                <p className="text-muted-foreground">Track payment collections by method: Cash, GPay, Bank Transfer, Credit.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Received</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalCash.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Physical cash collected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online Payments</CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">₹{totalOnline.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">GPay & Bank Transfer</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credit Outstanding</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">₹{totalCredit.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Pending collection</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                        <CreditCard className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{overdueCredit.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Past due date</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dealer</TableHead>
                                <TableHead>Amount (₹)</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Date/Due Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentsData.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.dealer}</TableCell>
                                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getMethodIcon(payment.method)}
                                            {payment.method}
                                        </div>
                                    </TableCell>
                                    <TableCell>{payment.date || payment.dueDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            payment.status === 'Received' ? 'default' :
                                                payment.status === 'Overdue' ? 'destructive' : 'secondary'
                                        }>
                                            {payment.status}
                                        </Badge>
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

export default CreditCash;
