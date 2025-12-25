import React from 'react';
import { CreditCard, ArrowLeft, Clock, FileText, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PanCardForm from './services/PanCardForm';

interface NewPanCardProps {
    onNavigate?: (tab: string) => void;
}

export default function NewPanCard({ onNavigate }: NewPanCardProps) {
    const handleBack = () => {
        if (onNavigate) {
            onNavigate('dashboard');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Hero Header - Matching Project Style */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background px-6 py-6 border border-purple-500/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                                New PAN Card Application
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Apply for a new PAN card with fast processing and doorstep delivery.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        className="gap-2 hover:bg-background"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
                    </Button>
                </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Fast Processing</h3>
                                <p className="text-sm text-blue-700/80 dark:text-blue-300/80 mt-1">Normal: 7-10 days<br />Emergency: 2-3 days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Required Documents</h3>
                                <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mt-1">Aadhaar (Front & Back)<br />Passport Photo</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Competitive Pricing</h3>
                                <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-1">Normal: ₹107<br />Emergency: ₹250</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Form Section */}
            <div className="mt-6">
                <PanCardForm onBack={handleBack} />
            </div>
        </div>
    );
}
