import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, Send } from 'lucide-react';

const Completed = () => {
    const completedOrders = [
        {
            id: 'SL2339',
            client: 'Legal Associates',
            matter: 'Notary Seal',
            language: 'English',
            sealType: 'Self-Ink',
            completedAt: '30 mins ago',
            status: 'ready'
        },
        {
            id: 'SL2338',
            client: 'Green Energy Co',
            matter: 'CEO Round Seal',
            language: 'English',
            sealType: 'Normal Seal',
            completedAt: '1 hour ago',
            status: 'ready'
        },
        {
            id: 'SL2337',
            client: 'Smart Solutions',
            matter: 'Company Seal',
            language: 'Malayalam',
            sealType: 'Self-Ink',
            completedAt: '3 hours ago',
            status: 'dispatched'
        },
        {
            id: 'SL2336',
            client: 'Elite Motors',
            matter: 'Showroom Seal',
            language: 'English',
            sealType: 'Self-Ink',
            completedAt: 'Yesterday',
            status: 'dispatched'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Completed Orders</h1>
                <p className="text-muted-foreground">Finished seal orders ready for delivery.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Completed ({completedOrders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {completedOrders.map((order) => (
                            <div
                                key={order.id}
                                className={`flex items-center justify-between py-4 px-4 rounded-lg ${order.status === 'dispatched'
                                        ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                        : 'bg-muted/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${order.status === 'dispatched'
                                            ? 'bg-green-100 dark:bg-green-900/30'
                                            : 'bg-gray-100 dark:bg-gray-800'
                                        }`}>
                                        <CheckCircle className={`h-5 w-5 ${order.status === 'dispatched' ? 'text-green-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{order.client}</p>
                                        <p className="text-xs text-muted-foreground">#{order.id} • {order.matter}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${order.language === 'Malayalam'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {order.language}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${order.sealType === 'Self-Ink'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                                }`}>
                                                {order.sealType}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground mr-2">{order.completedAt}</span>
                                    {order.status === 'dispatched' ? (
                                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                                            Dispatched
                                        </span>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button size="sm">
                                                <Send className="h-4 w-4 mr-1" />
                                                Dispatch
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Completed;
