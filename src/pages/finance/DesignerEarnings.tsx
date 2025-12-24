
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_DESIGNER_STATS } from '@/data/mockFinanceData';

const DesignerEarnings = () => {
    // Recalculate aggregates from the unified mock data
    const aggregates = useMemo(() => {
        return MOCK_DESIGNER_STATS.reduce((acc, curr) => ({
            totalDesigns: acc.totalDesigns + curr.completedDesigns,
            totalFines: acc.totalFines + curr.mistakes,
            totalGross: acc.totalGross + (curr.completedDesigns * curr.baseRate),
            totalNet: acc.totalNet + curr.totalEarnings
        }), { totalDesigns: 0, totalFines: 0, totalGross: 0, totalNet: 0 });
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Designer Earnings</h1>
                <p className="text-muted-foreground">Automatic payroll calculation based on performance output.</p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Designs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums">{aggregates.totalDesigns}</div>
                        <p className="text-xs text-muted-foreground">Across all designers</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Fines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">{aggregates.totalFines}</div>
                        <p className="text-xs text-muted-foreground">Mistakes penalized</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Gross Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums">₹{aggregates.totalGross.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Before fine deductions</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Net Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{aggregates.totalNet.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Final calculated amount</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Detailed Performance Sheet</CardTitle>
                    <CardDescription>Rate: ₹5/design | Fine: ₹50/mistake</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border dark:border-slate-800">
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
                                                    <span className="text-red-600 dark:text-red-400 font-bold">{designer.mistakes}</span>
                                                ) : (
                                                    <span className="text-emerald-600 dark:text-emerald-400">0</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground tabular-nums">₹{gross}</TableCell>
                                            <TableCell className="text-right text-red-500 dark:text-red-400 tabular-nums font-medium">
                                                {deduction > 0 ? `- ₹${deduction}` : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-lg tabular-nums">₹{designer.totalEarnings}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={designer.mistakes === 0 ? 'default' : 'outline'} className={designer.mistakes > 0 ? 'border-red-200 text-red-700 dark:text-red-300 dark:border-red-800' : 'bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700'}>
                                                    {designer.mistakes === 0 ? 'Excellent' : 'Needs Review'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 md:hidden text-center">← Scroll to view full details →</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DesignerEarnings;
