import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompletedJobs = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Completed Jobs</h1>
                <p className="text-muted-foreground">View history of completed print jobs.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No completed jobs history found.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompletedJobs;
