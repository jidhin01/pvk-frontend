import React from 'react';
import { MoreHorizontal, FileText, UserPlus, ShoppingCart, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'user' | 'document' | 'approval';
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'New order received',
    description: 'Order #12345 from Dealer ABC',
    time: '2 min ago',
    type: 'order',
  },
  {
    id: '2',
    title: 'User registered',
    description: 'John Doe joined as Designer',
    time: '15 min ago',
    type: 'user',
  },
  {
    id: '3',
    title: 'Document uploaded',
    description: 'PAN verification for Dealer XYZ',
    time: '1 hour ago',
    type: 'document',
  },
  {
    id: '4',
    title: 'Order approved',
    description: 'Order #12340 approved by Manager',
    time: '2 hours ago',
    type: 'approval',
  },
  {
    id: '5',
    title: 'New order received',
    description: 'Order #12344 from Dealer LMN',
    time: '3 hours ago',
    type: 'order',
  },
];

const typeIcons: Record<Activity['type'], LucideIcon> = {
  order: ShoppingCart,
  user: UserPlus,
  document: FileText,
  approval: CheckCircle,
};

const typeColors: Record<Activity['type'], string> = {
  order: 'bg-primary/10 text-primary',
  user: 'bg-success/10 text-success',
  document: 'bg-warning/10 text-warning',
  approval: 'bg-accent/10 text-accent',
};

export function ActivityList() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => {
          const Icon = typeIcons[activity.type];
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                typeColors[activity.type]
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
            </div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/5">
        View all activity
      </Button>
    </Card>
  );
}
