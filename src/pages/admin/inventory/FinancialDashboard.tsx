import React from 'react';
import { useAdminInventoryLogic } from '@/hooks/useAdminInventoryLogic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, TrendingUp, AlertTriangle, Archive, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function FinancialDashboard() {
    const { totalValue, godownValue, shopValue, deadStockValue, lowStockCount, pendingApprovals, categorySplit } = useAdminInventoryLogic();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const kpiData = [
        {
            title: "Total Inventory Value",
            value: `₹${totalValue.toLocaleString()}`,
            icon: IndianRupee,
            desc: "Asset Valuation",
            color: "text-blue-600"
        },
        {
            title: "Dead Stock Value",
            value: `₹${deadStockValue.toLocaleString()}`,
            icon: Archive,
            desc: "> 90 days stagnant",
            color: "text-red-600"
        },
        {
            title: "Pending Approvals",
            value: pendingApprovals,
            icon: CheckCircle, // Wait, need to import CheckCircle or use another icon
            desc: "Purchase Requests",
            color: "text-orange-600"
        },
        {
            title: "Low Stock Items",
            value: lowStockCount,
            icon: AlertTriangle,
            desc: "Below Minimum Level",
            color: "text-amber-600"
        }
    ];

    const locationData = [
        { name: 'Godown', value: godownValue },
        { name: 'Shop', value: shopValue },
    ];

    return (
        <div className="space-y-8 p-4">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {kpi.title}
                            </CardTitle>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Inventory Value by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categorySplit}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categorySplit.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {categorySplit.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Location Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={locationData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                    <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
