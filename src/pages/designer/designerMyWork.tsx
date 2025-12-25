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
  CreditCard,
  User,
  Eye,
  RotateCcw,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { DesignerType } from '@/contexts/AuthContext';

type JobCategory = 'poster' | 'brochure' | 'price-tag' | 'pvc-card' | 'flex-banner' | 'id-card';

interface ActiveJob {
  id: string;
  dealer: string;
  dealerPhone: string;
  category: JobCategory;
  printType: string;
  quantity: number;
  size: string;
  assignedAt: string;
  frontDesign?: string;
  backDesign?: string;
  notes?: string;
}

interface DesignerMyWorkProps {
  designerType?: DesignerType;
}

// Extended mock data with more jobs
const getInitialJobs = (): ActiveJob[] => [
  {
    id: 'JOB-199',
    dealer: 'Omega Traders',
    dealerPhone: '+91 98765 43200',
    category: 'poster',
    printType: 'Flex Print',
    quantity: 25,
    size: '24x36 inches',
    assignedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    notes: 'Wedding invitation poster'
  },
  {
    id: 'JOB-198',
    dealer: 'Beta Prints',
    dealerPhone: '+91 98765 43201',
    category: 'brochure',
    printType: 'Offset',
    quantity: 200,
    size: 'A4 Tri-fold',
    assignedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
];

const BATCH_SIZE = 5;

const getCategoryLabel = (category: JobCategory): string => {
  const labels: Record<JobCategory, string> = {
    'poster': 'Poster',
    'brochure': 'Brochure',
    'price-tag': 'Price Tag',
    'pvc-card': 'PVC Card',
    'flex-banner': 'Flex Banner',
    'id-card': 'ID Card',
  };
  return labels[category];
};

const getCategoryIcon = (category: JobCategory) => {
  if (category === 'pvc-card' || category === 'id-card') return <CreditCard className="h-4 w-4" />;
  return <FileImage className="h-4 w-4" />;
};

const DesignerMyWork = ({ designerType = 'normal' }: DesignerMyWorkProps) => {
  const [jobs, setJobs] = useState<ActiveJob[]>(getInitialJobs);
  const [completedCount, setCompletedCount] = useState(3); // Start with some completed
  const [overdueJob, setOverdueJob] = useState<ActiveJob | null>(null);
  const [releaseModal, setReleaseModal] = useState<{ open: boolean; jobId: string | null }>({ open: false, jobId: null });
  const [previewModal, setPreviewModal] = useState<{ open: boolean; job: ActiveJob | null }>({ open: false, job: null });
  const [releaseReason, setReleaseReason] = useState('');
  const [, setTick] = useState(0);

  const isPVC = designerType === 'pvc';

  // Filter jobs based on designer type
  const filteredJobs = jobs.filter(job => {
    if (designerType === 'pvc') return job.category === 'pvc-card' || job.category === 'id-card';
    return job.category !== 'pvc-card' && job.category !== 'id-card';
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
    const newCount = completedCount + 1;
    toast.success(`Job ${jobId} completed! +₹5 earned`, {
      description: newCount % BATCH_SIZE === 0
        ? '🎉 Batch ready for print!'
        : `${BATCH_SIZE - (newCount % BATCH_SIZE)} more to complete batch`
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Workbench</h1>
          <p className="text-muted-foreground">
            {isPVC ? 'Your active PVC & ID card jobs' : 'Your active design jobs'}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`px-3 py-1.5 text-sm font-medium ${isPVC
              ? 'border-purple-300 bg-purple-50 text-purple-700'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}
        >
          <Lock className="h-4 w-4 mr-2" />
          {filteredJobs.length} Active Jobs
        </Badge>
      </div>

      {/* Batch Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Batch Progress</span>
            <span className="text-sm font-normal text-muted-foreground">
              {completedCount % BATCH_SIZE}/{BATCH_SIZE} designs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={batchProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Complete {BATCH_SIZE} designs to auto-batch for print. You've earned ₹{completedCount * 5} today.
          </p>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active jobs in your workbench.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Go to Work Pool to pick up new tasks.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const elapsed = getElapsedTime(job.assignedAt);
            const isOverdue = elapsed.hours >= 2;
            const isNearDeadline = elapsed.isNearDeadline;

            return (
              <Card
                key={job.id}
                className={`overflow-hidden ${isOverdue
                  ? 'ring-2 ring-destructive'
                  : isNearDeadline
                    ? 'ring-2 ring-orange-400'
                    : ''
                  }`}
              >
                <div className="p-4">
                  {/* Job Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${isPVC ? 'bg-purple-100' : 'bg-emerald-100'
                        }`}>
                        {getCategoryIcon(job.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{job.id}</span>
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(job.category)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{job.dealer}</span>
                          <span>•</span>
                          <span>{job.dealerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {job.printType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Qty: {job.quantity}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {job.size}
                          </Badge>
                        </div>
                        {job.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            "{job.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${isOverdue
                      ? 'bg-destructive/10 text-destructive'
                      : isNearDeadline
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                      <Clock className="h-3 w-3" />
                      {elapsed.hours}h {elapsed.mins}m
                      {isOverdue && <AlertTriangle className="h-3 w-3" />}
                    </div>
                  </div>

                  {/* Upload Areas */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Front Design */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${job.frontDesign
                        ? 'border-green-400 bg-green-50'
                        : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, job.id, 'front')}
                    >
                      {job.frontDesign ? (
                        <div className="flex flex-col items-center gap-2">
                          <Check className="h-6 w-6 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Front Uploaded</span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {job.frontDesign}
                          </span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm font-medium">Upload Front</span>
                          <span className="text-xs text-muted-foreground">Drop or click</span>
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
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${job.backDesign
                        ? 'border-green-400 bg-green-50'
                        : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, job.id, 'back')}
                    >
                      {job.backDesign ? (
                        <div className="flex flex-col items-center gap-2">
                          <Check className="h-6 w-6 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Back Uploaded</span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {job.backDesign}
                          </span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm font-medium">Upload Back</span>
                          <span className="text-xs text-muted-foreground">Optional</span>
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

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewModal({ open: true, job })}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setReleaseModal({ open: true, jobId: job.id })}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Release
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleComplete(job.id)}
                      disabled={!job.frontDesign}
                      className={isPVC ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Complete (+₹5)
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Overdue Alert Modal */}
      <Dialog open={!!overdueJob} onOpenChange={() => { }}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Job Overdue!
            </DialogTitle>
            <DialogDescription>
              Job <strong>{overdueJob?.id}</strong> has been in your workbench for over 2 hours.
              Please complete it soon or release it back to the pool.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="font-medium">{overdueJob?.dealer}</p>
              <p className="text-sm text-muted-foreground">
                {overdueJob?.category && getCategoryLabel(overdueJob.category)} • {overdueJob?.printType}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={acknowledgeOverdue} className="w-full">
              I'll Handle It Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewModal.open} onOpenChange={(open) => setPreviewModal({ open, job: open ? previewModal.job : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Preview - {previewModal.job?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Dealer</p>
                <p className="font-medium">{previewModal.job?.dealer}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{previewModal.job?.dealerPhone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{previewModal.job?.category && getCategoryLabel(previewModal.job.category)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Print Type</p>
                <p className="font-medium">{previewModal.job?.printType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">{previewModal.job?.quantity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{previewModal.job?.size}</p>
              </div>
            </div>
            {previewModal.job?.notes && (
              <div>
                <p className="text-muted-foreground text-sm">Notes</p>
                <p className="font-medium italic">"{previewModal.job.notes}"</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewModal({ open: false, job: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Reason Modal */}
      <Dialog open={releaseModal.open} onOpenChange={(open) => setReleaseModal({ open, jobId: open ? releaseModal.jobId : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Job</DialogTitle>
            <DialogDescription>
              This will return the job to the pool for other designers. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Reason for release</Label>
            <Textarea
              id="reason"
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              placeholder="e.g., Missing customer details, unclear requirements..."
              className="mt-2"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReleaseModal({ open: false, jobId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRelease} disabled={!releaseReason.trim()}>
              <Trash2 className="h-4 w-4 mr-1" />
              Release Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignerMyWork;
