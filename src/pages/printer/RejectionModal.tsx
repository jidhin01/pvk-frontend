import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RejectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
    jobId: string;
}

export default function RejectionModal({ open, onOpenChange, onConfirm, jobId }: RejectionModalProps) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for rejection.");
            return;
        }
        onConfirm(reason);
        setReason(''); // Reset
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Job #{jobId}</DialogTitle>
                    <DialogDescription>
                        This will notify the dealer/designer. Please specify the issue clearly.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason for rejection *</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., File resolution too low, Bleed area missing..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleSubmit}>Reject Job</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
