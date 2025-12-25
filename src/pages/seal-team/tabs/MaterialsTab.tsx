import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Beaker,
    AlertTriangle,
    ShoppingCart,
    Info,
    TrendingDown,
    Package,
    Clock,
    BarChart3,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Mock usage history data
const USAGE_HISTORY = [
    { day: 'Mon', polymer: 0.3, film: 8, handles: 5 },
    { day: 'Tue', polymer: 0.4, film: 12, handles: 7 },
    { day: 'Wed', polymer: 0.2, film: 6, handles: 4 },
    { day: 'Thu', polymer: 0.5, film: 14, handles: 9 },
    { day: 'Fri', polymer: 0.3, film: 10, handles: 6 },
    { day: 'Sat', polymer: 0.2, film: 5, handles: 3 },
    { day: 'Sun', polymer: 0.1, film: 2, handles: 1 }
];

const CONSUMABLES = [
    {
        name: 'Polymer Liquid (Red)',
        current: 1.2,
        unit: 'Liters',
        max: 5,
        reorderAt: 1.5,
        lastRestocked: '2025-12-20',
        avgDailyUsage: 0.3,
        daysRemaining: 4,
        alert: true
    },
    {
        name: 'Negative Film A4',
        current: 45,
        unit: 'Sheets',
        max: 100,
        reorderAt: 30,
        lastRestocked: '2025-12-22',
        avgDailyUsage: 8,
        daysRemaining: 5,
        alert: false
    },
    {
        name: 'Tracing Paper (Vellum)',
        current: 80,
        unit: 'Sheets',
        max: 100,
        reorderAt: 25,
        lastRestocked: '2025-12-23',
        avgDailyUsage: 5,
        daysRemaining: 16,
        alert: false
    },
    {
        name: 'UV Exposure Bulb',
        current: 2,
        unit: 'Units',
        max: 5,
        reorderAt: 2,
        lastRestocked: '2025-12-15',
        avgDailyUsage: 0.1,
        daysRemaining: 20,
        alert: true
    }
];

const MACHINE_HANDLES = [
    { name: 'Shiny S-842', stock: 3, alert: true, category: 'Self-Ink', price: 120 },
    { name: 'Shiny S-843', stock: 12, alert: false, category: 'Self-Ink', price: 150 },
    { name: 'Shiny S-844', stock: 8, alert: false, category: 'Self-Ink', price: 180 },
    { name: 'Colop C-20', stock: 8, alert: false, category: 'Self-Ink', price: 200 },
    { name: 'Pocket 20', stock: 0, alert: true, category: 'Pocket', price: 250 },
    { name: 'Pocket 30', stock: 5, alert: false, category: 'Pocket', price: 280 },
    { name: 'Mouse R-30', stock: 15, alert: false, category: 'Pocket', price: 220 },
    { name: 'Wooden 2 inch', stock: 45, alert: false, category: 'Wooden', price: 50 },
    { name: 'Wooden 3 inch', stock: 30, alert: false, category: 'Wooden', price: 70 },
    { name: 'Wooden Round 25mm', stock: 25, alert: false, category: 'Wooden', price: 60 }
];

export const MaterialsTab = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredHandles = activeCategory === 'all'
        ? MACHINE_HANDLES
        : MACHINE_HANDLES.filter(h => h.category === activeCategory);

    const alertCount = [...CONSUMABLES, ...MACHINE_HANDLES].filter(i => i.alert).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Material Inventory</h2>
                    <p className="text-sm text-muted-foreground">Manage consumables and machine stock for seal production</p>
                </div>
                <div className="flex gap-2">
                    {alertCount > 0 && (
                        <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {alertCount} Low Stock Items
                        </Badge>
                    )}
                    <Button onClick={() => toast.success('Restock request sent to Stock Keeper')}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Request Restock
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm bg-gradient-to-br from-red-50 to-white dark:from-red-950/10 dark:to-slate-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Critical Stock</div>
                                <div className="text-2xl font-bold text-red-600">{alertCount}</div>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/10 dark:to-slate-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Reorder Soon</div>
                                <div className="text-2xl font-bold text-amber-600">2</div>
                            </div>
                            <Clock className="h-8 w-8 text-amber-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/10 dark:to-slate-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Total Items</div>
                                <div className="text-2xl font-bold text-emerald-600">{CONSUMABLES.length + MACHINE_HANDLES.length}</div>
                            </div>
                            <Package className="h-8 w-8 text-emerald-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/10 dark:to-slate-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Last Updated</div>
                                <div className="text-lg font-bold text-blue-600">Today</div>
                            </div>
                            <RefreshCw className="h-8 w-8 text-blue-300" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Consumables Tracker */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Beaker className="h-5 w-5 text-purple-600" />
                            Consumables Level
                        </CardTitle>
                        <CardDescription>Estimated remaining levels based on usage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {CONSUMABLES.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {item.current} {item.unit}
                                        </span>
                                        {item.alert && (
                                            <Badge variant="destructive" className="text-[10px] h-5">LOW</Badge>
                                        )}
                                    </div>
                                </div>
                                <Progress
                                    value={(item.current / item.max) * 100}
                                    className="h-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        ~{item.daysRemaining} days left
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TrendingDown className="h-3 w-3" />
                                        {item.avgDailyUsage} {item.unit.toLowerCase()}/day
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Machine Handles */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-600" />
                            Machine Handles
                        </CardTitle>
                        <CardDescription>Stock levels by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 h-9 mb-4">
                                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                                <TabsTrigger value="Self-Ink" className="text-xs">Self-Ink</TabsTrigger>
                                <TabsTrigger value="Pocket" className="text-xs">Pocket</TabsTrigger>
                                <TabsTrigger value="Wooden" className="text-xs">Wooden</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto">
                            {filteredHandles.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg border flex flex-col justify-between ${item.alert
                                            ? 'border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/30'
                                            : 'bg-slate-50 dark:bg-slate-900/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-semibold">{item.name}</span>
                                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-xs text-muted-foreground">Qty</span>
                                        <span className={`text-xl font-bold ${item.alert ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {item.stock}
                                        </span>
                                    </div>
                                    {item.alert && (
                                        <div className="text-[10px] text-red-600 font-medium mt-2 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            Re-order Required
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Analytics */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        Weekly Usage Analytics
                    </CardTitle>
                    <CardDescription>Material consumption over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Day</th>
                                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Polymer (L)</th>
                                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Film (Sheets)</th>
                                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Handles Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {USAGE_HISTORY.map((day, idx) => (
                                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-2 font-medium">{day.day}</td>
                                        <td className="py-3 px-2 text-center">{day.polymer}</td>
                                        <td className="py-3 px-2 text-center">{day.film}</td>
                                        <td className="py-3 px-2 text-center">{day.handles}</td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-50 dark:bg-slate-900/50 font-semibold">
                                    <td className="py-3 px-2">Weekly Total</td>
                                    <td className="py-3 px-2 text-center">{USAGE_HISTORY.reduce((a, b) => a + b.polymer, 0).toFixed(1)}</td>
                                    <td className="py-3 px-2 text-center">{USAGE_HISTORY.reduce((a, b) => a + b.film, 0)}</td>
                                    <td className="py-3 px-2 text-center">{USAGE_HISTORY.reduce((a, b) => a + b.handles, 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
