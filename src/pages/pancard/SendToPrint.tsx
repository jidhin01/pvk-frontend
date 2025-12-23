import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Send, Eye, CheckCircle } from 'lucide-react';

const SendToPrint = () => {
    const completedApplications = [
        {
            id: 'PAN2330',
            name: 'Kiran Reddy',
            type: 'New PAN',
            dealer: 'ABC Prints',
            completedAt: '30 mins ago',
            status: 'ready'
        },
        {
            id: 'PAN2329',
            name: 'Lakshmi Menon',
            type: 'Correction',
            dealer: 'XYZ Cards',
            completedAt: '1 hour ago',
            status: 'ready'
        },
        {
            id: 'PAN2328',
            name: 'Ravi Shankar',
            type: 'New PAN',
            dealer: 'Quick Print',
            completedAt: '2 hours ago',
            status: 'ready'
        },
        {
            id: 'PAN2327',
            name: 'Sunita Devi',
            type: 'Duplicate',
            dealer: 'Prime Cards',
            completedAt: '3 hours ago',
            status: 'sent'
        },
    ];

    const readyCount = completedApplications.filter(a => a.status === 'ready').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Send to Print</h1>
                <p className="text-muted-foreground">Completed PAN applications ready to be sent to Printer Team.</p>
            </div>

            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ready for Print</CardTitle>
                        <Printer className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{readyCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting print assignment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {completedApplications.filter(a => a.status === 'sent').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Already with Printer Team</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Printer className="h-5 w-5 text-purple-500" />
                        Print Queue
                    </CardTitle>
                    <Button size="sm" disabled={readyCount === 0}>
                        <Send className="h-4 w-4 mr-1" />
                        Send All to Printer
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {completedApplications.map((app) => (
                            <div
                                key={app.id}
                                className={`flex items-center justify-between py-4 px-4 rounded-lg ${app.status === 'sent'
                                        ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                        : 'bg-muted/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${app.status === 'sent'
                                            ? 'bg-green-100 dark:bg-green-900/30'
                                            : 'bg-purple-100 dark:bg-purple-900/30'
                                        }`}>
                                        {app.status === 'sent' ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <Printer className="h-5 w-5 text-purple-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{app.name}</p>
                                        <p className="text-xs text-muted-foreground">#{app.id} • {app.type} • via {app.dealer}</p>
                                        <p className="text-xs text-muted-foreground">Completed {app.completedAt}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {app.status === 'sent' ? (
                                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                                            Sent to Printer
                                        </span>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                Preview
                                            </Button>
                                            <Button size="sm">
                                                <Send className="h-4 w-4 mr-1" />
                                                Send
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

export default SendToPrint;
