
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_SALES_REVENUE } from '@/data/mockFinanceData';
import { Badge } from '@/components/ui/badge';
import { FileText, IndianRupee } from 'lucide-react';

const SalesRevenue = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <IndianRupee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    Sales Revenue Ledger
                </h2>
                <p className="text-muted-foreground">Comprehensive log of all B2B and Retail sales for tax purposes.</p>
            </div>

            <Card className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Transaction Log</CardTitle>
                    <CardDescription>Recent sales entries</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border dark:border-slate-800">
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
                                                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700">Generic B2B (GST)</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Retail (Cash)</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">₹{sale.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {sale.gstAmount ? <span className="text-orange-600 dark:text-orange-400">₹{sale.gstAmount.toLocaleString()}</span> : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 md:hidden text-center">← Scroll to view table →</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesRevenue;
