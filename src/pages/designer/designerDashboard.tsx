import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import DesignerWorkPool from './designerWorkPool';
import DesignerMyWork from './designerMyWork';
import DesignerEarnings from './designerEarnings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers,
  Lock,
  Wallet,
  CreditCard,
  FileImage,
  CheckCircle
} from 'lucide-react';

type DesignerType = 'normal' | 'pvc';

// Mock data
const MOCK_DATA = {
  normal: {
    poolJobs: 3,
    activeJobs: 1,
    completedToday: 8,
    categories: ['Posters', 'Brochures', 'Price Tags']
  },
  pvc: {
    poolJobs: 2,
    activeJobs: 0,
    completedToday: 4,
    categories: ['PVC Cards']
  }
};

interface DashboardContentProps {
  designerType: DesignerType;
}

const DesignerDashboardContent = ({ designerType }: DashboardContentProps) => {
  const data = MOCK_DATA[designerType];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {designerType === 'pvc' ? 'PVC Card Designer' : 'Normal Designer'} - Overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {/* Pool Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Pool</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.poolJobs}</div>
            <p className="text-xs text-muted-foreground">Available jobs</p>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeJobs}</div>
            <p className="text-xs text-muted-foreground">In workbench</p>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.completedToday}</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Categories */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Your Work Categories</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {designerType === 'pvc' ? 'PVC Card designs only' : 'General design work'}
            </p>
          </div>
          <div className="flex gap-1.5">
            {data.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {designerType === 'pvc' ? <CreditCard className="h-3 w-3 mr-1" /> : <FileImage className="h-3 w-3 mr-1" />}
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Work Pool</p>
              <p className="text-xs text-muted-foreground">{data.poolJobs} jobs waiting</p>
            </div>
          </div>
          <Badge variant="secondary">Pick Jobs</Badge>
        </Card>

        <Card className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Lock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-sm">My Workbench</p>
              <p className="text-xs text-muted-foreground">{data.activeJobs} active</p>
            </div>
          </div>
          <Badge variant="outline">Continue</Badge>
        </Card>
      </div>
    </div>
  );
};

const DesignerDashboard = () => {
  // Designer type: 'normal' (posters, brochures, etc.) or 'pvc' (PVC cards)
  const [designerType, setDesignerType] = useState<DesignerType>('normal');

  return (
    <DashboardLayout>
      {({ activeTab }) => (
        <div className="space-y-4">
          {/* Designer Type Toggle - Prominent */}
          <div className="flex justify-center">
            <Tabs value={designerType} onValueChange={(v) => setDesignerType(v as DesignerType)}>
              <TabsList className="h-12 p-1 gap-1">
                <TabsTrigger
                  value="normal"
                  className="h-10 px-6 text-sm font-medium gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FileImage className="h-4 w-4" />
                  Normal Designer
                </TabsTrigger>
                <TabsTrigger
                  value="pvc"
                  className="h-10 px-6 text-sm font-medium gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <CreditCard className="h-4 w-4" />
                  PVC Card Designer
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          {(() => {
            switch (activeTab) {
              case 'dashboard':
                return <DesignerDashboardContent designerType={designerType} />;
              case 'work-pool':
                return <DesignerWorkPool designerType={designerType} />;
              case 'my-work':
                return <DesignerMyWork designerType={designerType} />;
              case 'earnings':
                return <DesignerEarnings />;
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
