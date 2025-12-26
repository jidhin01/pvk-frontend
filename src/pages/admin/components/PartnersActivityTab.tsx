import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, UserPlus, LogIn, ShoppingCart, Settings } from 'lucide-react';

interface PartnersActivityTabProps {
    partnerType: 'dealer' | 'customer';
}

const MOCK_ACTIVITIES = [
    { id: 1, type: 'order', title: 'New Order Placed', desc: 'Star Graphics placed order #ORD-001', time: '10 mins ago', icon: ShoppingCart, color: 'text-blue-500 bg-blue-100' },
    { id: 2, type: 'login', title: 'User Login', desc: 'Metro Ads logged in from new device', time: '1 hour ago', icon: LogIn, color: 'text-green-500 bg-green-100' },
    { id: 3, type: 'settings', title: 'Profile Updated', desc: 'ABC Prints updated their GST number', time: '2 hours ago', icon: Settings, color: 'text-orange-500 bg-orange-100' },
    { id: 4, type: 'register', title: 'New Registration', desc: 'New dealer registration request received', time: '5 hours ago', icon: UserPlus, color: 'text-purple-500 bg-purple-100' },
    { id: 5, type: 'order', title: 'Order Completed', desc: 'Order #ORD-004 marked as completed', time: '1 day ago', icon: CheckCircle, color: 'text-green-500 bg-green-100' },
];

import { CheckCircle } from 'lucide-react';

const PartnersActivityTab: React.FC<PartnersActivityTabProps> = ({ partnerType }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                </CardTitle>
                <CardDescription>Latest actions and updates from {partnerType}s</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {MOCK_ACTIVITIES.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                            <div className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${activity.color}`}>
                                <activity.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.desc}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PartnersActivityTab;
