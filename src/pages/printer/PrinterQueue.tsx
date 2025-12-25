import React, { useState } from 'react';
import {
    Printer,
    Layers,
    Zap,
    Settings,
    LayoutList,
    User,
    Building,
    Calendar,
    FileText
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { PrinterJob, PvcBatchJob, DigitalJob, OffsetJob } from '@/data/mockPrinterData';
import RejectionModal from './RejectionModal';
import PvcBatchCard from './components/PvcBatchCard';
import DigitalJobCard from './components/DigitalJobCard';
import OffsetJobCard from './components/OffsetJobCard';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface PrinterQueueProps {
    jobs: PrinterJob[];
    onUpdateJob: (jobId: string, updates: Partial<PrinterJob>) => void;
}

export default function PrinterQueue({ jobs, onUpdateJob }: PrinterQueueProps) {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [viewContentsOpen, setViewContentsOpen] = useState(false);
    const [viewBatch, setViewBatch] = useState<PvcBatchJob | null>(null);

    // Filter Logic
    const activeJobs = jobs.filter(job => ['ready_for_print', 'printing'].includes(job.status));
    const pvcJobs = activeJobs.filter(j => j.technology === 'PVC') as PvcBatchJob[];
    const digitalJobs = activeJobs.filter(j => j.technology === 'DIGITAL') as DigitalJob[];
    const offsetJobs = activeJobs.filter(j => j.technology === 'OFFSET') as OffsetJob[];

    const handleDownload = (job: PrinterJob) => {
        toast.success(`Downloading assets for Job #${job.id}`);
    };

    const handleStatusChange = (jobId: string, newStatus: PrinterJob['status']) => {
        onUpdateJob(jobId, { status: newStatus });
        if (newStatus === 'printing') {
            toast.info(`Job #${jobId} started.`);
        } else if (newStatus === 'completed') {
            toast.success(`Job #${jobId} printed. Moved to Handover.`);
        }
    };

    const initiateReject = (jobId: string) => {
        setSelectedJobId(jobId);
        setRejectModalOpen(true);
    };

    const confirmReject = (reason: string) => {
        if (selectedJobId) {
            onUpdateJob(selectedJobId, { status: 'rejected', rejectionReason: reason });
            toast.error(`Job #${selectedJobId} rejected.`);
            setSelectedJobId(null);
        }
    };

    const handleViewContents = (batch: PvcBatchJob) => {
        setViewBatch(batch);
        setViewContentsOpen(true);
    };



    // Generic Empty State
    const EmptyState = ({ label }: { label: string }) => (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 min-h-[300px]">
            <LayoutList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No {label} Jobs</h3>
            <p className="text-muted-foreground">Queue is empty for this station.</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Tabs defaultValue="pvc" className="w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <TabsList className="h-auto p-1 bg-muted/50 border grid grid-cols-3 w-full md:w-auto md:flex">
                        <TabsTrigger value="pvc" className="h-12 px-2 md:px-6 gap-2 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Layers className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">PVC Station</span><span className="sm:hidden">PVC</span>
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-[20px]">{pvcJobs.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="digital" className="h-12 px-2 md:px-6 gap-2 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Zap className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Digital Press</span><span className="sm:hidden">Digital</span>
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-[20px]">{digitalJobs.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="offset" className="h-12 px-2 md:px-6 gap-2 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Settings className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Offset</span><span className="sm:hidden">Offset</span>
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-[20px]">{offsetJobs.length}</Badge>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="pvc" className="mt-0 space-y-4">
                    {pvcJobs.length === 0 ? <EmptyState label="PVC" /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {pvcJobs.map(job => (
                                <PvcBatchCard
                                    key={job.id}
                                    batch={job}
                                    onDownload={handleDownload}
                                    onStatusChange={handleStatusChange}
                                    onReject={initiateReject}
                                    onViewContents={handleViewContents}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="digital" className="mt-0 space-y-4">
                    {digitalJobs.length === 0 ? <EmptyState label="Digital" /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {digitalJobs.map(job => (
                                <DigitalJobCard
                                    key={job.id}
                                    job={job}
                                    onDownload={handleDownload}
                                    onStatusChange={handleStatusChange}
                                    onReject={initiateReject}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="offset" className="mt-0 space-y-4">
                    {offsetJobs.length === 0 ? <EmptyState label="Offset" /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {offsetJobs.map(job => (
                                <OffsetJobCard
                                    key={job.id}
                                    job={job}
                                    onStatusChange={handleStatusChange}
                                    onReject={initiateReject}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <RejectionModal
                open={rejectModalOpen}
                onOpenChange={setRejectModalOpen}
                onConfirm={confirmReject}
                jobId={selectedJobId || ''}
            />

            {/* View Contents Modal for PVC Batches */}
            <Dialog open={viewContentsOpen} onOpenChange={setViewContentsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contents of {viewBatch?.jobName}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-y-auto">
                        <ul className="space-y-2">
                            {viewBatch?.items.map((item, idx) => (
                                <li key={idx} className="p-2 border rounded-md flex items-center justify-between text-sm">
                                    <span>{item}</span>
                                    <Badge variant="outline" className="text-xs">Included</Badge>
                                </li>
                            ))}
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}