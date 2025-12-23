
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PanVerificationList } from './PanVerificationList';
import { MOCK_PAN_APPLICATIONS } from '@/data/mockPanData';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle2, FileText, Printer, BarChart } from 'lucide-react';
import { toast } from 'sonner';

export default function PanDashboard() {
    const [applications, setApplications] = useState(MOCK_PAN_APPLICATIONS);

    const handleStatusChange = (id: string, newStatus: any, reason?: string) => {
        setApplications(apps => apps.map(app =>
            app.id === id ? { ...app, status: newStatus, rejectionReason: reason } : app
        ));

        if (newStatus === 'sent_to_printer') {
            toast.success(`Application ${id} approved and sent to printing queue.`);
        } else if (newStatus === 'completed') {
            toast.success(`Application ${id} marked as digitally complete.`);
        } else if (newStatus === 'reupload_requested') {
            toast.warning(`Re-upload requested for ${id}: ${reason}`);
        } else if (newStatus === 'rejected') {
            toast.error(`Application ${id} has been rejected permanently.`);
        }
    };

    // Derived State
    const pendingNormal = applications.filter(a => a.status === 'pending_verification' && a.type === 'NORMAL');
    const pendingEmergency = applications.filter(a => a.status === 'pending_verification' && a.type === 'EMERGENCY');
    const sentToPrint = applications.filter(a => a.status === 'sent_to_printer');
    const reuploads = applications.filter(a => a.status === 'reupload_requested');

    const stats = [
        { label: 'Emergency Pending', value: pendingEmergency.length, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
        { label: 'Normal Pending', value: pendingNormal.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: FileText },
        { label: 'Ready for Print', value: sentToPrint.length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
        { label: 'Total Processed', value: applications.filter(a => a.status !== 'pending_verification').length, color: 'text-purple-600', bg: 'bg-purple-50', icon: BarChart },
    ];

    return (
        <DashboardLayout>
            {({ activeTab }) => {
                const renderContent = () => {
                    switch (activeTab) {
                        case 'dashboard':
                            return (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        {stats.map((stat, i) => (
                                            <Card key={i} className="border-l-4" style={{ borderLeftColor: 'currentColor' }}>
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                                    </div>
                                                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                                                        <stat.icon className="h-6 w-6" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Priority Queue Preview */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <AlertCircle className="text-red-500 h-5 w-5" />
                                                Priority Queue (Emergency)
                                            </h2>
                                        </div>
                                        <PanVerificationList
                                            data={pendingEmergency}
                                            onStatusChange={handleStatusChange}
                                        />
                                    </div>

                                    {/* Recently Flagged for Reupload */}
                                    {reuploads.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-bold flex items-center gap-2 text-orange-600">
                                                    Waiting for Dealer Action (Re-uploads)
                                                </h2>
                                            </div>
                                            <PanVerificationList
                                                data={reuploads}
                                                onStatusChange={handleStatusChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            );

                        case 'normal-pan':
                            return (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">Normal Applications</h2>
                                        <p className="text-muted-foreground">Standard timeline verification queue.</p>
                                    </div>
                                    <PanVerificationList
                                        data={pendingNormal}
                                        onStatusChange={handleStatusChange}
                                    />
                                </div>
                            );

                        case 'emergency-pan':
                            return (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                                            <AlertCircle className="h-6 w-6" />
                                            Emergency Applications
                                        </h2>
                                        <p className="text-muted-foreground">High priority queue. Verify immediately.</p>
                                    </div>
                                    <PanVerificationList
                                        data={pendingEmergency}
                                        onStatusChange={handleStatusChange}
                                    />
                                </div>
                            );

                        case 'send-to-print':
                            return (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                                            <Printer className="h-6 w-6" />
                                            Ready to Print
                                        </h2>
                                        <p className="text-muted-foreground">Applications approved and waiting for batch printing.</p>
                                    </div>
                                    {/* Read-only list logic is handled by "Processed" button state in List component */}
                                    <PanVerificationList
                                        data={sentToPrint}
                                        onStatusChange={() => { }}
                                    />
                                </div>
                            );

                        default:
                            return <div>Select a tab</div>;
                    }
                };

                return renderContent();
            }}
        </DashboardLayout>
    );
}
