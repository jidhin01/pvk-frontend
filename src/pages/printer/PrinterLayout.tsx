import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PrinterQueue from './PrinterQueue';
import PrinterHistory from './PrinterHistory';
import PrinterRejections from './PrinterRejections';
import DashboardOverview from './DashboardOverview';
import HandoverQueue from './HandoverQueue';
import { Printer } from 'lucide-react';
import { MOCK_PRINTER_JOBS, PrinterJob } from '@/data/mockPrinterData';
import { toast } from 'sonner';

export default function PrinterLayout() {
    const [jobs, setJobs] = useState<PrinterJob[]>(MOCK_PRINTER_JOBS);

    const handleJobUpdate = (jobId: string, updates: Partial<PrinterJob>) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j) as PrinterJob[]);
    };

    return (
        <DashboardLayout>
            {({ activeTab }) => {
                return (
                    <div className="space-y-6">
                        <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Printer Console</h1>
                                <p className="text-sm md:text-base text-muted-foreground">Manage your print queue and job status.</p>
                            </div>
                            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Printer className="h-5 w-5" />
                                    <span className="font-semibold">Machine V-200</span>
                                </div>
                                <span className="md:hidden text-xs font-medium uppercase tracking-wider bg-background/50 px-2 py-0.5 rounded text-foreground">Online</span>
                            </div>
                        </header>

                        <div>
                            {/* Render Main Content */}
                            {activeTab === 'overview' && <DashboardOverview jobs={jobs} />}
                            {activeTab === 'dashboard' && <PrinterQueue jobs={jobs} onUpdateJob={handleJobUpdate} />}
                            {activeTab === 'handover' && <HandoverQueue jobs={jobs} onUpdateJob={handleJobUpdate} />}
                            {activeTab === 'history' && <PrinterHistory />}
                            {activeTab === 'rejected' && <PrinterRejections />}

                            {!['overview', 'dashboard', 'handover', 'history', 'rejected'].includes(activeTab) && (
                                <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                                    Feature coming soon: {activeTab}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
        </DashboardLayout>
    );
}
