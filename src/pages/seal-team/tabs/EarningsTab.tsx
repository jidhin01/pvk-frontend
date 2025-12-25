import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
    Clock,
    Calendar,
    ArrowUpRight,
    Filter
} from 'lucide-react';
import { SEAL_TEAM_EARNINGS, SEAL_PRODUCTION_STATS } from '@/data/mockSealData';

const MONTHLY_DATA = [
    { month: 'Jul', revenue: 12500, orders: 38 },
    { month: 'Aug', revenue: 14200, orders: 42 },
    { month: 'Sep', revenue: 13800, orders: 40 },
    { month: 'Oct', revenue: 15600, orders: 48 },
    { month: 'Nov', revenue: 16800, orders: 52 },
    { month: 'Dec', revenue: 14500, orders: 45 }
];

const TYPE_COLORS = {
    SELF_INK: '#8b5cf6',
    WOODEN: '#f59e0b',
    POCKET: '#10b981'
};

export const EarningsTab = () => {
    const [period, setPeriod] = useState('thisMonth');

    const currentData = period === 'thisMonth' ? SEAL_TEAM_EARNINGS.thisMonth : SEAL_TEAM_EARNINGS.lastMonth;
    const comparisonData = period === 'thisMonth' ? SEAL_TEAM_EARNINGS.lastMonth : SEAL_TEAM_EARNINGS.thisMonth;

    const revenueChange = ((currentData.revenue - comparisonData.revenue) / comparisonData.revenue * 100).toFixed(1);
    const ordersChange = ((currentData.orders - comparisonData.orders) / comparisonData.orders * 100).toFixed(1);
    const profitChange = ((currentData.profit - comparisonData.profit) / comparisonData.profit * 100).toFixed(1);

    const pieData = [
        { name: 'Self-Ink', value: SEAL_TEAM_EARNINGS.byType.SELF_INK.revenue, color: TYPE_COLORS.SELF_INK },
        { name: 'Wooden', value: SEAL_TEAM_EARNINGS.byType.WOODEN.revenue, color: TYPE_COLORS.WOODEN },
        { name: 'Pocket', value: SEAL_TEAM_EARNINGS.byType.POCKET.revenue, color: TYPE_COLORS.POCKET }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Earnings Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Track revenue, orders, and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[160px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thisMonth">This Month</SelectItem>
                            <SelectItem value="lastMonth">Last Month</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Total Revenue
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">₹{currentData.revenue.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {Number(revenueChange) >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-emerald-600" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${Number(revenueChange) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {revenueChange}% vs {period === 'thisMonth' ? 'last month' : 'this month'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-950">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Orders Completed
                            <Package className="h-4 w-4 text-purple-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-700">{currentData.orders}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {Number(ordersChange) >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-emerald-600" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${Number(ordersChange) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {ordersChange}% vs previous
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-950">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Net Profit
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">₹{currentData.profit.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {Number(profitChange) >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-emerald-600" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${Number(profitChange) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {profitChange}% margin
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-950">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Avg Processing Time
                            <Clock className="h-4 w-4 text-amber-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">{SEAL_PRODUCTION_STATS.avgProcessingTime}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Per seal order
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Revenue Trend */}
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Revenue Trend</CardTitle>
                        <CardDescription>Monthly earnings over 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue by Type */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Revenue by Type</CardTitle>
                        <CardDescription>Seal type contribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[220px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <div className="px-4 pb-4 space-y-2">
                        {Object.entries(SEAL_TEAM_EARNINGS.byType).map(([type, data]) => (
                            <div key={type} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS] }}
                                    />
                                    <span className="text-muted-foreground">{type.replace('_', '-')}</span>
                                </div>
                                <span className="font-medium">{data.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Top Dealers Table */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Top Performing Dealers</CardTitle>
                        <CardDescription>Ranked by order volume and revenue</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                        View All <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Rank</th>
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Dealer</th>
                                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Orders</th>
                                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Revenue</th>
                                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Avg Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SEAL_TEAM_EARNINGS.topDealers.map((dealer, idx) => (
                                    <tr key={dealer.dealerId} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-2">
                                            <Badge
                                                variant={idx === 0 ? 'default' : 'secondary'}
                                                className={`${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : ''}`}
                                            >
                                                #{idx + 1}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-2">
                                            <div className="font-medium">{dealer.dealerName}</div>
                                            <div className="text-xs text-muted-foreground">{dealer.dealerId}</div>
                                        </td>
                                        <td className="py-3 px-2 text-center font-medium">{dealer.orders}</td>
                                        <td className="py-3 px-2 text-right font-semibold text-emerald-600">₹{dealer.revenue.toLocaleString()}</td>
                                        <td className="py-3 px-2 text-right text-muted-foreground">
                                            ₹{Math.round(dealer.revenue / dealer.orders)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
