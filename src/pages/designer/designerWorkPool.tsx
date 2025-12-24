import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Lock, ArrowRight, Star, User, CreditCard, FileImage } from 'lucide-react';
import { toast } from 'sonner';

// Types
type DesignerType = 'normal' | 'pvc';
type JobCategory = 'poster' | 'brochure' | 'price-tag' | 'pvc-card' | 'other';

interface Job {
  id: string;
  dealer: string;
  isFirstTime: boolean;
  category: JobCategory;
  printType: string;
  createdAt: string;
  isLocked?: boolean;
  lockedBy?: string;
}

interface DesignerWorkPoolProps {
  designerType?: DesignerType;
}

// Mock data - 5 pending jobs (mix of First-time and Regular, various categories)
const INITIAL_POOL_JOBS: Job[] = [
  // Normal Designer Jobs
  {
    id: 'JOB-201',
    dealer: 'New Star Graphics',
    isFirstTime: true,
    category: 'poster',
    printType: 'Flex Print',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'JOB-202',
    dealer: 'Fresh Prints Co',
    isFirstTime: true,
    category: 'brochure',
    printType: 'Offset',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'JOB-203',
    dealer: 'Alpha Designs',
    isFirstTime: false,
    category: 'price-tag',
    printType: 'Digital',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  // PVC Card Designer Jobs
  {
    id: 'JOB-204',
    dealer: 'Welcome Traders',
    isFirstTime: true,
    category: 'pvc-card',
    printType: 'PVC Printing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 'JOB-205',
    dealer: 'Beta Corp',
    isFirstTime: false,
    category: 'pvc-card',
    printType: 'PVC Printing',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
];

// Category display helpers
const getCategoryLabel = (category: JobCategory): string => {
  const labels: Record<JobCategory, string> = {
    'poster': 'Poster',
    'brochure': 'Brochure',
    'price-tag': 'Price Tag',
    'pvc-card': 'PVC Card',
    'other': 'Other',
  };
  return labels[category];
};

const getCategoryIcon = (category: JobCategory) => {
  if (category === 'pvc-card') return <CreditCard className="h-3 w-3" />;
  return <FileImage className="h-3 w-3" />;
};

// Store for jobs taken by this user (shared with MyWork)
export const takenJobsStore = {
  jobs: [] as Job[],
  addJob: (job: Job) => {
    takenJobsStore.jobs.push({ ...job, isLocked: true, lockedBy: 'current_user' });
  },
  getJobs: () => takenJobsStore.jobs,
};

const DesignerWorkPool = ({ designerType = 'normal' }: DesignerWorkPoolProps) => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_POOL_JOBS);
  const [filter, setFilter] = useState<'all' | 'first-time' | 'regular'>('all');

  // Filter jobs based on designer type
  const typeFilteredJobs = jobs.filter(job => {
    if (designerType === 'pvc') {
      return job.category === 'pvc-card';
    } else {
      return job.category !== 'pvc-card';
    }
  });

  const handleTakeJob = (job: Job) => {
    setJobs(jobs.filter(j => j.id !== job.id));
    takenJobsStore.addJob(job);
    toast.success(`Job ${job.id} moved to your workbench`, {
      description: `${job.dealer} - ${getCategoryLabel(job.category)}`,
    });
  };

  const getTimeAgo = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m ago`;
  };

  const filteredJobs = typeFilteredJobs.filter(job => {
    if (filter === 'first-time') return job.isFirstTime;
    if (filter === 'regular') return !job.isFirstTime;
    return true;
  });

  const firstTimeCount = typeFilteredJobs.filter(j => j.isFirstTime).length;
  const regularCount = typeFilteredJobs.filter(j => !j.isFirstTime).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Pool</h2>
          <p className="text-sm text-muted-foreground">
            {designerType === 'pvc' ? 'PVC Card jobs available' : 'Poster, Brochure & Price Tag jobs'}
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-sm px-3 py-1">
          {typeFilteredJobs.length} Jobs Available
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All ({typeFilteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="first-time" className="text-xs sm:text-sm">
            <Star className="h-3 w-3 mr-1" />
            First-time ({firstTimeCount})
          </TabsTrigger>
          <TabsTrigger value="regular" className="text-xs sm:text-sm">
            Regular ({regularCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No jobs available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`relative overflow-hidden transition-all hover:shadow-md ${job.isFirstTime ? 'ring-1 ring-primary/30' : ''
                }`}
            >
              {/* Priority Badge */}
              {job.isFirstTime && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-primary text-[10px] px-2">
                    <Star className="h-2.5 w-2.5 mr-1" />
                    NEW
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-2 pt-3 px-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold truncate">
                      {job.id}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{job.dealer}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-3 pb-3 space-y-3">
                {/* Job Category & Print Type */}
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 gap-1">
                    {getCategoryIcon(job.category)}
                    {getCategoryLabel(job.category)}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {job.printType}
                  </Badge>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeAgo(job.createdAt)}</span>
                </div>

                {/* Action */}
                <Button
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={() => handleTakeJob(job)}
                >
                  Take Job
                  <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignerWorkPool;
