import React, { useState } from 'react';
import { Stamp, ArrowLeft, CheckCircle2, Palette, Clock, Package, Edit3, ArrowRight, Check, Sparkles, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { SEAL_TYPES, SEAL_TEMPLATES, StampBlock } from '@/data/mockSealCatalog';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import SealStudioLayout from './services/seals/studio/SealStudioLayout';
import Step3_LivePreview from './services/seals/Step3_LivePreview';

interface NewRubberSealProps {
    onNavigate?: (tab: string) => void;
}

export default function NewRubberSeal({ onNavigate }: NewRubberSealProps) {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [designData, setDesignData] = useState<{ blocks: StampBlock[], previewImage?: string } | null>(null);

    // Derived state for price
    const currentType = SEAL_TYPES.find(t => t.id === selectedType);
    const currentTemplate = SEAL_TEMPLATES.find(t => t.id === selectedTemplate);
    const estimatedPrice = (currentType?.basePrice || 0) + (currentTemplate?.priceModifier || 0);

    const { user } = useAuth();
    const isDealer = user?.role === 'dealer';

    const handleBack = () => {
        if (onNavigate) {
            onNavigate('dashboard');
        }
    };

    const handlePlaceOrder = () => {
        // Here we would submit: { type: selectedType, template: selectedTemplate, design: designData }
        toast.success("Rubber Seal order placed successfully!");
        if (onNavigate) {
            onNavigate('orders');
        }
    };

    const nextStep = () => {
        if (step === 1 && selectedType) setStep(2);
        else if (step === 2 && selectedTemplate) setStep(3);
        else if (step === 3 && designData) setStep(4);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const steps = [
        { id: 1, label: 'Select Type' },
        { id: 2, label: 'Choose Template' },
        { id: 3, label: 'Customize Design' },
        { id: 4, label: 'Review & Order' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Hero Header */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-background px-6 py-6 border border-orange-500/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <Stamp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                                Rubber Seal Studio
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Design and order your custom rubber seal in 4 easy steps.
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

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 py-4 overflow-x-auto">
                {steps.map((s, idx) => (
                    <React.Fragment key={s.id}>
                        <div className="flex items-center gap-2 min-w-fit">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                                step === s.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110" :
                                    step > s.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                                {step > s.id ? <Check className="h-5 w-5" /> : s.id}
                            </div>
                            <span className={cn(
                                "hidden md:block text-sm font-medium transition-colors",
                                step >= s.id ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {s.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && <div className="w-12 h-0.5 bg-muted hidden sm:block" />}
                    </React.Fragment>
                ))}
            </div>

            {/* MAIN CONTENT AREA */}

            {/* SPECIAL CASE: Step 3 (Design Studio) takes full width */}
            {step === 3 && selectedTemplate ? (
                <div className="h-[800px] border rounded-xl overflow-hidden shadow-2xl bg-slate-50 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SealStudioLayout
                        template={SEAL_TEMPLATES.find(t => t.id === selectedTemplate)!}
                        initialBlocks={designData?.blocks}
                        color="black" // Default color
                        onBack={prevStep}
                        onComplete={(data) => {
                            setDesignData(data);
                            setStep(4);
                        }}
                    />
                </div>
            ) : (
                /* Standard Grid Layout for Steps 1, 2, 4 */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Step 1: Select Type */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Select Seal Type</h2>
                                    <p className="text-muted-foreground text-sm">Choose the type of rubber seal you need.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {SEAL_TYPES.map((type) => (
                                        <Card
                                            key={type.id}
                                            className={cn(
                                                "cursor-pointer transition-all hover:shadow-md relative overflow-hidden group",
                                                selectedType === type.id
                                                    ? "border-primary ring-2 ring-primary bg-primary/5"
                                                    : "hover:border-primary/50"
                                            )}
                                            onClick={() => setSelectedType(type.id)}
                                        >
                                            {selectedType === type.id && (
                                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 rounded-bl-lg">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                            <CardContent className="pt-6 pb-4 text-center">
                                                <div className={cn(
                                                    "mx-auto p-4 rounded-full mb-3 transition-colors w-fit",
                                                    selectedType === type.id ? "bg-primary/20" : "bg-muted"
                                                )}>
                                                    <Stamp className={cn(
                                                        "h-8 w-8",
                                                        selectedType === type.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                                    )} />
                                                </div>
                                                <h3 className="font-semibold text-base mb-1">{type.name}</h3>
                                                <p className="text-xs text-muted-foreground mb-3">{type.description}</p>
                                                <span className="text-lg font-bold text-primary">₹{type.basePrice}</span>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Select Template */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Choose Template</h2>
                                    <p className="text-muted-foreground text-sm">Select a template shape for your seal.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {SEAL_TEMPLATES.map((template) => (
                                        <Card
                                            key={template.id}
                                            className={cn(
                                                "cursor-pointer transition-all hover:shadow-md relative overflow-hidden group",
                                                selectedTemplate === template.id
                                                    ? "border-primary ring-2 ring-primary bg-primary/5"
                                                    : "hover:border-primary/50"
                                            )}
                                            onClick={() => setSelectedTemplate(template.id)}
                                        >
                                            {selectedTemplate === template.id && (
                                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 rounded-bl-lg">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                            <CardContent className="pt-6 pb-4 text-center">
                                                <div className={cn(
                                                    "mx-auto mb-3 transition-colors flex items-center justify-center",
                                                    template.shape === 'ROUND' ? "w-20 h-20 rounded-full border-4" : "w-24 h-16 rounded-lg border-4",
                                                    selectedTemplate === template.id ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-muted/30"
                                                )}>
                                                    <span className="text-xs font-medium text-muted-foreground">{template.shape}</span>
                                                </div>
                                                <h3 className="font-semibold text-base mb-1">{template.name}</h3>
                                                <p className="text-xs text-muted-foreground mb-2">{template.maxLines} text lines</p>
                                                <span className="text-sm font-medium text-primary">+₹{template.priceModifier}</span>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review & Order */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Review Your Order</h2>
                                    <p className="text-muted-foreground text-sm">Confirm your seal configuration before placing the order.</p>
                                </div>

                                <Card className="overflow-hidden border-primary/20">
                                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Design Ready</CardTitle>
                                                <p className="text-sm text-muted-foreground mt-0.5">Your seal design has been captured.</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        {/* Seal Preview */}
                                        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center p-8 overflow-hidden relative">
                                            {designData && currentTemplate ? (
                                                <div className="scale-75 shadow-xl rounded-lg overflow-hidden bg-white">
                                                    <Step3_LivePreview
                                                        template={currentTemplate!}
                                                        blocks={designData!.blocks}
                                                        color="#000000"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                                                        <LayoutTemplate className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-foreground mb-1">Custom Design Saved</h3>
                                                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                                                        We have received your custom layout configuration ({designData?.blocks.length || 0} elements).
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Configuration Details */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium text-muted-foreground">Seal Type</span>
                                                </div>
                                                <p className="text-lg font-semibold capitalize">
                                                    {SEAL_TYPES.find(t => t.id === selectedType)?.name || '-'}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium text-muted-foreground">Template</span>
                                                </div>
                                                <p className="text-lg font-semibold capitalize">
                                                    {SEAL_TEMPLATES.find(t => t.id === selectedTemplate)?.name || '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full h-12 dashed border-2"
                                            onClick={() => setStep(3)}
                                        >
                                            <Edit3 className="mr-2 h-4 w-4" /> Edit Design
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Order Summary (Sidebar) */}
                    <div className="space-y-4">
                        <Card className="border-border/50 shadow-sm sticky top-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Seal Type</span>
                                    <span className="font-medium capitalize">
                                        {SEAL_TYPES.find(t => t.id === selectedType)?.name || 'Not selected'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Template</span>
                                    <span className="font-medium capitalize">
                                        {SEAL_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Not selected'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Design Elements</span>
                                    <span className="font-medium capitalize">
                                        {designData ? `${designData.blocks.length} Items` : '-'}
                                    </span>
                                </div>

                                <div className="pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-primary">₹{estimatedPrice}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                                {step < 4 ? (
                                    <>
                                        <Button
                                            className="w-full shadow-lg shadow-primary/20"
                                            size="lg"
                                            onClick={nextStep}
                                            disabled={
                                                (step === 1 && !selectedType) ||
                                                (step === 2 && !selectedTemplate)
                                            }
                                        >
                                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        {step > 1 && (
                                            <Button variant="ghost" className="w-full" onClick={prevStep}>
                                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            className="w-full shadow-lg shadow-primary/20"
                                            size="lg"
                                            onClick={handlePlaceOrder}
                                        >
                                            Place Order
                                        </Button>
                                        <Button variant="ghost" className="w-full" onClick={prevStep}>
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Delivery</h3>
                                        <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">3-5 business days</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
