import React from 'react';
import { DashboardLayout } from '@/components/layout';
import DashboardOverview from './DashboardOverview';
import NewOrders from './NewOrders';
import Processing from './Processing';
import Completed from './Completed';

const SealDashboard = () => {
    return (
        <DashboardLayout>
            {({ activeTab }) => {
                switch (activeTab) {
                    case 'dashboard':
                        return <DashboardOverview />;
                    case 'new-orders':
                        return <NewOrders />;
                    case 'processing':
                        return <Processing />;
                    case 'completed':
                        return <Completed />;
                    default:
                        return <DashboardOverview />;
                }
            }}
        </DashboardLayout>
    );
};

export default SealDashboard;
