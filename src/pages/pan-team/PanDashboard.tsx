
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PanVerificationList } from './PanVerificationList';
import { MOCK_PANCARD_ORDERS, PancardOrder } from '@/data/mockPancardData';
import { addPrinterJob } from '@/data/mockPrinterData';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle2, FileText, Printer, BarChart } from 'lucide-react';
import { toast } from 'sonner';

export default function PanDashboard() {
    const [applications, setApplications] = useState<PancardOrder[]>(MOCK_PANCARD_ORDERS);
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleStatusChange = (id: string, newStatus: PancardOrder['status'], reason?: string, fileUrl?: string) => {
        setApplications(apps => apps.map(app => {
            if (app.id === id) {
                // Side Effect: Create Printer Job if sent to printer
                if (newStatus === 'SENT_TO_PRINTER' && app.status !== 'SENT_TO_PRINTER') {
                    const job = addPrinterJob({
                        jobName: `PAN Application - ${app.applicantName}`,
                        technology: 'PVC',
                        type: 'BATCH', // Assuming batch for PAN cards usually 
                        capacity: '1/1',
                        sheetSize: 'A4',
                        material: 'PVC Card',
                        items: [app.id],
                        dealerName: app.dealerName || 'Unknown Dealer',
                        dealerType: 'dealer',
                        fileUrl: fileUrl || app.aadharProofUrl || '#',
                        assignedTo: '1', // Default to Main Shop
                        rejectionReason: undefined
                    });

                    // Link the job ID to the order and save the generated file URL
                    return { ...app, status: newStatus, rejectionReason: reason, printerJobId: job.id, generatedPanUrl: fileUrl };
                }
                return { ...app, status: newStatus, rejectionReason: reason };
            }
            return app;
        }));

        if (newStatus === 'SENT_TO_PRINTER') {
            toast.success(`Application ${id} approved and sent to printing queue.`);
        } else if (newStatus === 'COMPLETED') {
            toast.success(`Application ${id} marked as digitally complete.`);
        } else if (newStatus === 'REJECTED') {
            toast.error(`Application ${id} has been rejected permanently.`);
        }
    };

    // Derived State
    const pendingNormal = applications.filter(a => a.status === 'PENDING' && a.type === 'NORMAL');
    const pendingEmergency = applications.filter(a => a.status === 'PENDING' && a.type === 'EMERGENCY');
    const sentToPrint = applications.filter(a => a.status === 'SENT_TO_PRINTER');

    const stats = [
        {
            label: 'Emergency Pending',
            value: pendingEmergency.length,
            description: 'Requires immediate attention',
            color: 'from-orange-500 to-red-600',
            icon: AlertCircle,
            textColor: 'text-red-50'
        },
        {
            label: 'Normal Pending',
            value: pendingNormal.length,
            description: 'Standard processing queue',
            color: 'from-blue-500 to-indigo-600',
            icon: FileText,
            textColor: 'text-blue-50'
        },
        {
            label: 'Ready for Print',
            value: sentToPrint.length,
            description: 'Waiting for printer pickup',
            color: 'from-emerald-500 to-teal-600',
            icon: Printer,
            textColor: 'text-emerald-50'
        },
        {
            label: 'Total Processed',
            value: applications.filter(a => a.status !== 'PENDING').length,
            description: 'Completed or Rejected',
            color: 'from-violet-500 to-purple-600',
            icon: CheckCircle2,
            textColor: 'text-purple-50'
        },
    ];

    return (
        <DashboardLayout>
            {({ activeTab: tab, onTabChange }) => {
                const renderContent = () => {
                    switch (tab) {
                        case 'dashboard':
                            return (
                                <div className="space-y-8 animate-in fade-in duration-500 pb-10">
                                    {/* Welcome Header */}
                                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white shadow-xl">
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                                        <div className="relative z-10">
                                            <h1 className="text-3xl font-bold tracking-tight">Pancard Operations Center</h1>
                                            <p className="mt-2 text-gray-300 max-w-xl">
                                                Manage verification workflows, approve applications, and oversee printer handovers.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                        {stats.map((stat, i) => (
                                            <Card key={i} className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl hover:translate-y-[-2px]">
                                                <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className={`rounded-xl p-3 bg-gradient-to-br ${stat.color} shadow-md`}>
                                                            <stat.icon className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{stat.label}</h3>
                                                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Queues Section */}
                                    <div className="space-y-10">
                                        {/* Priority Queue */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                                        <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        </span>
                                                        Priority Queue
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">Emergency / Tatkal applications awaiting verification</p>
                                                </div>
                                            </div>

                                            <Card className="border-red-100 dark:border-red-900/20 shadow-md">
                                                <div className="p-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-transparent" />
                                                <PanVerificationList
                                                    data={pendingEmergency}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            </Card>
                                        </div>

                                        {/* Standard Queue */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-xl font-bold">Standard Queue</h2>
                                                    <p className="text-sm text-muted-foreground">Normal processing timeline</p>
                                                </div>
                                            </div>
                                            <Card className="shadow-md border-blue-50 dark:border-blue-900/20">
                                                <div className="p-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-transparent" />
                                                {/* Removed height constraint to allow full table view */}
                                                <div className="overflow-auto">
                                                    <PanVerificationList
                                                        data={pendingNormal}
                                                        onStatusChange={handleStatusChange}
                                                    />
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            );

                        case 'normal-pan':
                            return (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 p-6 border border-blue-100 dark:border-blue-900/30">
                                        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Normal Applications</h2>
                                        <p className="text-blue-700 dark:text-blue-300">Standard timeline verification queue. Verify details against Aadhaar.</p>
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
                                    <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-6 border border-red-100 dark:border-red-900/30">
                                        <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
                                            <AlertCircle className="h-6 w-6" />
                                            Emergency Applications
                                        </h2>
                                        <p className="text-red-700 dark:text-red-300">High priority queue. Verify immediately. SLA: 2 Hours.</p>
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
                                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-6 border border-emerald-100 dark:border-emerald-900/30">
                                        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                            <Printer className="h-6 w-6" />
                                            Ready to Print
                                        </h2>
                                        <p className="text-emerald-700 dark:text-emerald-300">Applications approved and waiting for batch printing.</p>
                                    </div>
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


