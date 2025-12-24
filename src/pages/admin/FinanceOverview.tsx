import React from 'react';
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
    ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock finance data
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

const MOCK_DESIGNER_EARNINGS = [
    { name: 'Anu Designer', designs: 145, earnings: '₹725', fines: 0 },
    { name: 'Ravi Designer', designs: 132, earnings: '₹610', fines: 50 },
    { name: 'Deepa Designer', designs: 128, earnings: '₹640', fines: 0 },
    { name: 'Kumar PVC', designs: 98, earnings: '₹490', fines: 100 },
    { name: 'Priya Designer', designs: 86, earnings: '₹430', fines: 0 },
];

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

const FinanceOverview = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Finance Overview</h1>
                <p className="text-muted-foreground">Monitor revenue, expenses, and financial health</p>
            </div>

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
                {/* Revenue Breakdown */}
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

                {/* Designer Earnings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Designer Earnings</CardTitle>
                                <CardDescription>This month's performance (₹5/design, ₹50 fine)</CardDescription>
                            </div>
                            <Palette className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {MOCK_DESIGNER_EARNINGS.map((designer, index) => (
                                <div
                                    key={designer.name}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{designer.name}</p>
                                            <p className="text-xs text-muted-foreground">{designer.designs} designs</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-600">{designer.earnings}</p>
                                        {designer.fines > 0 && (
                                            <p className="text-xs text-red-500">-₹{designer.fines} fines</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4" size="sm">
                            View All Designers
                        </Button>
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
                        <Button variant="outline" size="sm">View All</Button>
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

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Salary Reports
                        </Button>
                        <Button variant="outline" size="sm">
                            <Receipt className="h-4 w-4 mr-2" />
                            Add Expense
                        </Button>
                        <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Credit Recovery
                        </Button>
                        <Button variant="outline" size="sm">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Refund Management
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FinanceOverview;
