import React, { useState } from 'react';
import {
    Clock,
    CheckCircle2,
    IndianRupee,
    User,
    Package,
    Printer as PrinterIcon,
    ShoppingCart,
    Palette,
    Truck,
    CreditCard,
    Filter,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PartnersActivityTabProps {
    partnerType: 'dealer' | 'customer';
}

type ActivityType = 'order_placed' | 'design_assigned' | 'design_completed' | 'printing_started' | 'printing_completed' | 'payment_received' | 'delivered';

interface Activity {
    id: string;
    type: ActivityType;
    partnerName: string;
    orderId: string;
    message: string;
    amount?: number;
    timestamp: string;
    timeAgo: string;
}

// Mock activity data
const MOCK_ACTIVITIES: Activity[] = [
    {
        id: '1',
        type: 'order_placed',
        partnerName: 'ABC Prints & Graphics',
        orderId: 'ORD-2024-001',
        message: 'New order placed for Business Cards - 1000 pcs',
        amount: 2500,
        timestamp: '2024-12-25 10:30 AM',
        timeAgo: '5 mins ago',
    },
    {
        id: '2',
        type: 'payment_received',
        partnerName: 'Quick Print Hub',
        orderId: 'ORD-2024-005',
        message: 'Payment received via UPI',
        amount: 7500,
        timestamp: '2024-12-25 10:15 AM',
        timeAgo: '20 mins ago',
    },
    {
        id: '3',
        type: 'design_assigned',
        partnerName: 'Express Graphics',
        orderId: 'ORD-2024-003',
        message: 'Design assigned to Anu Designer',
        timestamp: '2024-12-25 09:45 AM',
        timeAgo: '50 mins ago',
    },
    {
        id: '4',
        type: 'printing_completed',
        partnerName: 'ABC Prints & Graphics',
        orderId: 'ORD-2024-004',
        message: 'Printing completed for Company Seals - 2 pcs',
        timestamp: '2024-12-25 09:00 AM',
        timeAgo: '1 hour ago',
    },
    {
        id: '5',
        type: 'delivered',
        partnerName: 'Quick Print Hub',
        orderId: 'ORD-2024-002',
        message: 'Order delivered successfully by Rahul Sales',
        timestamp: '2024-12-24 04:30 PM',
        timeAgo: '18 hours ago',
    },
    {
        id: '6',
        type: 'design_completed',
        partnerName: 'Express Graphics',
        orderId: 'ORD-2024-006',
        message: 'Design completed for Brochures A4 - 500 pcs',
        timestamp: '2024-12-24 03:15 PM',
        timeAgo: '19 hours ago',
    },
    {
        id: '7',
        type: 'printing_started',
        partnerName: 'ABC Prints & Graphics',
        orderId: 'ORD-2024-007',
        message: 'Printing started for Posters A1 - 50 pcs',
        timestamp: '2024-12-24 11:00 AM',
        timeAgo: 'Yesterday',
    },
    {
        id: '8',
        type: 'order_placed',
        partnerName: 'New Delhi Cards',
        orderId: 'ORD-2024-008',
        message: 'New order placed for PVC Cards - 200 pcs',
        amount: 5000,
        timestamp: '2024-12-24 10:00 AM',
        timeAgo: 'Yesterday',
    },
];

const PartnersActivityTab: React.FC<PartnersActivityTabProps> = ({ partnerType }) => {
    const [activityFilter, setActivityFilter] = useState<string>('all');

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case 'order_placed':
                return <ShoppingCart className="h-4 w-4 text-blue-600" />;
            case 'design_assigned':
                return <Palette className="h-4 w-4 text-purple-600" />;
            case 'design_completed':
                return <CheckCircle2 className="h-4 w-4 text-purple-600" />;
            case 'printing_started':
                return <PrinterIcon className="h-4 w-4 text-orange-600" />;
            case 'printing_completed':
                return <CheckCircle2 className="h-4 w-4 text-orange-600" />;
            case 'payment_received':
                return <CreditCard className="h-4 w-4 text-green-600" />;
            case 'delivered':
                return <Truck className="h-4 w-4 text-green-600" />;
            default:
                return <Package className="h-4 w-4 text-gray-600" />;
        }
    };

    const getActivityBadge = (type: ActivityType) => {
        switch (type) {
            case 'order_placed':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200">New Order</Badge>;
            case 'design_assigned':
            case 'design_completed':
                return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Design</Badge>;
            case 'printing_started':
            case 'printing_completed':
                return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Printing</Badge>;
            case 'payment_received':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Payment</Badge>;
            case 'delivered':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getActivityIconBg = (type: ActivityType) => {
        switch (type) {
            case 'order_placed':
                return 'bg-blue-100 dark:bg-blue-900';
            case 'design_assigned':
            case 'design_completed':
                return 'bg-purple-100 dark:bg-purple-900';
            case 'printing_started':
            case 'printing_completed':
                return 'bg-orange-100 dark:bg-orange-900';
            case 'payment_received':
            case 'delivered':
                return 'bg-green-100 dark:bg-green-900';
            default:
                return 'bg-gray-100 dark:bg-gray-800';
        }
    };

    const filteredActivities = activityFilter === 'all'
        ? MOCK_ACTIVITIES
        : MOCK_ACTIVITIES.filter(a => {
            if (activityFilter === 'orders') return a.type === 'order_placed';
            if (activityFilter === 'design') return ['design_assigned', 'design_completed'].includes(a.type);
            if (activityFilter === 'printing') return ['printing_started', 'printing_completed'].includes(a.type);
            if (activityFilter === 'payments') return a.type === 'payment_received';
            if (activityFilter === 'delivery') return a.type === 'delivered';
            return true;
        });

    // Count activities by type
    const ordersCount = MOCK_ACTIVITIES.filter(a => a.type === 'order_placed').length;
    const paymentsCount = MOCK_ACTIVITIES.filter(a => a.type === 'payment_received').length;
    const deliveredCount = MOCK_ACTIVITIES.filter(a => a.type === 'delivered').length;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{ordersCount}</div>
                                <p className="text-xs text-muted-foreground">New Orders Today</p>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 dark:border-green-800">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{paymentsCount}</div>
                                <p className="text-xs text-muted-foreground">Payments Received</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 dark:border-green-800">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{deliveredCount}</div>
                                <p className="text-xs text-muted-foreground">Delivered Today</p>
                            </div>
                            <Truck className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{MOCK_ACTIVITIES.length}</div>
                                <p className="text-xs text-muted-foreground">Total Activities</p>
                            </div>
                            <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter by:</span>
                    <Select value={activityFilter} onValueChange={setActivityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Activities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Activities</SelectItem>
                            <SelectItem value="orders">New Orders</SelectItem>
                            <SelectItem value="design">Design Updates</SelectItem>
                            <SelectItem value="printing">Printing Updates</SelectItem>
                            <SelectItem value="payments">Payments</SelectItem>
                            <SelectItem value="delivery">Deliveries</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Activity Feed */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-muted" />

                        <div className="space-y-4">
                            {filteredActivities.map((activity, index) => (
                                <div key={activity.id} className="relative pl-12">
                                    {/* Activity Icon */}
                                    <div className={`absolute left-0 p-2 rounded-full ${getActivityIconBg(activity.type)}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>

                                    {/* Activity Content */}
                                    <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {getActivityBadge(activity.type)}
                                                    <span className="text-sm font-medium">{activity.orderId}</span>
                                                </div>
                                                <p className="text-sm mt-1">{activity.message}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                    <User className="h-3 w-3" />
                                                    <span>{activity.partnerName}</span>
                                                    <span>•</span>
                                                    <Clock className="h-3 w-3" />
                                                    <span>{activity.timeAgo}</span>
                                                </div>
                                            </div>
                                            {activity.amount && (
                                                <div className="text-right">
                                                    <p className="font-semibold flex items-center justify-end gap-1 text-green-600">
                                                        <IndianRupee className="h-4 w-4" />
                                                        {activity.amount.toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredActivities.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No activities found for this filter.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Load More */}
                    {filteredActivities.length > 0 && (
                        <div className="mt-6 text-center">
                            <Button variant="outline">
                                Load More Activities
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PartnersActivityTab;
