import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Banknote, Calculator, CheckCircle } from 'lucide-react';

// Mock data for salary reports
const salaryData = [
    {
        id: 1,
        name: 'Arun Kumar',
        role: 'Line Staff',
        baseSalary: 18000,
        cashTaken: 5000,
        expenses: 2500,
        adjustment: -500,
        status: 'Verified'
    },
    {
        id: 2,
        name: 'Kiran Raj',
        role: 'Line Staff',
        baseSalary: 18000,
        cashTaken: 8000,
        expenses: 1800,
        adjustment: 0,
        status: 'Pending'
    },
    {
        id: 3,
        name: 'Meera Nair',
        role: 'Line Staff',
        baseSalary: 18000,
        cashTaken: 3000,
        expenses: 1500,
        adjustment: 0,
        status: 'Verified'
    },
    {
        id: 4,
        name: 'Suresh M',
        role: 'Printer',
        baseSalary: 22000,
        cashTaken: 0,
        expenses: 0,
        adjustment: 0,
        status: 'Verified'
    },
    {
        id: 5,
        name: 'Priya S',
        role: 'Designer',
        baseSalary: 20000,
        cashTaken: 0,
        expenses: 0,
        adjustment: 990,
        status: 'Verified'
    },
];

const SalaryReports = () => {
    const totalBaseSalary = salaryData.reduce((sum, s) => sum + s.baseSalary, 0);
    const totalCashTaken = salaryData.reduce((sum, s) => sum + s.cashTaken, 0);
    const totalExpenses = salaryData.reduce((sum, s) => sum + s.expenses, 0);
    const pendingCount = salaryData.filter(s => s.status === 'Pending').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Salary Reports</h1>
                <p className="text-muted-foreground">Track salary advances, cash taken by line staff, and expense claims.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Salaries</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalBaseSalary.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{salaryData.length} employees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Taken</CardTitle>
                        <Banknote className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">₹{totalCashTaken.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From collections</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expense Claims</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Operational expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">Need review</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Salary Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Base Salary (₹)</TableHead>
                                <TableHead className="text-right">Cash Taken (₹)</TableHead>
                                <TableHead className="text-right">Expenses (₹)</TableHead>
                                <TableHead className="text-right">Adjustments (₹)</TableHead>
                                <TableHead className="text-right">Net Payable (₹)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salaryData.map((salary) => {
                                const netPayable = salary.baseSalary - salary.cashTaken + salary.expenses + salary.adjustment;
                                return (
                                    <TableRow key={salary.id}>
                                        <TableCell className="font-medium">{salary.name}</TableCell>
                                        <TableCell>{salary.role}</TableCell>
                                        <TableCell className="text-right">{salary.baseSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-orange-600">
                                            {salary.cashTaken > 0 ? `-${salary.cashTaken.toLocaleString()}` : '0'}
                                        </TableCell>
                                        <TableCell className="text-right text-blue-600">
                                            {salary.expenses > 0 ? `+${salary.expenses.toLocaleString()}` : '0'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {salary.adjustment !== 0 && (
                                                <span className={salary.adjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {salary.adjustment > 0 ? `+${salary.adjustment}` : salary.adjustment}
                                                </span>
                                            )}
                                            {salary.adjustment === 0 && '0'}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{netPayable.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={salary.status === 'Verified' ? 'default' : 'secondary'}>
                                                {salary.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {salary.status === 'Pending' && (
                                                <Button size="sm" variant="default">Verify</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalaryReports;
