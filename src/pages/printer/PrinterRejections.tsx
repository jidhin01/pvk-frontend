import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Search, AlertCircle, Building, User } from 'lucide-react';
import { MOCK_REJECTED_LOGS, LogEntry } from '@/data/mockPrinterData';

export default function PrinterRejections() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = MOCK_REJECTED_LOGS.filter(log =>
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.dealerName && log.dealerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Rejection Log</h2>
                    <p className="text-muted-foreground">Track jobs returned for corrections.</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Job ID, Name, or Dealer..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <CardTitle>Recent Rejections</CardTitle>
                    </div>
                    <CardDescription>
                        These jobs were removed from the print queue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border bg-background overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px] hidden md:table-cell">Job ID</TableHead>
                                    <TableHead className="min-w-[180px]">Details</TableHead>
                                    <TableHead className="hidden md:table-cell">Dealer</TableHead>
                                    <TableHead className="min-w-[250px]">Reason for Rejection</TableHead>
                                    <TableHead className="text-right whitespace-nowrap">Rejected At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="group">
                                            <TableCell className="font-bold font-mono text-muted-foreground hidden md:table-cell">{log.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{log.jobName}</div>
                                                <div className="text-xs text-muted-foreground md:hidden">{log.id}</div>
                                                <Badge variant="outline" className="mt-1 text-xs">
                                                    {log.type}
                                                </Badge>
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
                                            <TableCell>
                                                <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 text-destructive-foreground dark:text-red-300 dark:bg-red-950/30 border border-destructive/20 text-sm">
                                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <span className="font-semibold leading-snug">
                                                        {log.rejectionReason}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString(undefined, {
                                                    month: 'short', day: 'numeric',
                                                    hour: 'numeric', minute: '2-digit'
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No matching records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}