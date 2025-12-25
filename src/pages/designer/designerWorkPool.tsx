import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  ArrowRight,
  Star,
  User,
  CreditCard,
  FileImage,
  Search,
  AlertCircle,
  Layers,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { DesignerType } from '@/contexts/AuthContext';

// Types
type JobCategory = 'poster' | 'brochure' | 'price-tag' | 'pvc-card' | 'flex-banner' | 'id-card';

interface Job {
  id: string;
  dealer: string;
  dealerPhone: string;
  isFirstTime: boolean;
  category: JobCategory;
  printType: string;
  quantity: number;
  size: string;
  createdAt: string;
  priority: 'normal' | 'urgent';
  notes?: string;
}

interface DesignerWorkPoolProps {
  designerType?: DesignerType;
}

// Extended Mock data with comprehensive examples
const INITIAL_POOL_JOBS: Job[] = [
  // Normal Designer Jobs
  {
    id: 'JOB-301',
    dealer: 'Star Graphics',
    dealerPhone: '+91 98765 43210',
    isFirstTime: true,
    category: 'poster',
    printType: 'Flex Print',
    quantity: 50,
    size: '24x36 inches',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    priority: 'urgent',
    notes: 'Wedding banner - need premium finish'
  },
  {
    id: 'JOB-302',
    dealer: 'Fresh Prints Co',
    dealerPhone: '+91 98765 43211',
    isFirstTime: true,
    category: 'brochure',
    printType: 'Offset',
    quantity: 500,
    size: 'A4 Tri-fold',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    priority: 'normal'
  },
  {
    id: 'JOB-303',
    dealer: 'Metro Advertising',
    dealerPhone: '+91 98765 43212',
    isFirstTime: false,
    category: 'price-tag',
    printType: 'Digital',
    quantity: 200,
    size: '3x5 inches',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    priority: 'normal'
  },
  {
    id: 'JOB-304',
    dealer: 'Alpha Designs',
    dealerPhone: '+91 98765 43213',
    isFirstTime: false,
    category: 'flex-banner',
    printType: 'Flex Print',
    quantity: 10,
    size: '6x4 feet',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    priority: 'urgent',
    notes: 'Shop inauguration - needed by tomorrow'
  },
  {
    id: 'JOB-305',
    dealer: 'Quick Print Hub',
    dealerPhone: '+91 98765 43214',
    isFirstTime: false,
    category: 'poster',
    printType: 'Digital',
    quantity: 100,
    size: '18x24 inches',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    priority: 'normal'
  },
  // PVC Card Designer Jobs
  {
    id: 'JOB-401',
    dealer: 'ID Solutions',
    dealerPhone: '+91 98765 43215',
    isFirstTime: true,
    category: 'pvc-card',
    printType: 'PVC Printing',
    quantity: 100,
    size: 'Standard Card',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    priority: 'urgent',
    notes: 'Company ID cards - logo provided'
  },
  {
    id: 'JOB-402',
    dealer: 'Card Pro',
    dealerPhone: '+91 98765 43216',
    isFirstTime: false,
    category: 'pvc-card',
    printType: 'PVC Printing',
    quantity: 50,
    size: 'Standard Card',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    priority: 'normal'
  },
  {
    id: 'JOB-403',
    dealer: 'Elite Cards',
    dealerPhone: '+91 98765 43217',
    isFirstTime: true,
    category: 'id-card',
    printType: 'PVC Printing',
    quantity: 200,
    size: 'Standard Card',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    priority: 'normal',
    notes: 'School ID cards - both sides'
  },
];

// Category display helpers
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
  if (category === 'pvc-card' || category === 'id-card') return <CreditCard className="h-3.5 w-3.5" />;
  return <FileImage className="h-3.5 w-3.5" />;
};

// Store for jobs taken by this user (shared with MyWork)
export const takenJobsStore = {
  jobs: [] as Job[],
  addJob: (job: Job) => {
    takenJobsStore.jobs.push({ ...job });
  },
  getJobs: () => takenJobsStore.jobs,
};

const DesignerWorkPool = ({ designerType = 'normal' }: DesignerWorkPoolProps) => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_POOL_JOBS);
  const [filter, setFilter] = useState<'all' | 'first-time' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isPVC = designerType === 'pvc';

  // Filter jobs based on designer type
  const typeFilteredJobs = jobs.filter(job => {
    if (designerType === 'pvc') {
      return job.category === 'pvc-card' || job.category === 'id-card';
    } else {
      return job.category !== 'pvc-card' && job.category !== 'id-card';
    }
  });

  // Apply search filter
  const searchFilteredJobs = typeFilteredJobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.id.toLowerCase().includes(query) ||
      job.dealer.toLowerCase().includes(query) ||
      getCategoryLabel(job.category).toLowerCase().includes(query)
    );
  });

  // Apply tab filter
  const filteredJobs = searchFilteredJobs.filter(job => {
    if (filter === 'first-time') return job.isFirstTime;
    if (filter === 'urgent') return job.priority === 'urgent';
    return true;
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
    const hours = Math.floor(diffMins / 60);
    if (hours < 24) return `${hours}h ${diffMins % 60}m ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const firstTimeCount = typeFilteredJobs.filter(j => j.isFirstTime).length;
  const urgentCount = typeFilteredJobs.filter(j => j.priority === 'urgent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Work Pool</h1>
          <p className="text-muted-foreground">
            {isPVC ? 'PVC & ID Card jobs available' : 'Print design jobs available'}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`px-3 py-1.5 text-sm font-medium ${isPVC
              ? 'border-purple-300 bg-purple-50 text-purple-700'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}
        >
          {isPVC ? <CreditCard className="h-4 w-4 mr-2" /> : <FileImage className="h-4 w-4 mr-2" />}
          {typeFilteredJobs.length} Jobs Available
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job ID, dealer, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">
              All ({typeFilteredJobs.length})
            </TabsTrigger>
            <TabsTrigger value="first-time">
              <Star className="h-3.5 w-3.5 mr-1" />
              New ({firstTimeCount})
            </TabsTrigger>
            <TabsTrigger value="urgent">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Urgent ({urgentCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${isPVC ? 'bg-purple-100' : 'bg-emerald-100'
                      }`}>
                      {getCategoryIcon(job.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{job.id}</span>
                        {job.isFirstTime && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            <Star className="h-3 w-3 mr-0.5" />
                            New Client
                          </Badge>
                        )}
                        {job.priority === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{job.dealer}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{job.dealerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(job.category)}
                        </Badge>
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

                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(job.createdAt)}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTakeJob(job)}
                      className={isPVC ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'}
                    >
                      Take Job
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Attention Alert */}
      {urgentCount > 0 && filter !== 'urgent' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-orange-800">Urgent jobs waiting!</p>
              <p className="text-sm text-orange-600">
                {urgentCount} urgent job(s) need immediate attention.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('urgent')}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              View Urgent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DesignerWorkPool;
