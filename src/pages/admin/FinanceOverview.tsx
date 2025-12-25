import React, { useMemo, useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Wallet,
    Receipt,
    Users,
    Palette,
    ArrowUpRight,
    ArrowDownRight,
    LayoutDashboard,
    Banknote,
    Smartphone,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Package,
    IndianRupee,
    AlertOctagon,
    Lightbulb,
    Truck,
    Wrench,
    Coffee,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    MOCK_DESIGNER_STATS,
    MOCK_SALES_REVENUE,
    MOCK_EXPENSES,
    MOCK_COLLECTIONS,
    MOCK_PRODUCT_COSTS,
    MOCK_REFUNDS,
    MOCK_PAYMENTS,
} from '@/data/mockFinanceData';

// Mock finance stats
const MOCK_FINANCE_STATS = {
    totalRevenue: '₹12,45,000',
    revenueChange: 15.2,
    todayCollection: '₹45,200',
    todayChange: 8.5,
    pendingCredit: '₹2,35,000',
    creditChange: -5.3,
    totalExpenses: '₹3,20,000',
    expenseChange: 12.1,
};

const MOCK_REVENUE_BREAKDOWN = [
    { category: 'PVC Cards', amount: '₹4,50,000', percentage: 36 },
    { category: 'Printing Services', amount: '₹3,80,000', percentage: 30 },
    { category: 'Design Services', amount: '₹2,10,000', percentage: 17 },
    { category: 'PAN Cards', amount: '₹1,25,000', percentage: 10 },
    { category: 'Seals', amount: '₹80,000', percentage: 7 },
];

const MOCK_RECENT_TRANSACTIONS = [
    { id: 1, type: 'credit', description: 'Payment from ABC Prints', amount: '₹15,000', time: '2 hours ago' },
    { id: 2, type: 'debit', description: 'Salary - Designer Team', amount: '₹25,000', time: '5 hours ago' },
    { id: 3, type: 'credit', description: 'Cash Collection - Kochi', amount: '₹8,500', time: '1 day ago' },
    { id: 4, type: 'debit', description: 'Stock Purchase - PVC', amount: '₹45,000', time: '1 day ago' },
    { id: 5, type: 'credit', description: 'Payment from Quick Hub', amount: '₹22,000', time: '2 days ago' },
];

