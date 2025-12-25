import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrinterJob } from '@/data/mockPrinterData';
import { CheckCircle2, PackageCheck, User, Building, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface HandoverQueueProps {
    jobs: PrinterJob[];
    onUpdateJob: (jobId: string, updates: Partial<PrinterJob>) => void;
}

export default function HandoverQueue({ jobs, onUpdateJob }: HandoverQueueProps) {
    // Filter for 'completed' jobs waiting for handover
    const completedJobs = jobs.filter(job => job.status === 'completed');

    const handleHandover = (jobId: string) => {
        onUpdateJob(jobId, { status: 'handed_over' });
        toast.success(`Job #${jobId} handed over to Line Staff.`);
    };

    if (completedJobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 min-h-[400px]">
                <PackageCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground">No Jobs Waiting for Handover</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                    Great job! All printed materials have been handed over to the line staff for finishing and dispatch.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Ready for Disptach / Finishing
                </h2>
                <p className="text-sm text-muted-foreground">These jobs are printed and ready to be physically moved to the next station.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedJobs.map(job => (
                    <Card key={job.id} className="flex flex-col border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">
                                        <CheckCircle2 className="h-3 w-3" /> Printed
                                    </div>
                                    <CardTitle className="text-base">{job.jobName}</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">ID: {job.id}</p>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {job.technology}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className={`p-2 rounded-full shrink-0 ${job.dealerType === 'dealer' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {job.dealerType === 'dealer' ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">{job.dealerType || 'Client'}</p>
                                    <p className="font-semibold truncate text-sm">{job.dealerName || 'Unknown'}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleHandover(job.id)}
                            >
                                <PackageCheck className="mr-2 h-4 w-4" /> Handover to Line Staff
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
