import React, { useState } from 'react';
import {
    Palette,
    Printer,
    Briefcase,
    Package,
    IdCard,
    Stamp,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock department data
const MOCK_DEPARTMENTS = {
    designer: {
        name: 'Designer Team',
        icon: Palette,
        color: 'purple',
        stats: {
            totalStaff: 5,
            activeNow: 4,
            pendingJobs: 12,
            completedToday: 28,
            avgTime: '15 min',
        },
        recentWork: [
            { id: 1, title: 'Business Card Design', assignee: 'Anu Designer', status: 'in-progress', dealer: 'ABC Prints' },
            { id: 2, title: 'Poster Design', assignee: 'Ravi Designer', status: 'completed', dealer: 'Quick Hub' },
            { id: 3, title: 'Brochure Layout', assignee: 'Deepa Designer', status: 'pending', dealer: 'Express Gfx' },
        ],
    },
    printer: {
        name: 'Printer Team',
        icon: Printer,
        color: 'blue',
        stats: {
            totalStaff: 4,
            activeNow: 3,
            pendingJobs: 24,
            completedToday: 156,
            avgTime: '8 min',
        },
        recentWork: [
            { id: 1, title: 'PVC Cards (100)', assignee: 'Printer 1', status: 'in-progress', dealer: 'ABC Prints' },
            { id: 2, title: 'Visiting Cards (500)', assignee: 'Printer 2', status: 'completed', dealer: 'Quick Hub' },
            { id: 3, title: 'Posters (50)', assignee: 'Printer 1', status: 'pending', dealer: 'Express Gfx' },
        ],
    },
    sales: {
        name: 'Sales / Line Staff',
        icon: Briefcase,
        color: 'green',
        stats: {
            totalStaff: 8,
            activeNow: 6,
            pendingDeliveries: 15,
            completedToday: 42,
            collectedToday: '₹45,200',
        },
        recentWork: [
            { id: 1, title: 'Delivery to Kochi', assignee: 'Rahul', status: 'in-progress', dealer: 'ABC Prints' },
            { id: 2, title: 'Collection', assignee: 'Suresh', status: 'completed', dealer: 'Quick Hub' },
            { id: 3, title: 'Delivery to Trivandrum', assignee: 'Anil', status: 'pending', dealer: 'Express Gfx' },
        ],
    },
    stock: {
        name: 'Stock Keeper',
        icon: Package,
        color: 'orange',
        stats: {
            totalStaff: 2,
            activeNow: 2,
            lowStockItems: 5,
            deadStockItems: 3,
            totalItems: 245,
        },
        recentWork: [
            { id: 1, title: 'Stock Entry - PVC Sheets', assignee: 'Suresh', status: 'completed', dealer: 'Godown' },
            { id: 2, title: 'Stock Transfer', assignee: 'Suresh', status: 'in-progress', dealer: 'Shop' },
            { id: 3, title: 'Dead Stock Alert', assignee: '-', status: 'pending', dealer: 'Godown' },
        ],
    },
    pancard: {
        name: 'PAN Card Team',
        icon: IdCard,
        color: 'cyan',
        stats: {
            totalStaff: 3,
            activeNow: 2,
            normalPending: 8,
            emergencyPending: 2,
            completedToday: 15,
        },
        recentWork: [
            { id: 1, title: 'Normal PAN - Ramesh', assignee: 'Meena', status: 'in-progress', dealer: 'Customer' },
            { id: 2, title: 'Emergency PAN - Suresh', assignee: 'Gopi', status: 'completed', dealer: 'Dealer' },
            { id: 3, title: 'Normal PAN - Lakshmi', assignee: 'Meena', status: 'pending', dealer: 'Customer' },
        ],
    },
    seal: {
        name: 'Seal Team',
        icon: Stamp,
        color: 'pink',
        stats: {
            totalStaff: 3,
            activeNow: 2,
            selfInkPending: 6,
            normalSealPending: 4,
            completedToday: 18,
        },
        recentWork: [
            { id: 1, title: 'Self-Ink Seal (Malayalam)', assignee: 'Kumar', status: 'in-progress', dealer: 'ABC Prints' },
            { id: 2, title: 'Normal Seal (English)', assignee: 'Priya', status: 'completed', dealer: 'Quick Hub' },
            { id: 3, title: 'Self-Ink Seal (English)', assignee: 'Kumar', status: 'pending', dealer: 'Express Gfx' },
        ],
    },
};

const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', light: 'bg-purple-100 dark:bg-purple-900' },
        blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', light: 'bg-blue-100 dark:bg-blue-900' },
        green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', light: 'bg-green-100 dark:bg-green-900' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-100 dark:bg-orange-900' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', light: 'bg-cyan-100 dark:bg-cyan-900' },
        pink: { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', light: 'bg-pink-100 dark:bg-pink-900' },
    };
    return colors[color] || colors.purple;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
        case 'in-progress':
            return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>;
        case 'pending':
            return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Pending</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

const DepartmentOverview = () => {
    const [activeDept, setActiveDept] = useState<string>('designer');
    const dept = MOCK_DEPARTMENTS[activeDept as keyof typeof MOCK_DEPARTMENTS];
    const colorClasses = getColorClasses(dept.color);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Department Overview</h1>
                <p className="text-muted-foreground">Monitor all team activities and workloads</p>
            </div>

            {/* Department Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Object.entries(MOCK_DEPARTMENTS).map(([key, dept]) => {
                    const colors = getColorClasses(dept.color);
                    const isActive = activeDept === key;
                    return (
                        <Card
                            key={key}
                            className={`cursor-pointer transition-all hover:shadow-md ${isActive ? `border-2 ${colors.border}` : ''}`}
                            onClick={() => setActiveDept(key)}
                        >
                            <CardContent className="pt-4 text-center">
                                <div className={`mx-auto w-12 h-12 rounded-full ${colors.light} flex items-center justify-center mb-2`}>
                                    <dept.icon className={`h-6 w-6 ${colors.text}`} />
                                </div>
                                <p className="text-sm font-medium truncate">{dept.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {dept.stats.activeNow}/{dept.stats.totalStaff} active
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Selected Department Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${colorClasses.light}`}>
                                <dept.icon className={`h-6 w-6 ${colorClasses.text}`} />
                            </div>
                            <div>
                                <CardTitle>{dept.name}</CardTitle>
                                <CardDescription>Team Statistics</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Team Members</span>
                            <span className="font-medium flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {dept.stats.totalStaff}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Currently Active</span>
                            <span className="font-medium text-green-500">{dept.stats.activeNow}</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Team Capacity</span>
                                <span>{Math.round((dept.stats.activeNow / dept.stats.totalStaff) * 100)}%</span>
                            </div>
                            <Progress value={(dept.stats.activeNow / dept.stats.totalStaff) * 100} className="h-2" />
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            {activeDept === 'designer' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            Pending Jobs
                                        </span>
                                        <Badge variant="secondary">{dept.stats.pendingJobs}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Completed Today
                                        </span>
                                        <Badge className="bg-green-100 text-green-800">{dept.stats.completedToday}</Badge>
                                    </div>
                                </>
                            )}
                            {activeDept === 'printer' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            Print Queue
                                        </span>
                                        <Badge variant="secondary">{dept.stats.pendingJobs}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Printed Today
                                        </span>
                                        <Badge className="bg-green-100 text-green-800">{dept.stats.completedToday}</Badge>
                                    </div>
                                </>
                            )}
                            {activeDept === 'sales' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            Pending Deliveries
                                        </span>
                                        <Badge variant="secondary">{(dept.stats as any).pendingDeliveries}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            Collected Today
                                        </span>
                                        <Badge className="bg-green-100 text-green-800">{(dept.stats as any).collectedToday}</Badge>
                                    </div>
                                </>
                            )}
                            {activeDept === 'stock' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4 text-orange-500" />
                                            Low Stock Items
                                        </span>
                                        <Badge variant="secondary" className="text-orange-600">{(dept.stats as any).lowStockItems}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            Dead Stock
                                        </span>
                                        <Badge variant="destructive">{(dept.stats as any).deadStockItems}</Badge>
                                    </div>
                                </>
                            )}
                            {activeDept === 'pancard' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            Normal PAN Pending
                                        </span>
                                        <Badge variant="secondary">{(dept.stats as any).normalPending}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            Emergency PAN
                                        </span>
                                        <Badge variant="destructive">{(dept.stats as any).emergencyPending}</Badge>
                                    </div>
                                </>
                            )}
                            {activeDept === 'seal' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            Self-Ink Pending
                                        </span>
                                        <Badge variant="secondary">{(dept.stats as any).selfInkPending}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            Normal Seal Pending
                                        </span>
                                        <Badge variant="secondary">{(dept.stats as any).normalSealPending}</Badge>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Work */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest work items from {dept.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dept.recentWork.map((work) => (
                                <div
                                    key={work.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${colorClasses.light}`}>
                                            <dept.icon className={`h-4 w-4 ${colorClasses.text}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{work.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {work.assignee} • {work.dealer}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(work.status)}
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4">
                            View All Activity
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DepartmentOverview;
