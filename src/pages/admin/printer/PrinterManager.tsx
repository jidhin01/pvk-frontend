import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, Activity, Settings, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import RoleManagement from '../RoleManagement';
import AdminPrinterOverview from './AdminPrinterOverview';
import GlobalJobQueue from './GlobalJobQueue';
import PrinterWorkforce from './PrinterWorkforce';

export default function PrinterManager() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                    <Printer className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Printer Operations Console</h1>
                    <p className="text-muted-foreground">Manage printing teams, monitor global queues, and optimize workflows.</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                    <TabsTrigger value="overview">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="live-ops">
                        <Activity className="h-4 w-4 mr-2" />
                        Live Operations
                    </TabsTrigger>
                    <TabsTrigger value="workforce">
                        <Users className="h-4 w-4 mr-2" />
                        Teams
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <AdminPrinterOverview />
                </TabsContent>

                <TabsContent value="live-ops" className="space-y-4">
                    <GlobalJobQueue />
                </TabsContent>

                <TabsContent value="workforce" className="space-y-4">
                    <PrinterWorkforce />
                </TabsContent>
            </Tabs>
        </div>
    );
}