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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/10 border-blue-100 dark:border-blue-900/30 transition-all hover:shadow-md hover:-translate-y-1">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl shadow-sm">
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100">Fast Processing</h3>
                                <div className="mt-2 space-y-1 text-sm text-blue-700/80 dark:text-blue-300/80">
                                    <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Normal: 7-10 days</p>
                                    <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Emergency: 2-3 days</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 transition-all hover:shadow-md hover:-translate-y-1">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl shadow-sm">
                                <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Required Documents</h3>
                                <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mt-2 leading-relaxed">
                                    Ensure you have clear scans of <strong>Aadhaar (Front & Back)</strong> and a recent <strong>Passport Photo</strong>.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 border-amber-100 dark:border-amber-900/30 transition-all hover:shadow-md hover:-translate-y-1">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl shadow-sm">
                                <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 dark:text-amber-100">Competitive Pricing</h3>
                                <div className="mt-2 flex items-center gap-4 text-sm font-medium">
                                    <div className="px-2 py-1 bg-amber-100/50 rounded text-amber-800 dark:text-amber-200">Normal: ₹107</div>
                                    <div className="px-2 py-1 bg-red-100/50 rounded text-red-800 dark:text-red-200">Emergency: ₹250</div>
                                </div>
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
