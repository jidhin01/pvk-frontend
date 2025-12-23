import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, PackageCheck, Undo2, Plus } from 'lucide-react';

const DailyOperations = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Operations</h1>
                    <p className="text-muted-foreground">Manage items taken for delivery and track status.</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Items
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Taken</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">For today's delivery</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <PackageCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales Return</CardTitle>
                        <Undo2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Items returned</p>
                    </CardContent>
                </Card>
            </div>

            {/* Items List */}
            <Card>
                <CardHeader>
                    <CardTitle>Items Taken for Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No items taken for delivery today.
                    </div>
                </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        Complete your deliveries to see the daily summary.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyOperations;
