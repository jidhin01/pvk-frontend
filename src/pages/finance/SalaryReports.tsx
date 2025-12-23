
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Banknote, CheckCircle, AlertOctagon } from 'lucide-react';
import { MOCK_COLLECTIONS } from '@/data/mockFinanceData';

const SalaryReports = () => {
    // Note: In this system, Salary Deductions are closely tied to "Collection Logs"
    // Staff take cash from daily collections for salary/expenses.

    // 1. Calculate totals from the Collection Log
    const totals = MOCK_COLLECTIONS.reduce((acc, log) => ({
        collected: acc.collected + log.totalCollected,
        deducted: acc.deducted + log.expensesDeducted, // This is effectively "Salary/Expense Taken"
        handover: acc.handover + log.cashHandover,
        incentive: acc.incentive + (log.incentiveAmount || 0)
    }), { collected: 0, deducted: 0, handover: 0, incentive: 0 });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Staff Account Ledger</h1>
                <p className="text-muted-foreground">Track daily collection handovers and salary deductions.</p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Collections</CardTitle>
                        <Banknote className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">₹{totals.collected.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Gross cash collected</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Salary/Exp Deduction</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">₹{totals.deducted.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Taken by staff from cash</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Net Cash Handover</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{totals.handover.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Actual cash received</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Incentives Due</CardTitle>
                        <AlertOctagon className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">₹{totals.incentive.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Performance bonuses</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Daily Handover Log</CardTitle>
                    <CardDescription>
                        Records of cash collected by staff and amounts deducted for personal/official use.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border dark:border-slate-800">
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
                                        <TableCell className="text-right text-orange-600 dark:text-orange-400 font-medium tabular-nums">
                                            {log.expensesDeducted > 0 ? `- ₹${log.expensesDeducted}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{log.cashHandover.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-purple-600 dark:text-purple-400 tabular-nums">
                                            {log.incentiveAmount > 0 ? `+ ₹${log.incentiveAmount}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={log.status === 'Verified' ? 'default' : log.status === 'Discrepancy' ? 'destructive' : 'secondary'} className={log.status === 'Verified' ? 'bg-emerald-600 dark:bg-emerald-700' : ''}>
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
                    <p className="text-xs text-muted-foreground mt-4 md:hidden text-center">← Scroll to view actions →</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalaryReports;
