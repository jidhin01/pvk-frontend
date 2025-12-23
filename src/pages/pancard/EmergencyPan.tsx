import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, CheckCircle, FileText, Image, Clock } from 'lucide-react';

const EmergencyPan = () => {
    const applications = [
        {
            id: 'PAN2341',
            name: 'Rajesh Kumar',
            aadhaar: true,
            photo: true,
            dealer: 'ABC Prints',
            time: '10 mins ago',
            urgency: 'Today'
        },
        {
            id: 'PAN2339',
            name: 'Anita Verma',
            aadhaar: true,
            photo: true,
            dealer: 'Fast Cards',
            time: '25 mins ago',
            urgency: 'Today'
        },
        {
            id: 'PAN2335',
            name: 'Mohammed Ali',
            aadhaar: true,
            photo: true,
            dealer: 'Quick Print',
            time: '45 mins ago',
            urgency: 'Urgent'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Emergency PAN Applications</h1>
                <p className="text-muted-foreground">Priority processing for urgent PAN card requests.</p>
            </div>

            {/* Urgency Alert */}
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        {applications.length} emergency applications require immediate attention
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Emergency Queue ({applications.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <div key={app.id} className="flex items-center justify-between py-4 px-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                        <span className="text-sm font-medium text-orange-600">{app.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{app.name}</p>
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                {app.urgency}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">#{app.id} • Emergency PAN • via {app.dealer}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`flex items-center gap-1 text-xs ${app.aadhaar ? 'text-green-600' : 'text-red-500'}`}>
                                                <FileText className="h-3 w-3" />
                                                Aadhaar ✓
                                            </span>
                                            <span className={`flex items-center gap-1 text-xs ${app.photo ? 'text-green-600' : 'text-red-500'}`}>
                                                <Image className="h-3 w-3" />
                                                Photo ✓
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-orange-600 mr-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-xs font-medium">{app.time}</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Process Now
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmergencyPan;
