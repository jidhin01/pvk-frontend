
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, AlertOctagon } from 'lucide-react';
import { StockMovement } from '@/data/mockInventoryData';

interface StockHistoryProps {
    data: StockMovement[];
}

export function StockHistory({ data }: StockHistoryProps) {
    const getActionBadge = (type: StockMovement['type']) => {
        switch (type) {
            case 'INWARD':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none"><ArrowDownLeft className="w-3 h-3 mr-1" /> INWARD</Badge>;
            case 'TRANSFER':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none"><ArrowRightLeft className="w-3 h-3 mr-1" /> TRANSFER</Badge>;
            case 'DAMAGE_LOSS':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none"><AlertOctagon className="w-3 h-3 mr-1" /> LOSS</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location Details</TableHead>
                        <TableHead className="text-right">Performed By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No movement history found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap font-mono text-xs">
                                    {new Date(log.date).toLocaleDateString()} <span className="text-muted-foreground">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {log.itemName}
                                </TableCell>
                                <TableCell>
                                    {getActionBadge(log.type)}
                                </TableCell>
                                <TableCell>
                                    <span className={log.type === 'INWARD' ? "text-emerald-600 font-bold" : log.type === 'DAMAGE_LOSS' ? "text-red-600 font-bold" : ""}>
                                        {log.type === 'INWARD' ? '+' : log.type === 'DAMAGE_LOSS' ? '-' : ''}{log.quantity}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">{log.location}</span>
                                    {log.notes && <p className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">{log.notes}</p>}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                    {log.performedBy}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
