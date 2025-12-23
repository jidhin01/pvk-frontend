
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, CreditCard, FileText, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
    MOCK_DESIGNER_STATS,
    MOCK_EXPENSES,
    MOCK_SALES_REVENUE
} from '@/data/mockFinanceData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DashboardOverview = () => {

    // --- Calculations ---

    const revenueStats = useMemo(() => {
        let total = 0;
        let b2b = 0;
        let retail = 0;
        let gst = 0;

        MOCK_SALES_REVENUE.forEach(sale => {
            total += sale.amount;
            if (sale.type === 'B2B_GST') {
                b2b += sale.amount;
                gst += sale.gstAmount || 0;
            } else {
                retail += sale.amount;
            }
        });

        return { total, b2b, retail, gst };
    }, []);

    const expenseStats = useMemo(() => {
        const catMap: Record<string, number> = {};
        let total = 0;

        MOCK_EXPENSES.forEach(exp => {
            catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
            total += exp.amount;
        });

        return {
            chartData: Object.entries(catMap).map(([name, value]) => ({ name, value })),
            total
        };
    }, []);

    const designerStats = useMemo(() => {
        let totalPayout = 0;
        let totalDesigns = 0;
        MOCK_DESIGNER_STATS.forEach(d => {
            totalPayout += d.totalEarnings;
            totalDesigns += d.completedDesigns;
        });
        return { totalPayout, totalDesigns };
    }, []);

    const profit = revenueStats.total - expenseStats.total - designerStats.totalPayout;


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Finance Dashboard</h1>
                    <p className="text-muted-foreground">Financial health, tax compliance, and expense tracking.</p>
                </div>
                <div className="flex gap-2">
                    <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 shadow-sm">
                        <CardContent className="p-4 py-2 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net Profit Est.</p>
                                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">₹{profit.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-all dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums">₹{revenueStats.total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex gap-2 font-medium">
                            <span className="text-blue-600 dark:text-blue-400">B2B: {(revenueStats.b2b / revenueStats.total * 100).toFixed(0)}%</span>
                            <span className="text-purple-600 dark:text-purple-400">Retail: {(revenueStats.retail / revenueStats.total * 100).toFixed(0)}%</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-all dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">GST Liability</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 tracking-tight tabular-nums">₹{revenueStats.gst.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Collected on B2B Sales</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-all dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Designer Pay</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums">₹{designerStats.totalPayout.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{designerStats.totalDesigns} designs completed</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-all dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Expenses</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight tabular-nums">₹{expenseStats.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground"> across {MOCK_EXPENSES.length} entries</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Detailed Breakdowns */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* 1. Tax Compliance Split */}
                <Card className="lg:col-span-1 shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Tax Ready Revenue</CardTitle>
                        <CardDescription>B2B (GST) vs Retail (Cash) Split</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] lg:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'B2B (GST)', value: revenueStats.b2b },
                                        { name: 'Retail (Cash)', value: revenueStats.retail }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-0" fill="#0088FE" />
                                    <Cell key="cell-1" fill="#00C49F" />
                                </Pie>
                                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Expense Breakdown Pie */}
                <Card className="lg:col-span-1 shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Expense Distribution</CardTitle>
                        <CardDescription>Where is the money going?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] lg:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseStats.chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {expenseStats.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Designer Pay Leaderboard (Mini) */}
                <Card className="lg:col-span-1 shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Designer Earnings</CardTitle>
                        <CardDescription>Performance based pay</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {MOCK_DESIGNER_STATS.map((d) => (
                                <div key={d.id} className="flex items-center justify-between border-b dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none truncate max-w-[120px]">{d.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {d.completedDesigns} Tasks | {d.mistakes > 0 ? <span className="text-red-600 dark:text-red-400">{d.mistakes} Mistakes</span> : '0 Mistakes'}
                                        </p>
                                    </div>
                                    <div className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
                                        ₹{d.totalEarnings.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardOverview;
