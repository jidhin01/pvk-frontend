import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stamp, Eye, PlayCircle, Globe, Type } from 'lucide-react';

const NewOrders = () => {
    const orders = [
        {
            id: 'SL2341',
            client: 'ABC Corporation',
            matter: 'Company Official Seal',
            language: 'Malayalam',
            sealType: 'Self-Ink',
            dealer: 'Quick Print',
            time: '15 mins ago'
        },
        {
            id: 'SL2342',
            client: 'Tech Solutions Pvt Ltd',
            matter: 'Managing Director',
            language: 'English',
            sealType: 'Normal Seal',
            dealer: 'ABC Prints',
            time: '30 mins ago'
        },
        {
            id: 'SL2343',
            client: 'Global Trading Co',
            matter: 'Accounts Department',
            language: 'English',
            sealType: 'Self-Ink',
            dealer: 'Prime Cards',
            time: '1 hour ago'
        },
        {
            id: 'SL2344',
            client: 'Fashion Hub',
            matter: 'Shop Seal with Address',
            language: 'Malayalam',
            sealType: 'Normal Seal',
            dealer: 'XYZ Cards',
            time: '2 hours ago'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Orders</h1>
                <p className="text-muted-foreground">Incoming seal/stamp orders from dealers.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Stamp className="h-5 w-5 text-blue-500" />
                        Pending Orders ({orders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Stamp className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{order.client}</p>
                                            <p className="text-xs text-muted-foreground">#{order.id} • via {order.dealer}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{order.time}</span>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button size="sm">
                                            <PlayCircle className="h-4 w-4 mr-1" />
                                            Start
                                        </Button>
                                    </div>
                                </div>
                                <div className="ml-16 space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Type className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Seal Matter:</span>
                                            <span className="text-sm font-medium">{order.matter}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${order.language === 'Malayalam'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {order.language}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${order.sealType === 'Self-Ink'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                            }`}>
                                            {order.sealType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewOrders;
