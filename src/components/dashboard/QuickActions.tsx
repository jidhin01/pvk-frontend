import React from 'react';
import { Plus, Upload, FileText, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  variant: 'primary' | 'secondary' | 'outline';
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'new-order', label: 'New Order', icon: Plus, variant: 'primary' },
  { id: 'upload', label: 'Upload File', icon: Upload, variant: 'secondary' },
  { id: 'reports', label: 'View Reports', icon: FileText, variant: 'outline' },
  { id: 'users', label: 'Manage Users', icon: Users, variant: 'outline' },
];

export function QuickActions() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
        <Button variant="link" className="text-primary p-0 h-auto font-medium">
          See all <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Button
            key={action.id}
            variant={action.variant === 'primary' ? 'default' : action.variant === 'secondary' ? 'secondary' : 'outline'}
            className={cn(
              "h-auto py-4 flex-col gap-2",
              action.variant === 'primary' && "bg-primary hover:bg-primary/90",
              action.variant === 'secondary' && "bg-secondary hover:bg-secondary/80"
            )}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
