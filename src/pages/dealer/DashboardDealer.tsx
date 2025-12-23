import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout';
import { CURRENT_DEALER } from '@/data/mockDealerData';
import NewOrder from './NewOrder';
import Tracking from './Tracking';
import Profile from './Profile';
import DashboardHome from './DashboardHome';
import OrdersPage from './OrdersPage';

export default function DealerDashboard() {
    const isApproved = CURRENT_DEALER.isApproved;

    return (
        <DashboardLayout>
            {({ activeTab, onTabChange }) => {
                // Account Review Blocker for sensitive tabs
                if (!isApproved && activeTab === 'new-order') {
                    return (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                            <div className="p-4 rounded-full bg-yellow-100 text-yellow-600">
                                <AlertCircle className="h-12 w-12" />
                            </div>
                            <h2 className="text-2xl font-bold">Account Under Review</h2>
                            <p className="text-muted-foreground max-w-md">
                                Your dealer account is currently pending approval from the administrator.
                                You cannot place new orders until your profile is verified.
                            </p>
                            <Button variant="outline" onClick={() => window.location.href = '/dealer'}>Go to Dashboard</Button>
                        </div>
                    );
                }

                switch (activeTab) {
                    case 'dashboard':
                        return (
                            <>
                                {!isApproved && (
                                    <div className="mb-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-md flex items-start gap-4">
                                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-yellow-900">Account Pending Approval</h3>
                                            <p className="text-sm text-yellow-700">
                                                Your account is currently under review. New order creation is disabled.
                                                Please contact support if this persists &gt; 24hrs.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <DashboardHome onNavigate={onTabChange} />
                            </>
                        );
                    case 'orders':
                        return <OrdersPage />;
                    case 'new-order':
                        return <NewOrder />;
                    case 'tracking':
                        return <Tracking />;
                    case 'profile':
                        return <Profile />;
                    default:
                        return <DashboardHome onNavigate={onTabChange} />
                }
            }}
        </DashboardLayout>
    );
}