// ============= OVERVIEW TAB =============
const OverviewTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_FINANCE_STATS.totalRevenue}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+{MOCK_FINANCE_STATS.revenueChange}%</span> this month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{MOCK_FINANCE_STATS.todayCollection}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+{MOCK_FINANCE_STATS.todayChange}%</span> vs yesterday
                    </p>
                </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Credit</CardTitle>
                    <CreditCard className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{MOCK_FINANCE_STATS.pendingCredit}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">{MOCK_FINANCE_STATS.creditChange}%</span> reduced
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_FINANCE_STATS.totalExpenses}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-red-500" />
                        <span className="text-red-500">+{MOCK_FINANCE_STATS.expenseChange}%</span> this month
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Revenue Breakdown & Designer Earnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue by service category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {MOCK_REVENUE_BREAKDOWN.map((item) => (
                        <div key={item.category} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{item.category}</span>
                                <span className="text-muted-foreground">{item.amount} ({item.percentage}%)</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Top Designers</CardTitle>
                            <CardDescription>This month's earnings (₹5/design)</CardDescription>
                        </div>
                        <Palette className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {MOCK_DESIGNER_STATS.slice(0, 5).map((designer, index) => (
                            <div
                                key={designer.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{designer.name}</p>
                                        <p className="text-xs text-muted-foreground">{designer.completedDesigns} designs</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-green-600">₹{designer.totalEarnings}</p>
                                    {designer.mistakes > 0 && (
                                        <p className="text-xs text-red-500">-₹{designer.mistakes * 50} fines</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest financial activities</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {MOCK_RECENT_TRANSACTIONS.map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${tx.type === 'credit'
                                    ? 'bg-green-100 dark:bg-green-900'
                                    : 'bg-red-100 dark:bg-red-900'
                                    }`}>
                                    {tx.type === 'credit'
                                        ? <ArrowUpRight className="h-4 w-4 text-green-600" />
                                        : <ArrowDownRight className="h-4 w-4 text-red-600" />
                                    }
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{tx.description}</p>
                                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                                </div>
                            </div>
                            <span className={`font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// ============= DESIGNER EARNINGS TAB =============
const DesignerEarningsTab = () => {
    const aggregates = useMemo(() => {
        return MOCK_DESIGNER_STATS.reduce((acc, curr) => ({
            totalDesigns: acc.totalDesigns + curr.completedDesigns,
            totalFines: acc.totalFines + curr.mistakes,
            totalGross: acc.totalGross + (curr.completedDesigns * curr.baseRate),
            totalNet: acc.totalNet + curr.totalEarnings
        }), { totalDesigns: 0, totalFines: 0, totalGross: 0, totalNet: 0 });
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Designs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums">{aggregates.totalDesigns}</div>
                        <p className="text-xs text-muted-foreground">Across all designers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Fines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 tabular-nums">{aggregates.totalFines}</div>
                        <p className="text-xs text-muted-foreground">Mistakes penalized</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Gross Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums">₹{aggregates.totalGross.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Before fine deductions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Net Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 tabular-nums">₹{aggregates.totalNet.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Final calculated amount</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Performance Sheet</CardTitle>
                    <CardDescription>Rate: ₹5/design | Fine: ₹50/mistake</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">Designer Name</TableHead>
                                    <TableHead className="text-right">Completed</TableHead>
                                    <TableHead className="text-right">Mistakes</TableHead>
                                    <TableHead className="text-right">Gross (₹)</TableHead>
                                    <TableHead className="text-right">Fine Deduction (₹)</TableHead>
                                    <TableHead className="text-right">Net Earnings (₹)</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_DESIGNER_STATS.map((designer) => {
                                    const gross = designer.completedDesigns * designer.baseRate;
                                    const deduction = designer.mistakes * designer.penaltyRate;

                                    return (
                                        <TableRow key={designer.id}>
                                            <TableCell className="font-medium">
                                                {designer.name}
                                                <span className="block text-xs text-muted-foreground">{designer.id}</span>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">{designer.completedDesigns}</TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {designer.mistakes > 0 ? (
                                                    <span className="text-red-600 font-bold">{designer.mistakes}</span>
                                                ) : (
                                                    <span className="text-emerald-600">0</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground tabular-nums">₹{gross}</TableCell>
                                            <TableCell className="text-right text-red-500 tabular-nums font-medium">
                                                {deduction > 0 ? `- ₹${deduction}` : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-lg tabular-nums">₹{designer.totalEarnings}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={designer.mistakes === 0 ? 'default' : 'outline'} className={designer.mistakes > 0 ? 'border-red-200 text-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}>
                                                    {designer.mistakes === 0 ? 'Excellent' : 'Needs Review'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// ============= SALES REVENUE TAB =============
const SalesRevenueTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                    Sales Revenue Ledger
                </CardTitle>
                <CardDescription>Comprehensive log of all B2B and Retail sales for tax purposes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[120px]">Date</TableHead>
                                <TableHead className="min-w-[100px]">Order ID</TableHead>
                                <TableHead className="min-w-[140px]">Type</TableHead>
                                <TableHead className="text-right min-w-[120px]">Amount</TableHead>
                                <TableHead className="text-right min-w-[120px]">GST (If Applicable)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_SALES_REVENUE.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="whitespace-nowrap">{sale.date}</TableCell>
                                    <TableCell className="font-mono text-xs">{sale.orderId}</TableCell>
                                    <TableCell>
                                        {sale.type === 'B2B_GST' ? (
                                            <Badge className="bg-blue-600 hover:bg-blue-700">Generic B2B (GST)</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Retail (Cash)</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">₹{sale.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-muted-foreground tabular-nums">
                                        {sale.gstAmount ? <span className="text-orange-600">₹{sale.gstAmount.toLocaleString()}</span> : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
);

// ============= CREDIT & CASH TAB =============
const CreditCashTab = () => {
    const totalCash = MOCK_PAYMENTS.filter(p => p.method === 'Cash' && p.status === 'Received')
        .reduce((sum, p) => sum + p.amount, 0);
    const totalOnline = MOCK_PAYMENTS.filter(p => (p.method === 'GPay' || p.method === 'Bank Transfer') && p.status === 'Received')
        .reduce((sum, p) => sum + p.amount, 0);
    const totalCredit = MOCK_PAYMENTS.filter(p => p.method === 'Credit')
        .reduce((sum, p) => sum + p.amount, 0);
    const overdueCredit = MOCK_PAYMENTS.filter(p => p.status === 'Overdue')
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
        <div className="space-y-6 animate-in fade-in duration-300">
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
                            {MOCK_PAYMENTS.map((payment) => (
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

// ============= REFUNDS TAB =============
const RefundsTab = () => {
    const pendingRefunds = MOCK_REFUNDS.filter(r => r.status === 'Pending');
    const approvedRefunds = MOCK_REFUNDS.filter(r => r.status === 'Approved');
    const processedRefunds = MOCK_REFUNDS.filter(r => r.status === 'Processed');
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
        <div className="space-y-6 animate-in fade-in duration-300">
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
                        <div className="text-2xl font-bold">{MOCK_REFUNDS.length}</div>
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
                            {MOCK_REFUNDS.map((refund) => (
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

// ============= EXPENSES TAB =============
const ExpensesTab = () => {
    const stats = useMemo(() => {
        const total = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
        const byCategory: Record<string, number> = {};
        MOCK_EXPENSES.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
        });
        return { total, byCategory };
    }, []);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Rent': return <Wallet className="h-4 w-4" />;
            case 'Electricity': return <Lightbulb className="h-4 w-4" />;
            case 'Machine Maintenance': return <Wrench className="h-4 w-4" />;
            case 'Raw Materials': return <Truck className="h-4 w-4" />;
            case 'Tea/Snacks': return <Coffee className="h-4 w-4" />;
            case 'Salary': return <Wallet className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Outflow</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{stats.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total recorded expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Raw Materials</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(stats.byCategory['Raw Materials'] || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Stock replenishment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overheads</CardTitle>
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{((stats.byCategory['Rent'] || 0) + (stats.byCategory['Electricity'] || 0)).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Rent + Electricity</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Petty Cash</CardTitle>
                        <Coffee className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(stats.byCategory['Tea/Snacks'] || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Tea & Snacks</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense Journal</CardTitle>
                    <CardDescription>Detailed log of every payment made.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Paid Via</TableHead>
                                <TableHead className="text-right">Amount (₹)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_EXPENSES.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="whitespace-nowrap">{expense.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(expense.category)}
                                            {expense.category}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-muted-foreground">{expense.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal">
                                            {expense.paidBy}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">₹{expense.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

// ============= SALARY REPORTS TAB =============
const SalaryReportsTab = () => {
    const totals = MOCK_COLLECTIONS.reduce((acc, log) => ({
        collected: acc.collected + log.totalCollected,
        deducted: acc.deducted + log.expensesDeducted,
        handover: acc.handover + log.cashHandover,
        incentive: acc.incentive + (log.incentiveAmount || 0)
    }), { collected: 0, deducted: 0, handover: 0, incentive: 0 });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                        <Banknote className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 tabular-nums">₹{totals.collected.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Gross cash collected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Salary/Exp Deduction</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 tabular-nums">₹{totals.deducted.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Taken by staff from cash</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Cash Handover</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 tabular-nums">₹{totals.handover.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Actual cash received</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Incentives Due</CardTitle>
                        <AlertOctagon className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600 tabular-nums">₹{totals.incentive.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Performance bonuses</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Handover Log</CardTitle>
                    <CardDescription>
                        Records of cash collected by staff and amounts deducted for personal/official use.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Date</TableHead>
                                    <TableHead className="min-w-[150px]">Staff Name</TableHead>
                                    <TableHead className="text-right min-w-[120px]">Total Collected (₹)</TableHead>
                                    <TableHead className="text-right min-w-[150px]">Deducted (Salary/Exp) (₹)</TableHead>
                                    <TableHead className="text-right min-w-[120px]">Net Handover (₹)</TableHead>
                                    <TableHead className="text-right min-w-[100px]">Incentive (₹)</TableHead>
                                    <TableHead className="text-center min-w-[100px]">Status</TableHead>
                                    <TableHead className="min-w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_COLLECTIONS.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">{log.date}</TableCell>
                                        <TableCell className="font-medium">{log.staffName}</TableCell>
                                        <TableCell className="text-right tabular-nums">₹{log.totalCollected.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-orange-600 font-medium tabular-nums">
                                            {log.expensesDeducted > 0 ? `- ₹${log.expensesDeducted}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-emerald-600 tabular-nums">₹{log.cashHandover.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-purple-600 tabular-nums">
                                            {log.incentiveAmount > 0 ? `+ ₹${log.incentiveAmount}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={log.status === 'Verified' ? 'default' : log.status === 'Discrepancy' ? 'destructive' : 'secondary'} className={log.status === 'Verified' ? 'bg-emerald-600' : ''}>
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {log.status === 'Pending' && (
                                                <Button size="sm" variant="outline" className="h-7 text-xs w-full">Mark Verified</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// ============= PRODUCT COSTS TAB =============
const ProductCostsTab = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const categories = useMemo(() => {
        const cats = new Set(MOCK_PRODUCT_COSTS.map(p => p.category));
        return ['all', ...Array.from(cats)];
    }, []);

    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCT_COSTS.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    const totals = useMemo(() => {
        const totalPurchase = filteredProducts.reduce((sum, p) => sum + (p.purchaseCost * p.stock), 0);
        const totalDealerValue = filteredProducts.reduce((sum, p) => sum + (p.dealerPrice * p.stock), 0);
        const totalCustomerValue = filteredProducts.reduce((sum, p) => sum + (p.customerPrice * p.stock), 0);
        return { totalPurchase, totalDealerValue, totalCustomerValue };
    }, [filteredProducts]);

    const getMargin = (cost: number, price: number) => {
        if (cost === 0) return 100;
        return Math.round(((price - cost) / cost) * 100);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchase Value</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">₹{totals.totalPurchase.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Cost of current inventory</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dealer Stock Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totals.totalDealerValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">At dealer pricing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Retail Stock Value</CardTitle>
                        <IndianRupee className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">₹{totals.totalCustomerValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">At customer pricing</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div>
                            <CardTitle>Product Cost Analysis</CardTitle>
                            <CardDescription>Purchase cost vs selling prices with profit margins</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(cat => (
                                <Button
                                    key={cat}
                                    variant={categoryFilter === cat ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat === 'all' ? 'All' : cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[200px]">Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Purchase Cost</TableHead>
                                    <TableHead className="text-right">Dealer Price</TableHead>
                                    <TableHead className="text-right">Dealer Margin</TableHead>
                                    <TableHead className="text-right">Customer Price</TableHead>
                                    <TableHead className="text-right">Customer Margin</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => {
                                    const dealerMargin = getMargin(product.purchaseCost, product.dealerPrice);
                                    const customerMargin = getMargin(product.purchaseCost, product.customerPrice);

                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                                <span className="block text-xs text-muted-foreground">{product.id}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{product.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                                ₹{product.purchaseCost}/{product.unit}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600 tabular-nums">
                                                ₹{product.dealerPrice}/{product.unit}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={dealerMargin >= 50 ? 'bg-green-600' : dealerMargin >= 25 ? 'bg-yellow-500' : 'bg-orange-500'}>
                                                    +{dealerMargin}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-purple-600 tabular-nums">
                                                ₹{product.customerPrice}/{product.unit}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={customerMargin >= 100 ? 'bg-green-600' : customerMargin >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}>
                                                    +{customerMargin}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {product.stock} {product.unit}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// ============= MAIN COMPONENT =============
const FinanceOverview = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Finance Management</h1>
                <p className="text-muted-foreground">Complete financial overview, earnings, expenses, and cost analysis</p>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1 gap-1">
                    <TabsTrigger value="overview" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <LayoutDashboard className="h-4 w-4 hidden sm:block" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="designer-earnings" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <Palette className="h-4 w-4 hidden sm:block" />
                        Designers
                    </TabsTrigger>
                    <TabsTrigger value="sales-revenue" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <TrendingUp className="h-4 w-4 hidden sm:block" />
                        Sales
                    </TabsTrigger>
                    <TabsTrigger value="credit-cash" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <CreditCard className="h-4 w-4 hidden sm:block" />
                        Credit
                    </TabsTrigger>
                    <TabsTrigger value="refunds" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <Receipt className="h-4 w-4 hidden sm:block" />
                        Refunds
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <Wallet className="h-4 w-4 hidden sm:block" />
                        Expenses
                    </TabsTrigger>
                    <TabsTrigger value="salary" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <Users className="h-4 w-4 hidden sm:block" />
                        Salary
                    </TabsTrigger>
                    <TabsTrigger value="product-costs" className="gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                        <Package className="h-4 w-4 hidden sm:block" />
                        Costs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <OverviewTab />
                </TabsContent>

                <TabsContent value="designer-earnings">
                    <DesignerEarningsTab />
                </TabsContent>

                <TabsContent value="sales-revenue">
                    <SalesRevenueTab />
                </TabsContent>

                <TabsContent value="credit-cash">
                    <CreditCashTab />
                </TabsContent>

                <TabsContent value="refunds">
                    <RefundsTab />
                </TabsContent>

                <TabsContent value="expenses">
                    <ExpensesTab />
                </TabsContent>

                <TabsContent value="salary">
                    <SalaryReportsTab />
                </TabsContent>

                <TabsContent value="product-costs">
                    <ProductCostsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FinanceOverview;
