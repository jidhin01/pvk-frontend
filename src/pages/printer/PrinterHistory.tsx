import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Calendar, Package, Building, User } from 'lucide-react';
import { MOCK_HISTORY_LOGS, LogEntry } from '@/data/mockPrinterData';

export default function PrinterHistory() {
    // In a real app, this date would be dynamic
    const today = new Date().toISOString().split('T')[0];
    const jobsToday = MOCK_HISTORY_LOGS.filter(log => log.timestamp.startsWith(today)).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Productivity Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-success-foreground uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Today's Output
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{jobsToday} Jobs</div>
                        <p className="text-xs text-muted-foreground mt-1">Completed successfully today</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        Production History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] hidden md:table-cell">Job ID</TableHead>
                                    <TableHead className="min-w-[150px]">Job/Batch Name</TableHead>
                                    <TableHead className="hidden sm:table-cell">Technology</TableHead>
                                    <TableHead className="hidden lg:table-cell">Material</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="hidden md:table-cell">Dealer</TableHead>
                                    <TableHead className="text-right whitespace-nowrap">Completed At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_HISTORY_LOGS.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium hidden md:table-cell">{log.id}</TableCell>
                                        <TableCell className="font-medium">
                                            {log.jobName}
                                            <div className="sm:hidden text-xs text-muted-foreground mt-0.5">{log.type}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {log.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">{log.material}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-medium">
                                                <Package className="h-3 w-3 text-muted-foreground" />
                                                {log.qty}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1 rounded-full ${
                                                    log.dealerType === 'dealer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {log.dealerType === 'dealer' ? <Building className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                                </div>
                                                <span className="text-sm">{log.dealerName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric',
                                                hour: 'numeric', minute: '2-digit'
                                            })}
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
}