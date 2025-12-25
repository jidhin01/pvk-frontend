import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SealDashboard } from './tabs/SealDashboard';
import { WorkFloorTab } from './tabs/WorkFloorTab';
import { MaterialsTab } from './tabs/MaterialsTab';
import { ArchivesTab } from './tabs/ArchivesTab';
import { EarningsTab } from './tabs/EarningsTab';

const SealTeamLayout = () => {
    return (
        <DashboardLayout>
            {({ activeTab }) => (
                <div className="h-full animate-in fade-in duration-300">
                    {/* MAIN CONTENT AREA - Rendered based on sidebar selection */}

                    {/* Default fallback or Dashboard */}
                    {(activeTab === 'dashboard' || !activeTab) && <SealDashboard />}

                    {activeTab === 'floor' && <WorkFloorTab />}

                    {activeTab === 'materials' && <MaterialsTab />}

                    {activeTab === 'archives' && <ArchivesTab />}

                    {activeTab === 'earnings' && <EarningsTab />}
                </div>
            )}
        </DashboardLayout>
    );
};

export default SealTeamLayout;
