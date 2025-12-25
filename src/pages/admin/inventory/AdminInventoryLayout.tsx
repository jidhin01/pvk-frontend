import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    CheckSquare,
    Database,
    FileBarChart,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, or use standard className
import { DashboardLayout } from '@/components/layout';

const TABS = [
    { id: 'dashboard', label: 'Financial Dashboard', icon: LayoutDashboard, path: '/admin/inventory/dashboard' },
    { id: 'approvals', label: 'Approval Center', icon: CheckSquare, path: '/admin/inventory/approvals' },
    { id: 'masters', label: 'Master Data', icon: Database, path: '/admin/inventory/masters' },
    { id: 'reports', label: 'Advanced Reports', icon: FileBarChart, path: '/admin/inventory/reports' },
];

export default function AdminInventoryLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            {() => (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b pb-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Inventory Control Tower</h1>
                            <p className="text-muted-foreground">Financial oversight and master data management.</p>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto border-b">
                        {TABS.map(tab => {
                            const isActive = location.pathname.startsWith(tab.path);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(tab.path)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-slate-300"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="min-h-[500px] animate-in fade-in duration-300">
                        <Outlet />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
