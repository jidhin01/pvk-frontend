import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Package, ArrowRightLeft, CheckCircle, X } from 'lucide-react';

interface Alert {
    id: string;
    type: 'dead_stock' | 'min_stock' | 'exchange';
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    priority: 'high' | 'medium' | 'low';
}

const mockAlerts: Alert[] = [
    {
        id: '1',
        type: 'dead_stock',
        title: 'Dead Stock Alert - Shop',
        description: 'Old Design Cards - Blue has not moved for 95 days. Consider exchanging with godown.',
        timestamp: '2 hours ago',
        isRead: false,
        priority: 'high',
    },
    {
        id: '2',
        type: 'min_stock',
        title: 'Minimum Stock Alert',
        description: 'Seal Ink - Black is below minimum threshold (25/30 units).',
        timestamp: '5 hours ago',
        isRead: false,
        priority: 'medium',
    },
    {
        id: '3',
        type: 'exchange',
        title: 'Exchange Required',
        description: 'Premium Gold Cards in shop needs to be exchanged with godown stock.',
        timestamp: '1 day ago',
        isRead: false,
        priority: 'medium',
    },
    {
        id: '4',
        type: 'dead_stock',
        title: 'Dead Stock Alert - Godown',
        description: 'Discontinued Seal Type has been stagnant for 180 days. Immediate action required.',
        timestamp: '1 day ago',
        isRead: true,
        priority: 'high',
    },
    {
        id: '5',
        type: 'min_stock',
        title: 'Minimum Stock Alert',
        description: 'Lamination Film is running low (45/50 units).',
        timestamp: '2 days ago',
        isRead: true,
        priority: 'low',
    },
];

const Alerts = () => {
    const unreadCount = mockAlerts.filter(a => !a.isRead).length;

    const getAlertIcon = (type: Alert['type']) => {
        switch (type) {
            case 'dead_stock':
                return <AlertTriangle className="h-5 w-5" />;
            case 'min_stock':
                return <Package className="h-5 w-5" />;
            case 'exchange':
                return <ArrowRightLeft className="h-5 w-5" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const getAlertColor = (type: Alert['type'], priority: Alert['priority']) => {
        if (priority === 'high') {
            return 'bg-red-100 dark:bg-red-900/30 text-red-600';
        }
        switch (type) {
            case 'dead_stock':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600';
            case 'min_stock':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600';
            case 'exchange':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600';
        }
    };

    const getPriorityBadge = (priority: Alert['priority']) => {
        switch (priority) {
            case 'high':
                return <Badge variant="destructive">High</Badge>;
            case 'medium':
                return <Badge variant="secondary">Medium</Badge>;
            case 'low':
                return <Badge variant="outline">Low</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
                    <p className="text-muted-foreground">Stock notifications and action items.</p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark All as Read
                    </Button>
                )}
            </div>

            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dead Stock Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockAlerts.filter(a => a.type === 'dead_stock').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <Package className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockAlerts.filter(a => a.type === 'min_stock').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exchange Required</CardTitle>
                        <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockAlerts.filter(a => a.type === 'exchange').length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        All Notifications
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">{unreadCount} New</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-lg border flex items-start gap-4 ${!alert.isRead ? 'bg-muted/50' : ''
                                    }`}
                            >
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getAlertColor(alert.type, alert.priority)}`}>
                                    {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium">{alert.title}</h4>
                                        {!alert.isRead && (
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {getPriorityBadge(alert.priority)}
                                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {mockAlerts.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No alerts at this time. All stock levels are healthy!
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Alerts;
