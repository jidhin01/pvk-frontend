
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Check, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

// Mock active jobs
const INITIAL_MY_JOBS = [
  { id: 'JOB-099', dealer: 'Omega Traders', status: 'In Progress', type: 'Finished Goods', assignedAt: new Date().toISOString() },
  { id: 'JOB-098', dealer: 'Zeta Prints', status: 'In Progress', type: 'Unfinished Goods', assignedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

const DesignerMyWork = () => {
  const [jobs, setJobs] = useState(INITIAL_MY_JOBS);

  const handleReleaseJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.info(`Job ${id} released back to pool`);
  };

  const handleUpload = (id: string) => {
    toast.success(`Design uploaded for ${id}`);
    // Logic to update status would go here
  };

  const handleMarkReady = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success(`Job ${id} marked as Ready for Print`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Workspace</h2>
        <p className="text-muted-foreground">Manage your active design jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{job.id}</CardTitle>
                <Badge variant={job.status === 'In Progress' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{job.dealer}</p>
              <p className="text-xs text-muted-foreground">{job.type}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`upload-${job.id}`}>Upload Design</Label>
                <div className="flex items-center gap-2">
                  <Input id={`upload-${job.id}`} type="file" className="text-xs" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReleaseJob(job.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" /> Release
              </Button>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleUpload(job.id)}>
                  <Upload className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => handleMarkReady(job.id)}>
                  <Check className="h-4 w-4 mr-1" /> Ready
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No active jobs</h3>
          <p className="text-muted-foreground">Go to the Work Pool to pick up new tasks.</p>
        </div>
      )}
    </div>
  );
};

export default DesignerMyWork;
