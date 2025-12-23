import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DashboardOverview from './DashboardOverview';
import NormalPan from './NormalPan';
import EmergencyPan from './EmergencyPan';
import SendToPrint from './SendToPrint';

const PanCardDashboard = () => {
    return (
        <DashboardLayout>
            {({ activeTab }) => {
                switch (activeTab) {
                    case 'dashboard':
                        return <DashboardOverview />;
                    case 'normal-pan':
                        return <NormalPan />;
                    case 'emergency-pan':
                        return <EmergencyPan />;
                    case 'send-to-print':
                        return <SendToPrint />;
                    default:
                        return <DashboardOverview />;
                }
            }}
        </DashboardLayout>
    );
};

export default PanCardDashboard;
