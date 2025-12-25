import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import {
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    Factory,
    History,
    Timer,
    TrendingUp,
    DollarSign,
    Package,
    Users,
    Zap,
    Clock,
    Layers
} from 'lucide-react';
import { useSealProduction } from '../hooks/useSealProduction';
import { SEAL_TEAM_EARNINGS, SEAL_PRODUCTION_STATS, MOCK_SEAL_ORDERS } from '@/data/mockSealData';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

export const SealDashboard = () => {
    const navigate = useNavigate();
    const { getPendingBatchInfo, getAssemblyQueue, getCompleted } = useSealProduction();

    const pendingCount = getPendingBatchInfo().length;
    const assemblyCount = getAssemblyQueue().length;
    const todayOutput = getCompleted().length;
    const dailyGoal = 30;
    const outputProgress = (todayOutput / dailyGoal) * 100;

    // Get urgent/rush orders
    const urgentOrders = MOCK_SEAL_ORDERS.filter(o => o.isUrgent && o.status !== 'completed');

    // Pie chart data for order types
    const typeData = [
        { name: 'Self-Ink', value: SEAL_TEAM_EARNINGS.byType.SELF_INK.orders, color: '#8b5cf6' },
        { name: 'Wooden', value: SEAL_TEAM_EARNINGS.byType.WOODEN.orders, color: '#f59e0b' },
        { name: 'Pocket', value: SEAL_TEAM_EARNINGS.byType.POCKET.orders, color: '#10b981' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. TOP ROW: KEY METRICS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

                {/* Today's Revenue */}
                <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Today's Revenue
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">₹{SEAL_TEAM_EARNINGS.today.revenue}</div>
                        <p className="text-xs text-muted-foreground">
                            Profit: <span className="font-semibold text-emerald-600">₹{SEAL_TEAM_EARNINGS.today.profit}</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Exposure */}
                <Card className={`border-l-4 shadow-sm ${pendingCount > 10 ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/10' : 'border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10'}`}>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Pending Batch
                            <Factory className="h-4 w-4 opacity-50" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingCount > 10 ? '🔴 Batch Full' : 'Awaiting exposure'}
                        </p>
                    </CardContent>
                </Card>

                {/* Ready for Mounting */}
                <Card className="border-l-4 border-l-orange-500 shadow-sm bg-orange-50/30 dark:bg-orange-950/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Assembly Queue
                            <History className="h-4 w-4 opacity-50" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold text-orange-600">{assemblyCount}</div>
                        <p className="text-xs text-muted-foreground">Ready for mounting</p>
                    </CardContent>
                </Card>

                {/* Critical Stock */}
                <Card className="border-l-4 border-l-amber-500 shadow-sm bg-amber-50/30 dark:bg-amber-950/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Stock Alerts
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold text-amber-600">3 Low</div>
                        <p className="text-xs text-muted-foreground">Polymer, S-842, Ink</p>
                    </CardContent>
                </Card>

                {/* Today's Output */}
                <Card className="border-l-4 border-l-purple-500 shadow-sm bg-purple-50/30 dark:bg-purple-950/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Today's Output
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="flex items-end justify-between mb-1">
                            <div className="text-2xl font-bold text-purple-700">{todayOutput}</div>
                            <span className="text-xs text-muted-foreground">Goal: {dailyGoal}</span>
                        </div>
                        <Progress value={outputProgress} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex flex-wrap gap-3">
                <Button
                    onClick={() => navigate('/seal?tab=floor')}
                    className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                >
                    <Layers className="h-4 w-4" />
                    Start Batch Exposure
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/seal?tab=materials')}
                    className="gap-2"
                >
                    <Package className="h-4 w-4" />
                    Check Materials
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/seal?tab=earnings')}
                    className="gap-2"
                >
                    <TrendingUp className="h-4 w-4" />
                    View Earnings
                </Button>
            </div>

            {/* 2. MIDDLE ROW: CHARTS & URGENT */}
            <div className="grid gap-4 md:grid-cols-12">

                {/* URGENT JOBS (5 Cols) */}
                <Card className="md:col-span-5 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Rush Orders
                        </CardTitle>
                        <CardDescription>Priority orders requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {urgentOrders.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground text-sm">
                                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                                    All rush orders completed!
                                </div>
                            ) : (
                                urgentOrders.slice(0, 4).map(order => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-red-50 to-white dark:from-red-950/20 dark:to-slate-900/50 border-red-100 dark:border-red-900/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">!</Badge>
                                            <div>
                                                <div className="font-semibold text-sm">{order.id}: {order.content}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-red-500 font-medium">{order.status.replace('_', ' ')}</span>
                                                    <span>•</span>
                                                    <span>{order.dealerName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                                            View <ArrowUpRight className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* PRODUCTION VELOCITY CHART (4 Cols) */}
                <Card className="md:col-span-4 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Production Trend</CardTitle>
                        <CardDescription>Weekly completed vs pending</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SEAL_PRODUCTION_STATS.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    width={30}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} name="Completed" />
                                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} name="Pending" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* ORDER TYPE BREAKDOWN (3 Cols) */}
                <Card className="md:col-span-3 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Order Types</CardTitle>
                        <CardDescription>This month distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[220px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number, name: string) => [`${value} orders`, name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <div className="px-4 pb-4 flex justify-center gap-4 text-xs">
                        {typeData.map(item => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-muted-foreground">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 3. BOTTOM ROW: PERFORMANCE & TOP DEALERS */}
            <div className="grid gap-4 md:grid-cols-2">

                {/* Performance Summary */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            Weekly Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-center">
                                <div className="text-2xl font-bold text-purple-600">{SEAL_TEAM_EARNINGS.thisWeek.orders}</div>
                                <div className="text-xs text-muted-foreground">Orders Completed</div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-center">
                                <div className="text-2xl font-bold text-emerald-600">₹{SEAL_TEAM_EARNINGS.thisWeek.revenue}</div>
                                <div className="text-xs text-muted-foreground">Revenue Generated</div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-center">
                                <div className="text-2xl font-bold text-blue-600">{SEAL_PRODUCTION_STATS.avgProcessingTime}</div>
                                <div className="text-xs text-muted-foreground">Avg Processing Time</div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-center">
                                <div className="text-2xl font-bold text-amber-600">{SEAL_PRODUCTION_STATS.rushOrderPercentage}%</div>
                                <div className="text-xs text-muted-foreground">Rush Orders</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Dealers */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            Top Dealers This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {SEAL_TEAM_EARNINGS.topDealers.slice(0, 4).map((dealer, idx) => (
                                <div key={dealer.dealerId} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                                idx === 1 ? 'bg-slate-200 text-slate-700' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{dealer.dealerName}</div>
                                            <div className="text-xs text-muted-foreground">{dealer.orders} orders</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600">₹{dealer.revenue}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
