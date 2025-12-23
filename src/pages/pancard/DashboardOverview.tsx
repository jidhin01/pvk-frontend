import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdCard, Clock, CheckCircle, Printer, AlertTriangle } from 'lucide-react';

const DashboardOverview = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">PAN Card Dashboard</h1>
                <p className="text-muted-foreground">Overview of all PAN card applications.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Normal PAN</CardTitle>
                        <IdCard className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">Pending applications</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emergency PAN</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">8</div>
                        <p className="text-xs text-muted-foreground">Urgent - Priority</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ready for Print</CardTitle>
                        <Printer className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">12</div>
                        <p className="text-xs text-muted-foreground">Awaiting printer</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">23</div>
                        <p className="text-xs text-muted-foreground">Successfully processed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Applications */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Emergency PAN - #PAN2341</p>
                                    <p className="text-xs text-muted-foreground">Applicant: Rajesh Kumar • Aadhaar Uploaded</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Urgent</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <IdCard className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Normal PAN - #PAN2340</p>
                                    <p className="text-xs text-muted-foreground">Applicant: Priya Sharma • Documents Complete</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Normal</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Completed - #PAN2339</p>
                                    <p className="text-xs text-muted-foreground">Applicant: Amit Patel • Sent to Printer</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Done</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;
