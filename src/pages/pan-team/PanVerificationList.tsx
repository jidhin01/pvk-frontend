import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Eye,
    Clock,
    Calendar,
    CheckCircle2,
    XCircle,
    RotateCcw,
    User,
    AlertTriangle
} from 'lucide-react';
import { PancardOrder } from '@/data/mockPancardData';
import { cn } from '@/lib/utils';
import { VerificationModal } from '@/pages/pan-team/VerificationModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PanVerificationListProps {
    data: PancardOrder[];
    onStatusChange: (id: string, newStatus: PancardOrder['status'], rejectionReason?: string) => void;
}

export function PanVerificationList({ data, onStatusChange }: PanVerificationListProps) {
    const [selectedApp, setSelectedApp] = useState<PancardOrder | null>(null);

    const getStatusBadge = (app: PancardOrder) => {
        switch (app.status) {
            case 'PENDING':
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1.5 shadow-sm">
                        <Clock className="w-3 h-3" /> Pending
                    </Badge>
                );
            case 'SENT_TO_PRINTER':
                return (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Sent to Print
                    </Badge>
                );
            case 'COMPLETED':
                return (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Digital Complete
                    </Badge>
                );
            case 'REJECTED':
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 shadow-sm cursor-help">
                                    <XCircle className="w-3 h-3" /> Rejected
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reason: {app.rejectionReason || 'No reason provided'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            default:
                return <Badge variant="outline">{app.status}</Badge>;
        }
    };

    const handleVerificationAction = (action: 'print' | 'complete' | 'reject' | 'reupload', reason?: string) => {
        if (!selectedApp) return;

        let newStatus: PancardOrder['status'] = 'PENDING';

        if (action === 'print') {
            newStatus = 'SENT_TO_PRINTER';
        } else if (action === 'complete') {
            newStatus = 'COMPLETED';
        } else if (action === 'reject') {
            newStatus = 'REJECTED';
        } else if (action === 'reupload') {
            // newStatus = 'reupload_requested'; // Not supported in PancardOrder yet
            newStatus = 'PENDING';
        }

        onStatusChange(selectedApp.id, newStatus, reason);
        setSelectedApp(null);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[120px]">App ID</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                                        <div className="p-3 bg-muted/50 rounded-full">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <p>No applications found in this queue.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((app) => (
                                <TableRow
                                    key={app.id}
                                    className="group hover:bg-muted/40 transition-all cursor-pointer"
                                    onClick={() => app.status === 'PENDING' && setSelectedApp(app)}
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {app.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                                <AvatarFallback className={cn(
                                                    "text-white font-semibold text-xs",
                                                    app.type === 'EMERGENCY' ? "bg-gradient-to-br from-red-500 to-orange-500" : "bg-gradient-to-br from-blue-500 to-indigo-500"
                                                )}>
                                                    {getInitials(app.applicantName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                    {app.applicantName}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <User className="h-3 w-3" /> S/o {app.fatherName}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1">
                                            <Badge variant="secondary" className={cn(
                                                "font-medium border shadow-sm",
                                                app.type === 'EMERGENCY'
                                                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                            )}>
                                                {app.type === 'EMERGENCY' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                                {app.type}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <Clock className="mr-2 h-3.5 w-3.5" />
                                            {new Date(app.submittedAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                            <span className="text-xs ml-1 text-muted-foreground/50">
                                                {new Date(app.submittedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(app)}</TableCell>
                                    <TableCell className="text-right">
                                        {app.status === 'PENDING' ? (
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedApp(app);
                                                }}
                                                className={cn(
                                                    "transition-all shadow-sm",
                                                    app.type === 'EMERGENCY'
                                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                                        : "bg-primary hover:bg-primary/90"
                                                )}
                                            >
                                                <Eye className="mr-2 h-4 w-4" /> Verify
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" disabled className="opacity-50">
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Processed
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedApp && (
                <VerificationModal
                    application={selectedApp}
                    open={!!selectedApp}
                    onOpenChange={(open) => !open && setSelectedApp(null)}
                    onVerify={handleVerificationAction}
                />
            )}
        </>
    );
}
