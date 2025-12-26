import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRightLeft, Warehouse, Store, Clock } from 'lucide-react';

interface DeadStockItem {
    id: string;
    name: string;
    location: 'godown' | 'shop';
    quantity: number;
    daysSinceMovement: number;
    deadStockDuration: number;
    lastMovement: string;
}

const mockDeadStock: DeadStockItem[] = [
    { id: '1', name: 'Old Design Cards - Blue', location: 'shop', quantity: 45, daysSinceMovement: 95, deadStockDuration: 90, lastMovement: '2024-09-20' },
    { id: '2', name: 'Discontinued Seal Type', location: 'godown', quantity: 120, daysSinceMovement: 180, deadStockDuration: 90, lastMovement: '2024-06-26' },
    { id: '3', name: 'Premium Gold Cards', location: 'shop', quantity: 30, daysSinceMovement: 100, deadStockDuration: 90, lastMovement: '2024-09-14' },
    { id: '4', name: 'Old PAN Card Stock', location: 'godown', quantity: 200, daysSinceMovement: 150, deadStockDuration: 90, lastMovement: '2024-07-26' },
    { id: '5', name: 'Vintage Stamp Set', location: 'shop', quantity: 15, daysSinceMovement: 110, deadStockDuration: 90, lastMovement: '2024-09-04' },
];

const DeadStock = () => {
    const shopDeadStock = mockDeadStock.filter(item => item.location === 'shop');
    const godownDeadStock = mockDeadStock.filter(item => item.location === 'godown');

    const getSeverity = (days: number, threshold: number) => {
        const ratio = days / threshold;
        if (ratio >= 2) return 'high';
        if (ratio >= 1.5) return 'medium';
        return 'low';
    };

    const renderDeadStockCard = (item: DeadStockItem) => {
        const severity = getSeverity(item.daysSinceMovement, item.deadStockDuration);

        return (
            <div
                key={item.id}
                className={`p-4 rounded-lg border ${severity === 'high'
                    ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
                    : severity === 'medium'
                        ? 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30'
                        : 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30'
                    }`}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${severity === 'high'
                            ? 'bg-red-100 dark:bg-red-900/50'
                            : severity === 'medium'
                                ? 'bg-orange-100 dark:bg-orange-900/50'
                                : 'bg-yellow-100 dark:bg-yellow-900/50'
                            }`}>
                            <AlertTriangle className={`h-5 w-5 ${severity === 'high'
                                ? 'text-red-600'
                                : severity === 'medium'
                                    ? 'text-orange-600'
                                    : 'text-yellow-600'
                                }`} />
                        </div>
                        <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} units</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    {item.daysSinceMovement} days since last movement
                                </span>
                            </div>
                        </div>
                    </div>
                    <Badge variant={severity === 'high' ? 'destructive' : 'secondary'}>
                        {severity === 'high' ? 'Critical' : severity === 'medium' ? 'Warning' : 'Attention'}
                    </Badge>
                </div>
                <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Exchange
                    </Button>
                    <Button size="sm" variant="outline">View Details</Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dead Stock Management</h1>
                <p className="text-muted-foreground">Monitor and manage items that haven't moved beyond their threshold.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shop Dead Stock</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{shopDeadStock.length}</div>
                        <p className="text-xs text-muted-foreground">Items need exchange with godown</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Godown Dead Stock</CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{godownDeadStock.length}</div>
                        <p className="text-xs text-muted-foreground">Items require immediate attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Shop Dead Stock */}
            {shopDeadStock.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            Shop Dead Stock ({shopDeadStock.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {shopDeadStock.map(renderDeadStockCard)}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Godown Dead Stock */}
            {godownDeadStock.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Warehouse className="h-5 w-5" />
                            Godown Dead Stock ({godownDeadStock.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {godownDeadStock.map(renderDeadStockCard)}
                        </div>
                    </CardContent>
                </Card>
            )}

            {mockDeadStock.length === 0 && (
                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        No dead stock items. All inventory is moving well!
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DeadStock;
