import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, MapPin, ShieldCheck } from 'lucide-react';
import PrinterTeams from './PrinterTeams';

export default function PrinterWorkforce() {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h3 className="text-lg font-medium">Production Units</h3>
                <p className="text-sm text-muted-foreground">
                    Manage printing shops and production teams.
                </p>
            </div>

            {/* Section 1: Teams / Shops (High Level Units) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg">Active Shops & Teams</h4>
                </div>
                {/* Reusing the PrinterTeams component for the cards view */}
                <PrinterTeams />
            </div>
        </div>
    );
}
