import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Upload,
  X,
  Check,
  AlertTriangle,
  Lock,
  FileImage,
  Trash2,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

type DesignerType = 'normal' | 'pvc';
type JobCategory = 'poster' | 'brochure' | 'price-tag' | 'pvc-card';

interface ActiveJob {
  id: string;
  dealer: string;
  category: JobCategory;
  printType: string;
  assignedAt: string;
  frontDesign?: string;
  backDesign?: string;
}

interface DesignerMyWorkProps {
  designerType?: DesignerType;
}

// Mock data - 1 job set to 1hr 50min ago to test alert soon
const getInitialJobs = (): ActiveJob[] => [
  {
    id: 'JOB-099',
    dealer: 'Omega Traders',
    category: 'poster',
    printType: 'Flex Print',
    assignedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
];

const BATCH_SIZE = 5;

const getCategoryLabel = (category: JobCategory): string => {
  const labels: Record<JobCategory, string> = {
    'poster': 'Poster',
    'brochure': 'Brochure',
    'price-tag': 'Price Tag',
    'pvc-card': 'PVC Card',
  };
  return labels[category];
};

const DesignerMyWork = ({ designerType = 'normal' }: DesignerMyWorkProps) => {
  const [jobs, setJobs] = useState<ActiveJob[]>(getInitialJobs);
  const [completedCount, setCompletedCount] = useState(0);
  const [overdueJob, setOverdueJob] = useState<ActiveJob | null>(null);
  const [releaseModal, setReleaseModal] = useState<{ open: boolean; jobId: string | null }>({ open: false, jobId: null });
  const [releaseReason, setReleaseReason] = useState('');
  const [, setTick] = useState(0);

  // Filter jobs based on designer type
  const filteredJobs = jobs.filter(job => {
    if (designerType === 'pvc') return job.category === 'pvc-card';
    return job.category !== 'pvc-card';
  });

  // Timer update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);

      const now = new Date().getTime();
      for (const job of filteredJobs) {
        const elapsed = now - new Date(job.assignedAt).getTime();
        const elapsedHours = elapsed / (1000 * 60 * 60);
        if (elapsedHours >= 2 && !overdueJob) {
          setOverdueJob(job);
          break;
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [filteredJobs, overdueJob]);

  // Initial check for overdue
  useEffect(() => {
    const now = new Date().getTime();
    for (const job of filteredJobs) {
      const elapsed = now - new Date(job.assignedAt).getTime();
      if (elapsed >= 2 * 60 * 60 * 1000) {
        setOverdueJob(job);
        break;
      }
    }
  }, []);

  const getElapsedTime = useCallback((assignedAt: string) => {
    const now = new Date().getTime();
    const assigned = new Date(assignedAt).getTime();
    const elapsed = now - assigned;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const mins = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, mins, totalMins: hours * 60 + mins, isNearDeadline: hours >= 1 && mins >= 45 };
  }, []);

  const handleFileUpload = (jobId: string, type: 'front' | 'back', file: File) => {
    setJobs(jobs.map(job =>
      job.id === jobId
        ? { ...job, [type === 'front' ? 'frontDesign' : 'backDesign']: file.name }
        : job
    ));
    toast.success(`${type === 'front' ? 'Front' : 'Back'} design uploaded`);
  };

  const handleDrop = (e: React.DragEvent, jobId: string, type: 'front' | 'back') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(jobId, type, file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleComplete = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job?.frontDesign) {
      toast.error('Please upload at least the front design');
      return;
    }
    setJobs(jobs.filter(j => j.id !== jobId));
    setCompletedCount(c => c + 1);
    toast.success(`Job ${jobId} completed!`, {
      description: completedCount + 1 >= BATCH_SIZE
        ? 'Batch ready for print!'
        : `${BATCH_SIZE - completedCount - 1} more to complete batch`
    });
  };

  const handleRelease = () => {
    if (!releaseModal.jobId || !releaseReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setJobs(jobs.filter(j => j.id !== releaseModal.jobId));
    toast.info(`Job ${releaseModal.jobId} released back to pool`);
    setReleaseModal({ open: false, jobId: null });
    setReleaseReason('');
  };

  const acknowledgeOverdue = () => {
    setOverdueJob(null);
    toast.warning('Please complete or release the overdue job soon');
  };

  const batchProgress = (completedCount % BATCH_SIZE) / BATCH_SIZE * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Workbench</h2>
          <p className="text-sm text-muted-foreground">
            {designerType === 'pvc' ? 'PVC Card jobs' : 'Poster, Brochure & Price Tag jobs'}
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Lock className="h-3 w-3 mr-1" />
          {filteredJobs.length} Active
        </Badge>
      </div>

      {/* Batch Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Batch Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedCount % BATCH_SIZE}/{BATCH_SIZE} designs
          </span>
        </div>
        <Progress value={batchProgress} className="h-2" />
      </Card>

      {/* Active Jobs */}
      {filteredJobs.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No active jobs</p>
            <p className="text-xs text-muted-foreground mt-1">Go to Work Pool to pick up new tasks</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const elapsed = getElapsedTime(job.assignedAt);
            const isOverdue = elapsed.hours >= 2;
            const isNearDeadline = elapsed.isNearDeadline;

            return (
              <Card
                key={job.id}
                className={`transition-all ${isOverdue
                    ? 'ring-2 ring-destructive animate-pulse'
                    : isNearDeadline
                      ? 'ring-1 ring-orange-500'
                      : ''
                  }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {job.id}
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{job.dealer}</p>
                    </div>
                    {/* Timer */}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isOverdue
                        ? 'bg-destructive/10 text-destructive'
                        : isNearDeadline
                          ? 'bg-orange-500/10 text-orange-600'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                      <Clock className="h-3 w-3" />
                      {elapsed.hours}h {elapsed.mins}m
                      {isOverdue && <AlertTriangle className="h-3 w-3" />}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="default" className="text-xs gap-1">
                      {job.category === 'pvc-card' ? <CreditCard className="h-3 w-3" /> : <FileImage className="h-3 w-3" />}
                      {getCategoryLabel(job.category)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{job.printType}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Upload Areas */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Front Design */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${job.frontDesign ? 'border-green-500 bg-green-500/5' : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, job.id, 'front')}
                    >
                      {job.frontDesign ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="text-[10px] text-muted-foreground truncate w-full">
                            {job.frontDesign}
                          </span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-1">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Front</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(job.id, 'front', e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>

                    {/* Back Design */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${job.backDesign ? 'border-green-500 bg-green-500/5' : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, job.id, 'back')}
                    >
                      {job.backDesign ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="text-[10px] text-muted-foreground truncate w-full">
                            {job.backDesign}
                          </span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-1">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Back</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(job.id, 'back', e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setReleaseModal({ open: true, jobId: job.id })}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Release
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleComplete(job.id)}
                    disabled={!job.frontDesign}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Overdue Alert Modal */}
      <Dialog open={!!overdueJob} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Job Overdue!
            </DialogTitle>
            <DialogDescription>
              Job <strong>{overdueJob?.id}</strong> has been in your workbench for over 2 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
              <div>
                <p className="font-medium">{overdueJob?.dealer}</p>
                <p className="text-sm text-muted-foreground">{overdueJob?.printType}</p>
              </div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={acknowledgeOverdue}>
              I'll Handle It Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Reason Modal */}
      <Dialog open={releaseModal.open} onOpenChange={(open) => setReleaseModal({ open, jobId: open ? releaseModal.jobId : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Release Job</DialogTitle>
            <DialogDescription>
              Please provide a reason for releasing this job.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              placeholder="e.g., Missing customer details..."
              className="mt-2"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReleaseModal({ open: false, jobId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRelease} disabled={!releaseReason.trim()}>
              <Trash2 className="h-4 w-4 mr-1" />
              Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignerMyWork;
