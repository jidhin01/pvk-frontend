
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
import { Eye, Clock, Calendar, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { PanApplication } from '@/data/mockPanData';
import { cn } from '@/lib/utils';
import { VerificationModal } from '@/pages/pan-team/VerificationModal';
import { toast } from 'sonner';

interface PanVerificationListProps {
    data: PanApplication[];
    onStatusChange: (id: string, newStatus: PanApplication['status'], rejectionReason?: string) => void;
}

export function PanVerificationList({ data, onStatusChange }: PanVerificationListProps) {
    const [selectedApp, setSelectedApp] = useState<PanApplication | null>(null);

    const getStatusBadge = (app: PanApplication) => {
        switch (app.status) {
            case 'pending_verification':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'sent_to_printer':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Sent to Print</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Digital Complete</Badge>;
            case 'reupload_requested':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200"><RotateCcw className="w-3 h-3 mr-1" /> Re-upload: {app.rejectionReason}</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge variant="outline">{app.status}</Badge>;
        }
    };

    const handleVerificationAction = (action: 'print' | 'complete' | 'reject' | 'reupload', reason?: string) => {
        if (!selectedApp) return;

        let newStatus: PanApplication['status'] = 'pending_verification'; // Default fallback

        if (action === 'print') {
            newStatus = 'sent_to_printer';
        } else if (action === 'complete') {
            newStatus = 'completed';
        } else if (action === 'reject') {
            newStatus = 'rejected';
        } else if (action === 'reupload') {
            newStatus = 'reupload_requested';
        }

        onStatusChange(selectedApp.id, newStatus, reason);
        setSelectedApp(null);
    };

    return (
        <>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Application ID</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submission</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((app) => (
                                <TableRow key={app.id} className="group hover:bg-muted/40 transition-colors">
                                    <TableCell className="font-medium">{app.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{app.applicantName}</span>
                                            <span className="text-xs text-muted-foreground">S/o {app.fatherName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 items-start">
                                            <Badge className={cn(
                                                app.type === 'EMERGENCY' ? "bg-red-100 text-red-700 hover:bg-red-200 border-red-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                                            )}>
                                                {app.type}
                                            </Badge>
                                            {!app.isPrintRequired && <span className="text-[10px] text-muted-foreground px-1 border rounded">No Print</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <Calendar className="mr-2 h-3 w-3" />
                                            {new Date(app.submittedAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(app)}</TableCell>
                                    <TableCell className="text-right">
                                        {app.status === 'pending_verification' ? (
                                            <Button size="sm" onClick={() => setSelectedApp(app)}>
                                                <Eye className="mr-2 h-4 w-4" /> Verify
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" disabled>
                                                Processed
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
