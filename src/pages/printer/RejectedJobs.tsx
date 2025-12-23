import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RejectedJobs = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Rejected Jobs</h1>
                <p className="text-muted-foreground">Review rejected jobs and reasons.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rejections</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No rejected jobs found.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RejectedJobs;
