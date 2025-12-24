import React from 'react';
import { DigitalJob } from '@/data/mockPrinterData';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Play, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

interface DigitalJobCardProps {
    job: DigitalJob;
    onDownload: (job: DigitalJob) => void;
    onStatusChange: (id: string, status: any) => void;
    onReject: (id: string) => void;
}

export default function DigitalJobCard({ job, onDownload, onStatusChange, onReject }: DigitalJobCardProps) {
    return (
        <Card className="flex flex-col shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-500 h-full">
            <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                            <Zap className="h-3 w-3" /> Digital
                        </div>
                        <h3 className="text-base font-bold leading-tight">{job.jobName}</h3>
                        <p className="text-xs text-muted-foreground">ID: {job.id}</p>
                    </div>
                    <Badge variant="outline" className="text-sm font-bold border-amber-200 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-700 px-2 py-0.5">
                        {job.quantity} Sets
                    </Badge>
                </div>

                <div className="bg-muted/40 p-3 rounded-md border border-border/50">
                    <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Paper Stock</div>
                    <div className="font-semibold text-foreground">{job.paperType}</div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2 pt-0 mt-auto">
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => onDownload(job)}>
                    <Download className="h-4 w-4" />
                </Button>

                {job.status === 'ready_for_print' ? (
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => onStatusChange(job.id, 'printing')}>
                        <Play className="mr-2 h-4 w-4" /> Print
                    </Button>
                ) : (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onStatusChange(job.id, 'completed')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Done
                    </Button>
                )}

                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onReject(job.id)}>
                    <AlertTriangle className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
