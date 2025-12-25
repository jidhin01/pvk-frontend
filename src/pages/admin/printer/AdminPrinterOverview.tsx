import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Printer, Users, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { MOCK_PRINTER_TEAMS, MOCK_PRINTER_JOBS } from '@/data/mockPrinterData';

export default function AdminPrinterOverview() {
    // Calculate aggregate metrics
    const totalJobs = MOCK_PRINTER_JOBS.filter(j => ['ready_for_print', 'printing'].includes(j.status)).length;
    const activeTeams = MOCK_PRINTER_TEAMS.filter(t => t.status === 'active').length;
    const overloadedTeams = MOCK_PRINTER_TEAMS.filter(t => t.status === 'overloaded').length;

    // Calculate today's total output across all teams
    const totalOutput = MOCK_PRINTER_TEAMS.reduce((acc, team) => acc + team.completedToday, 0);
    const avgPerformance = Math.round(
        MOCK_PRINTER_TEAMS.reduce((acc, team) => acc + team.performance, 0) / MOCK_PRINTER_TEAMS.length
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Printing Operations Overview</h2>

            {/* Job Lifecycle Pipeline */}
            <Card className="bg-muted/50">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        {/* Stage 1: Queue */}
                        <div className="flex flex-col items-center space-y-2 relative md:after:content-['→'] md:after:absolute md:after:right-[-1rem] md:after:top-1/2 md:after:-translate-y-1/2 md:after:text-muted-foreground md:after:text-xl last:after:content-none">
                            <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                <Printer className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{MOCK_PRINTER_JOBS.filter(j => j.status === 'ready_for_print').length}</div>
                                <div className="text-sm font-medium text-muted-foreground">In Queue</div>
                                <div className="text-xs text-muted-foreground mt-1">Orders Placed</div>
                            </div>
                        </div>

                        {/* Stage 2: Processing */}
                        <div className="flex flex-col items-center space-y-2 relative md:after:content-['→'] md:after:absolute md:after:right-[-1rem] md:after:top-1/2 md:after:-translate-y-1/2 md:after:text-muted-foreground md:after:text-xl last:after:content-none">
                            <div className="p-3 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full animate-pulse">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{MOCK_PRINTER_JOBS.filter(j => j.status === 'printing').length}</div>
                                <div className="text-sm font-medium text-muted-foreground">Processing</div>
                                <div className="text-xs text-muted-foreground mt-1">Accepted & Printing</div>
                            </div>
                        </div>

                        {/* Stage 3: Completed */}
                        <div className="flex flex-col items-center space-y-2 relative md:after:content-['→'] md:after:absolute md:after:right-[-1rem] md:after:top-1/2 md:after:-translate-y-1/2 md:after:text-muted-foreground md:after:text-xl last:after:content-none">
                            <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{MOCK_PRINTER_JOBS.filter(j => j.status === 'completed').length}</div>
                                <div className="text-sm font-medium text-muted-foreground">Completed</div>
                                <div className="text-xs text-muted-foreground mt-1">Ready for Handover</div>
                            </div>
                        </div>

                        {/* Stage 4: Dispatched/Handed Over */}
                        <div className="flex flex-col items-center space-y-2">
                            {/* Note: MOCK_PRINTER_JOBS might normally filter out handed_over in a real 'active' list, but assuming it keeps history for this view */}
                            <div className="p-3 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{MOCK_PRINTER_JOBS.filter(j => j.status === 'handed_over').length}</div>
                                <div className="text-sm font-medium text-muted-foreground">Dispatched</div>
                                <div className="text-xs text-muted-foreground mt-1">Handed to Line Staff</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending Volume</CardTitle>
                        <Printer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalJobs}</div>
                        <p className="text-xs text-muted-foreground">Jobs waiting across all teams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeTeams}</div>
                        <p className="text-xs text-muted-foreground">
                            {overloadedTeams > 0 ? (
                                <span className="text-destructive font-medium flex items-center">
                                    <AlertTriangle className="h-3 w-3 mr-1" /> {overloadedTeams} Overloaded
                                </span>
                            ) : (
                                "All teams running smoothly"
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global Output (Today)</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOutput}</div>
                        <p className="text-xs text-muted-foreground">prints completed today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgPerformance}%</div>
                        <p className="text-xs text-muted-foreground">Avg performance score</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Insights Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Team Utilization</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center border-dashed border-2 rounded-md bg-muted/10 text-muted-foreground">
                            Chart: Daily Print Volume by Team
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Alerts & Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {overloadedTeams > 0 ? (
                                <div className="flex items-start gap-4 p-3 bg-red-50 text-red-900 rounded-lg dark:bg-red-900/20 dark:text-red-200">
                                    <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-sm">Critical Load Detected</h4>
                                        <p className="text-xs mt-1">Annex Batching Unit is at 120% capacity. Consider reassigning jobs.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">No critical operational issues.</span>
                                </div>
                            )}

                            <div className="flex items-start gap-4 p-3 border rounded-lg">
                                <Clock className="h-5 w-5 mt-0.5 text-blue-500 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-sm">Approaching Deadlines</h4>
                                    <p className="text-xs text-muted-foreground mt-1">3 Offset jobs are due today. Verify status.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}