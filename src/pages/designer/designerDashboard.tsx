import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DesignerWorkPool from './designerWorkPool';
import DesignerMyWork from './designerMyWork';
import DesignerCompleted from './designerCompleted';
import DesignerEarnings from './designerEarnings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, DesignerType } from '@/contexts/AuthContext';
import {
  Layers,
  Lock,
  CreditCard,
  FileImage,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Star,
  ArrowRight,
  Wallet
} from 'lucide-react';

// Extended Mock data with more examples
const MOCK_DATA = {
  normal: {
    poolJobs: 5,
    activeJobs: 2,
    completedToday: 12,
    completedWeek: 58,
    pendingReview: 1,
    earnings: 290,
    categories: ['Posters', 'Brochures', 'Price Tags', 'Flex Banners'],
    recentJobs: [
      { id: 'JOB-301', dealer: 'Star Graphics', category: 'Poster', time: '5m ago', urgent: true },
      { id: 'JOB-302', dealer: 'Alpha Print', category: 'Brochure', time: '15m ago', urgent: false },
      { id: 'JOB-303', dealer: 'Metro Ads', category: 'Price Tag', time: '30m ago', urgent: false },
    ]
  },
  pvc: {
    poolJobs: 3,
    activeJobs: 1,
    completedToday: 8,
    completedWeek: 42,
    pendingReview: 0,
    earnings: 210,
    categories: ['PVC Cards', 'ID Cards', 'Membership Cards'],
    recentJobs: [
      { id: 'JOB-401', dealer: 'ID Solutions', category: 'PVC Card', time: '10m ago', urgent: true },
      { id: 'JOB-402', dealer: 'Card Pro', category: 'ID Card', time: '25m ago', urgent: false },
    ]
  }
};

interface DashboardContentProps {
  designerType: DesignerType;
}

const DesignerDashboardContent = ({ designerType }: DashboardContentProps) => {
  const data = MOCK_DATA[designerType];
  const isPVC = designerType === 'pvc';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Designer Dashboard</h1>
          <p className="text-muted-foreground">Your daily overview and pending tasks</p>
        </div>
        <Badge
          variant="outline"
          className={`px-3 py-1.5 text-sm font-medium ${isPVC
            ? 'border-purple-300 bg-purple-50 text-purple-700'
            : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}
        >
          {isPVC ? <CreditCard className="h-4 w-4 mr-2" /> : <FileImage className="h-4 w-4 mr-2" />}
          {isPVC ? 'PVC Card Designer' : 'Normal Designer'}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Work Pool */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Pool</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.poolJobs}</div>
            <p className="text-xs text-muted-foreground">Available to pick</p>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeJobs}</div>
            <p className="text-xs text-muted-foreground">In your workbench</p>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.completedToday}</div>
            <p className="text-xs text-muted-foreground">{data.completedWeek} this week</p>
          </CardContent>
        </Card>

        {/* Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.earnings}</div>
            <p className="text-xs text-muted-foreground">@ ₹5 per design</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Jobs in Pool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Recent Jobs Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No jobs available right now.
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{job.id}</span>
                        {job.urgent && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0">
                            <Star className="h-3 w-3 mr-0.5" />
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{job.dealer}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {job.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {job.time}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-muted-foreground text-sm">Pending Review</p>
                <p className="text-xl font-semibold">{data.pendingReview}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-muted-foreground text-sm">Week Earnings</p>
                <p className="text-xl font-semibold">₹{data.completedWeek * 5}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 col-span-2">
                <p className="text-muted-foreground text-sm">Your Categories</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attention Alert */}
      {data.poolJobs > 3 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-orange-800">Jobs waiting in pool</p>
              <p className="text-sm text-orange-600">
                {data.poolJobs} jobs are available. Pick up work to meet deadlines!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const DesignerDashboard = () => {
  const { user } = useAuth();

  // Get designer type from authenticated user, default to 'normal'
  const designerType: DesignerType = user?.designerType || 'normal';

  return (
    <DashboardLayout>
      {({ activeTab }) => (
        <div className="space-y-4">
          {(() => {
            switch (activeTab) {
              case 'dashboard':
                return <DesignerDashboardContent designerType={designerType} />;
              case 'work-pool':
                return <DesignerWorkPool designerType={designerType} />;
              case 'my-work':
                return <DesignerMyWork designerType={designerType} />;
              case 'completed':
                return <DesignerCompleted designerType={designerType} />;
              case 'earnings':
                return <DesignerEarnings designerType={designerType} />;
              default:
                return <DesignerDashboardContent designerType={designerType} />;
            }
          })()}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DesignerDashboard;
