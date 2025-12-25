import React from 'react';
import StockDashboard from '@/pages/inventory/StockDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AdminOperations() {
    return (
        <div className="space-y-4">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Admin Oversight Mode</AlertTitle>
                <AlertDescription>
                    You have full access to perform operational tasks (Transfer, Issue, Receive).
                    Please use these functions responsibly as they affect live inventory records.
                </AlertDescription>
            </Alert>

            {/* Reuse the existing StockDashboard directly */}
            <div className="border rounded-lg bg-background p-4 shadow-sm">
                <StockDashboard role="ADMIN" renderLayout={false} />
            </div>
        </div>
    );
}
