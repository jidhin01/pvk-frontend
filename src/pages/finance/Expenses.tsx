import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, TrendingDown, Fuel, Truck, Wrench, FileText } from 'lucide-react';

// Mock data for expenses
const expensesData = [
    { id: 1, category: 'Fuel', description: 'Delivery vehicle fuel', amount: 2500, staff: 'Arun', date: '2024-12-23', status: 'Approved' },
    { id: 2, category: 'Maintenance', description: 'Printer repair', amount: 4500, staff: 'Shop', date: '2024-12-22', status: 'Approved' },
    { id: 3, category: 'Transport', description: 'Courier charges', amount: 800, staff: 'Kiran', date: '2024-12-22', status: 'Pending' },
    { id: 4, category: 'Supplies', description: 'Ink cartridges', amount: 3200, staff: 'Shop', date: '2024-12-21', status: 'Approved' },
    { id: 5, category: 'Fuel', description: 'Delivery fuel', amount: 1800, staff: 'Meera', date: '2024-12-21', status: 'Approved' },
    { id: 6, category: 'Miscellaneous', description: 'Office supplies', amount: 650, staff: 'Shop', date: '2024-12-20', status: 'Pending' },
];

const Expenses = () => {
    const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0);
    const approvedExpenses = expensesData.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
    const pendingExpenses = expensesData.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);

    const expenseByCategory = expensesData.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {} as Record<string, number>);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Fuel': return <Fuel className="h-4 w-4" />;
            case 'Transport': return <Truck className="h-4 w-4" />;
            case 'Maintenance': return <Wrench className="h-4 w-4" />;
            case 'Supplies': return <FileText className="h-4 w-4" />;
            default: return <Wallet className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <p className="text-muted-foreground">Track operational expenses including line staff expenses.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <Wallet className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{approvedExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Verified expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Wallet className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">₹{pendingExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fuel Costs</CardTitle>
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(expenseByCategory['Fuel'] || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Delivery expenses</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Staff/Source</TableHead>
                                <TableHead className="text-right">Amount (₹)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expensesData.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(expense.category)}
                                            {expense.category}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{expense.description}</TableCell>
                                    <TableCell>{expense.staff}</TableCell>
                                    <TableCell className="text-right text-red-600">₹{expense.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={expense.status === 'Approved' ? 'default' : 'secondary'}>
                                            {expense.status}
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

export default Expenses;
