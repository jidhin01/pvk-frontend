import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PendingJobs = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pending Jobs</h1>
                <p className="text-muted-foreground">Manage and process new print requests.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Print Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No pending jobs available at the moment.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PendingJobs;
