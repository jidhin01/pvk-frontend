import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Clock, CheckCircle, AlertCircle, Users, Package, TrendingUp } from 'lucide-react';
import { MOCK_HISTORY_LOGS, MOCK_REJECTED_LOGS, PrinterJob } from '@/data/mockPrinterData';

interface DashboardOverviewProps {
    jobs: PrinterJob[];
}

const DashboardOverview = ({ jobs }: DashboardOverviewProps) => {
    // Calculate metrics from props
    const pendingJobs = jobs.filter(job =>
        job.status === 'ready_for_print' || job.status === 'printing'
    ).length;

    const today = new Date().toISOString().split('T')[0];
    const completedToday = MOCK_HISTORY_LOGS.filter(log =>
        log.timestamp.startsWith(today) && log.status === 'completed'
    ).length;

    const totalCompleted = MOCK_HISTORY_LOGS.filter(log => log.status === 'completed').length;
    const rejectedCount = MOCK_REJECTED_LOGS.length;

    // Calculate top dealers from completed jobs
    const dealerCompletionMap: Record<string, number> = {};
    MOCK_HISTORY_LOGS.filter(log => log.status === 'completed').forEach(log => {
        // In a real app, this would come from the order data
        // For mock data, we'll just count all jobs
        const dealer = 'PVK Enterprise'; // Placeholder - would come from order
        dealerCompletionMap[dealer] = (dealerCompletionMap[dealer] || 0) + 1;
    });

    const topDealer = Object.entries(dealerCompletionMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No data';

    return (
        <div className="space-y-6">


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingJobs}</div>
                        <p className="text-xs text-muted-foreground">Waiting for print</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Completed</CardTitle>
                        <Printer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedToday}</div>
                        <p className="text-xs text-muted-foreground">Jobs finished today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCompleted}</div>
                        <p className="text-xs text-muted-foreground">Lifetime completed jobs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rejectedCount}</div>
                        <p className="text-xs text-muted-foreground">Jobs rejected regarding issues</p>
                    </CardContent>
                </Card>
            </div>

            {/* Dealer Performance Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performing Dealer</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topDealer}</div>
                        <p className="text-xs text-muted-foreground">Most orders completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Job Distribution</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {jobs.filter(j => j.technology === 'PVC').length} PVC
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {jobs.filter(j => j.technology === 'DIGITAL').length} Digital,
                            {jobs.filter(j => j.technology === 'OFFSET').length} Offset
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Trend */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Performance Trend</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Your productivity is up 12% from last week. Keep up the good work!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;