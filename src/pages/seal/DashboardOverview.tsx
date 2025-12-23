import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stamp, Clock, CheckCircle, Activity } from 'lucide-react';

const DashboardOverview = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Seal Team Dashboard</h1>
                <p className="text-muted-foreground">Overview of all seal and stamp orders.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Orders</CardTitle>
                        <Stamp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">6</div>
                        <p className="text-xs text-muted-foreground">Currently in production</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">14</div>
                        <p className="text-xs text-muted-foreground">Ready for delivery</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.5h</div>
                        <p className="text-xs text-muted-foreground">Per order completion</p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Type Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Self-Ink Seals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-xs text-muted-foreground">Pending orders</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Stamp className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Normal Seals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">6</p>
                                <p className="text-xs text-muted-foreground">Pending orders</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Stamp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Stamp className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Self-Ink Seal #SL2341</p>
                                    <p className="text-xs text-muted-foreground">Client: ABC Corp • Malayalam</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">New</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Normal Seal #SL2340</p>
                                    <p className="text-xs text-muted-foreground">Client: XYZ Enterprises • English</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Processing</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Self-Ink Seal #SL2339</p>
                                    <p className="text-xs text-muted-foreground">Client: Legal Associates • English</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;
