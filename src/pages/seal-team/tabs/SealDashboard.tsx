import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertCircle, ArrowUpRight, CheckCircle2, Factory, History, Timer } from 'lucide-react';
import { useSealProduction } from '../hooks/useSealProduction';

const MOCK_LAST_7_DAYS = [
    { day: 'Mon', output: 12 },
    { day: 'Tue', output: 19 },
    { day: 'Wed', output: 15 },
    { day: 'Thu', output: 22 },
    { day: 'Fri', output: 28 },
    { day: 'Sat', output: 10 },
    { day: 'Sun', output: 5 },
];

export const SealDashboard = () => {
    const { getPendingBatchInfo, getAssemblyQueue, getCompleted } = useSealProduction();

    const pendingCount = getPendingBatchInfo().length;
    const assemblyCount = getAssemblyQueue().length;
    const todayOutput = getCompleted().length;
    const dailyGoal = 30;
    const outputProgress = (todayOutput / dailyGoal) * 100;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. TOP ROW: PULSE WIDGETS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* Pending Exposure */}
                <Card className={`border-l-4 shadow-sm ${pendingCount > 10 ? 'border-l-red-500 bg-red-50/30' : 'border-l-blue-500'}`}>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Pending Negative
                            <Factory className="h-4 w-4 opacity-50" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingCount > 10 ? '🔴 Bottleneck Alert' : 'Normal Flow'}
                        </p>
                    </CardContent>
                </Card>

                {/* Ready for Mounting */}
                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Mounting Queue
                            <History className="h-4 w-4 opacity-50" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">{assemblyCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting assembly</p>
                    </CardContent>
                </Card>

                {/* Critical Stock */}
                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Stock Alerts
                            <AlertCircle className="h-4 w-4 opacity-50" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold text-amber-600">3 Low</div>
                        <p className="text-xs text-muted-foreground">Polymer, S-842, Ink</p>
                    </CardContent>
                </Card>

                {/* Today's Output */}
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Today's Output
                            <CheckCircle2 className="h-4 w-4 opacity-50" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="flex items-end justify-between mb-1">
                            <div className="text-2xl font-bold">{todayOutput}</div>
                            <span className="text-xs text-muted-foreground">Goal: {dailyGoal}</span>
                        </div>
                        <Progress value={outputProgress} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* 2. MIDDLE ROW: URGENCY & TRENDS */}
            <div className="grid gap-4 md:grid-cols-7">

                {/* URGENT JOBS (4 Cols) */}
                <Card className="md:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">🚨 Urgent Attention Required</CardTitle>
                        <CardDescription>Orders marked as RUSH or delayed &gt; 48h</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* Mock Urgent Items */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">!</Badge>
                                        <div>
                                            <div className="font-semibold text-sm">SEAL-{100 + i}: Urgent Director Seal</div>
                                            <div className="text-xs text-muted-foreground">Due: 2 hours ago • <span className="text-red-500 font-medium">Batching Stage</span></div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 gap-1">
                                        Inspect <ArrowUpRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* PRODUCTION VELOCITY CHART (3 Cols) */}
                <Card className="md:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Production Velocity</CardTitle>
                        <CardDescription>Stamps completed (Last 7 Days)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_LAST_7_DAYS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="output"
                                    fill="#8b5cf6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
