import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle, Eye, Globe } from 'lucide-react';

const Processing = () => {
    const processingOrders = [
        {
            id: 'SL2335',
            client: 'Prime Industries',
            matter: 'Company Round Seal',
            language: 'English',
            sealType: 'Self-Ink',
            progress: 80,
            startedAt: '45 mins ago'
        },
        {
            id: 'SL2336',
            client: 'City Bank Branch',
            matter: 'Branch Manager Seal',
            language: 'Malayalam',
            sealType: 'Normal Seal',
            progress: 60,
            startedAt: '1 hour ago'
        },
        {
            id: 'SL2337',
            client: 'Law Firm Associates',
            matter: 'Advocate Seal',
            language: 'English',
            sealType: 'Self-Ink',
            progress: 95,
            startedAt: '2 hours ago'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Processing</h1>
                <p className="text-muted-foreground">Orders currently being worked on.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                        Active Orders ({processingOrders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {processingOrders.map((order) => (
                            <div key={order.id} className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                            <Activity className="h-5 w-5 text-orange-600" />
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
                                        <span className="text-xs text-muted-foreground">Started {order.startedAt}</span>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button size="sm" variant="default">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Complete
                                        </Button>
                                    </div>
                                </div>
                                <div className="ml-16">
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full transition-all"
                                            style={{ width: `${order.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{order.progress}% complete</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Processing;
