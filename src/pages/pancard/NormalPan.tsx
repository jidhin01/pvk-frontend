import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IdCard, Eye, CheckCircle, FileText, Image } from 'lucide-react';

const NormalPan = () => {
    const applications = [
        {
            id: 'PAN2340',
            name: 'Priya Sharma',
            aadhaar: true,
            photo: true,
            dealer: 'ABC Prints',
            time: '30 mins ago',
            type: 'New PAN'
        },
        {
            id: 'PAN2338',
            name: 'Suresh Gupta',
            aadhaar: true,
            photo: true,
            dealer: 'XYZ Cards',
            time: '1 hour ago',
            type: 'Correction'
        },
        {
            id: 'PAN2337',
            name: 'Meera Joshi',
            aadhaar: true,
            photo: false,
            dealer: 'Quick Print',
            time: '2 hours ago',
            type: 'New PAN'
        },
        {
            id: 'PAN2336',
            name: 'Vikram Singh',
            aadhaar: true,
            photo: true,
            dealer: 'Prime Cards',
            time: '3 hours ago',
            type: 'Duplicate'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Normal PAN Applications</h1>
                <p className="text-muted-foreground">Process regular PAN card applications from dealers.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IdCard className="h-5 w-5 text-blue-500" />
                        Pending Applications ({applications.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <div key={app.id} className="flex items-center justify-between py-4 px-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">{app.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{app.name}</p>
                                        <p className="text-xs text-muted-foreground">#{app.id} • {app.type} • via {app.dealer}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`flex items-center gap-1 text-xs ${app.aadhaar ? 'text-green-600' : 'text-red-500'}`}>
                                                <FileText className="h-3 w-3" />
                                                Aadhaar {app.aadhaar ? '✓' : '✗'}
                                            </span>
                                            <span className={`flex items-center gap-1 text-xs ${app.photo ? 'text-green-600' : 'text-red-500'}`}>
                                                <Image className="h-3 w-3" />
                                                Photo {app.photo ? '✓' : '✗'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground mr-2">{app.time}</span>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                    <Button size="sm" disabled={!app.aadhaar || !app.photo}>
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Process
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

export default NormalPan;
