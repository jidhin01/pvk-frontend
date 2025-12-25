import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    CheckSquare,
    Database,
    FileBarChart,
    Box,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FinancialDashboard from './FinancialDashboard';
import ApprovalCenter from './ApprovalCenter';
import MasterData from './MasterData';
import InventoryReports from './InventoryReports';
import AdminOperations from './AdminOperations';
import InventoryUsers from './InventoryUsers';

const TABS = [
    { id: 'dashboard', label: 'Financial Dashboard', icon: LayoutDashboard },
    { id: 'operations', label: 'Live Operations', icon: Box },
    { id: 'approvals', label: 'Approval Center', icon: CheckSquare },
    { id: 'masters', label: 'Master Data', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Advanced Reports', icon: FileBarChart },
];

export default function InventoryModule() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header / Sub-nav */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Inventory Control Tower</h2>
                        <p className="text-muted-foreground">Financial oversight, approvals, and master data management.</p>
                    </div>
                </div>

                <div className="flex overflow-x-auto border-b">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
            </div>

            {/* Content Area */}
            <div className="flex-1 animate-in fade-in duration-300">
                {activeTab === 'dashboard' && <FinancialDashboard />}
                {activeTab === 'operations' && <AdminOperations />}
                {activeTab === 'approvals' && <ApprovalCenter />}
                {activeTab === 'masters' && <MasterData />}
                {activeTab === 'users' && <InventoryUsers />}
                {activeTab === 'reports' && <InventoryReports />}
            </div>
        </div>
    );
}
