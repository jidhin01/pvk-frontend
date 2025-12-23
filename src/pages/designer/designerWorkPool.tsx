
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for initial work pool
const INITIAL_JOBS = [
  { id: 'JOB-101', dealer: 'Alpha Graphics', type: 'Finished Goods', printType: 'PVC Printing', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() }, // 30 mins ago
  { id: 'JOB-102', dealer: 'Beta Designs', type: 'Unfinished Goods', printType: 'Laser Print', createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString() }, // 2.5 hours ago (Attention needed)
  { id: 'JOB-103', dealer: 'Gamma Prints', type: 'Finished Goods', printType: 'Offset', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'JOB-104', dealer: 'Delta Corp', type: 'Unfinished Goods', printType: 'PVC Printing', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() }, // 3 hours ago
];

const DesignerWorkPool = () => {
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  const handleTakeJob = (jobId: string) => {
    // In a real app, this would call an API
    setJobs(jobs.filter(job => job.id !== jobId));
    toast.success(`Job ${jobId} moved to your workspace`);
  };

  const isAttentionNeeded = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return diffInHours > 2;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Work Pool</h2>
          <p className="text-muted-foreground">Available jobs waiting for design</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {jobs.length} Available
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Dealer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Print Type</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No jobs available in the pool right now.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.dealer}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.printType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAttentionNeeded(job.createdAt) && (
                        <Badge variant="destructive" className="flex w-fit items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Attention
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleTakeJob(job.id)}>
                        Take Job <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignerWorkPool;
