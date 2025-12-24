
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, TrendingDown, Fuel, Truck, Wrench, FileText, Coffee, Lightbulb } from 'lucide-react';
import { MOCK_EXPENSES } from '@/data/mockFinanceData';

const Expenses = () => {
    // Unified Calculation Logic
    const stats = useMemo(() => {
        const total = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
        // Assuming mocked data is 'Approved' for now, but counting them all
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
                <p className="text-muted-foreground">Central ledger for all operational outflows.</p>
            </div>

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
                                    <TableCell className="text-right font-bold text-slate-700">₹{expense.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Expenses;
