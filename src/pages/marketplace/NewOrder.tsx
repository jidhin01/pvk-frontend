
import React, { useState, useEffect } from 'react';
import {
    Printer,
    CreditCard,
    Stamp,
    AlertCircle,
    ArrowRight,
    Upload,
    CheckCircle2,
    Package,
    Layers,
    FileText,
    Check,
    X,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CURRENT_DEALER, GoodsType, PrintType } from '@/data/mockMarketplaceData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import SealWizardLayout from './services/seals/SealWizardLayout';
import { useAuth } from '@/contexts/AuthContext';

const STEPS = [
    { id: 1, label: 'Goods Type' },
    { id: 2, label: 'Technology' },
    { id: 3, label: 'Details' }
];

export default function NewOrder() {
    const [step, setStep] = useState(1);
    const [goodsType, setGoodsType] = useState<GoodsType | null>(null);
    const [printType, setPrintType] = useState<PrintType | null>(null);
    const [selectedService, setSelectedService] = useState<'PRINT' | 'PAN' | 'SEAL' | null>(null);

    const [formData, setFormData] = useState<any>({});
    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const [priceBreakdown, setPriceBreakdown] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSealConfigComplete, setIsSealConfigComplete] = useState(false);

    const { user } = useAuth();
    const isDealer = user?.role === 'dealer';

    // Price Calculation Logic
    useEffect(() => {
        let price = 0;
        let breakdown = '';

        if (selectedService === 'PRINT') {
            const width = parseFloat(formData.width) || 0;
            const height = parseFloat(formData.height) || 0;
            const quantity = parseInt(formData.quantity) || 1;

            // Mock Rates
            // Base rates are Retail rates. Dealer rates are discounted.
            // Let's assume the previous rates were Dealer rates.
            // Dealer sqft: pve=45, laser=25, offset=5 (Previous)
            // Retail sqft: pvc=60, laser=35, offset=8 (Hypothetical increase for retail)

            let ratePerSqFt = isDealer ? 10 : 15;
            if (printType === 'pvc') ratePerSqFt = isDealer ? 45 : 60;
            if (printType === 'laser') ratePerSqFt = isDealer ? 25 : 35;
            if (printType === 'offset') ratePerSqFt = isDealer ? 5 : 8;

            if (width > 0 && height > 0) {
                const area = width * height;
                const unitPrice = area * ratePerSqFt;
                price = Math.round(unitPrice * quantity);

                // Detailed Breakdown
                breakdown = `${area.toFixed(1)} sq.ft x ₹${ratePerSqFt}/sq.ft x ${quantity} qty`;
            }
        } else if (selectedService === 'PAN') {
            price = isDealer ? 120 : 150;
            breakdown = isDealer ? 'Fixed Dealer Rate' : 'Standard Service Fee';
        } else if (selectedService === 'SEAL') {
            // Price handling now delegated to Wizard callback for updates, 
            // but we keep a base fallback here if needed, or rely on the callback.
            // The callback `onPriceUpdate` will override this.
            if (estimatedPrice === 0) {
                price = isDealer ? 200 : 250; // Default fallback
                breakdown = 'Estimated Base Rate';
            } else {
                return; // Allow wizard to control
            }
        }
        setEstimatedPrice(price);
        setPriceBreakdown(breakdown);
    }, [formData, selectedService, printType, isDealer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            toast.success("File uploaded successfully");
        }
    };

    const handleNextStep = () => setStep(prev => prev + 1);
    const handleBackStep = () => setStep(prev => prev - 1);

    // Credit check only for dealers
    const isCreditExceeded = isDealer && ((CURRENT_DEALER.currentBalance + estimatedPrice) > CURRENT_DEALER.creditLimit);

    // --- WIZARD STEPS ---

    // STEP 1: GOODS TYPE
    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">What are you ordering?</h2>
                <p className="text-muted-foreground">Select the category of goods to proceed.</p>
            </div>

            <RadioGroup
                defaultValue={goodsType || ""}
                onValueChange={(val) => {
                    setGoodsType(val as GoodsType);
                    setSelectedService('PRINT');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className={cn(
                    "relative flex items-start space-x-4 space-y-0 rounded-xl border-2 p-6 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/40",
                    goodsType === 'finished' ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                )} onClick={() => { setGoodsType('finished'); setSelectedService('PRINT'); }}>
                    <RadioGroupItem value="finished" id="finished" className="sr-only" />
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <Package className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="finished" className="text-lg font-semibold cursor-pointer">Finished Goods</Label>
                            {goodsType === 'finished' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="text-sm text-muted-foreground leading-snug">
                            Complete products ready for sale. Includes cutting, binding, and packaging.
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "relative flex items-start space-x-4 space-y-0 rounded-xl border-2 p-6 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/40",
                    goodsType === 'unfinished' ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                )} onClick={() => { setGoodsType('unfinished'); setSelectedService('PRINT'); }}>
                    <RadioGroupItem value="unfinished" id="unfinished" className="sr-only" />
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="unfinished" className="text-lg font-semibold cursor-pointer">Unfinished Goods</Label>
                            {goodsType === 'unfinished' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="text-sm text-muted-foreground leading-snug">
                            Raw prints on rolls or sheets. No post-processing included.
                        </div>
                    </div>
                </div>
            </RadioGroup>



            <div className="mt-10 pt-6 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</p>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => { setSelectedService('PAN'); setStep(3); }}>
                        <CreditCard className="h-4 w-4 text-purple-600" /> New PAN Card
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => { setSelectedService('SEAL'); setStep(3); }}>
                        <Stamp className="h-4 w-4 text-orange-600" /> Rubber Seal
                    </Button>
                </div>
            </div>
        </div>
    );

    // STEP 2: PRINT TYPE
    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">Select Technology</h2>
                <p className="text-muted-foreground">Optimal printing method for your {goodsType} order.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'pvc', label: 'PVC Printing', desc: 'Durable, waterproof plastic cards.', icon: CreditCard },
                    { id: 'laser', label: 'Laser / Digital', desc: 'Best for short runs & high detail.', icon: Printer },
                    { id: 'offset', label: 'Offset Printing', desc: 'Economical for large bulk quantities.', icon: FileText },
                ].map((type) => (
                    <Card
                        key={type.id}
                        className={cn(
                            "cursor-pointer transition-all hover:shadow-md relative overflow-hidden group",
                            printType === type.id
                                ? "border-primary ring-2 ring-primary bg-primary/5"
                                : "hover:border-primary/50"
                        )}
                        onClick={() => setPrintType(type.id as PrintType)}
                    >
                        {printType === type.id && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 rounded-bl-lg">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                        <CardHeader className="text-center pb-4 pt-6">
                            <div className={cn("mx-auto p-3 rounded-full mb-2 transition-colors", printType === type.id ? "bg-primary/20" : "bg-muted")}>
                                <type.icon className={cn("h-6 w-6", printType === type.id ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                            </div>
                            <CardTitle className="text-base">{type.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-sm text-muted-foreground pb-6 px-4">
                            {type.desc}
                        </CardContent>
                    </Card>
                ))}
            </div>


        </div>
    );

    // STEP 3: DETAILS FORM
    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Order Details</h2>
                        <p className="text-muted-foreground">Fill in the specifications for your job.</p>
                    </div>

                    <Card>
                        <CardContent className="pt-6 space-y-6">
                            {selectedService === 'PRINT' && (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-foreground/80">Job Name / Reference</Label>
                                        <Input name="jobName" placeholder="e.g. Summer Campaign Banner" className="bg-muted/30" onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Width (ft)</Label>
                                            <Input type="number" name="width" onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Height (ft)</Label>
                                            <Input type="number" name="height" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label>Quantity</Label>
                                            <span className="text-xs text-muted-foreground">Minimum 1</span>
                                        </div>
                                        <Input type="number" name="quantity" defaultValue="1" min="1" onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}

                            {selectedService === 'PAN' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Applicant Name <span className="text-red-500">*</span></Label>
                                        <Input name="applicantName" placeholder="Enter applicant name" onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Name as per Aadhaar <span className="text-red-500">*</span></Label>
                                        <Input name="nameAsPerAadhaar" placeholder="Exact name on Aadhaar card" onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Aadhaar Number <span className="text-red-500">*</span></Label>
                                        <Input name="aadhaarNumber" placeholder="12-digit Aadhaar number" maxLength={12} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Birth <span className="text-red-500">*</span></Label>
                                        <Input name="dob" type="date" onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Father's Name <span className="text-red-500">*</span></Label>
                                        <Input name="fatherName" placeholder="Father's full name" onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}

                            {selectedService === 'SEAL' && (
                                <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg text-primary mb-1">Seal Design Ready</h3>
                                    <p className="text-sm text-primary/80 mb-6 max-w-xs">
                                        Your seal configuration has been saved. You can now proceed to place the order.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSealConfigComplete(false)}
                                        className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                                    >
                                        Edit Design
                                    </Button>
                                </div>
                            )}

                            {/* ENHANCED FILE UPLOAD */}
                            <div className="space-y-3 pt-2">
                                <Label className="flex items-center gap-2">
                                    Upload Design / Reference
                                    <TooltipProvider>
                                        <Tooltip><TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent>PDF, CDR, AI, EPS supported.</TooltipContent></Tooltip>
                                    </TooltipProvider>
                                </Label>

                                {selectedService === 'SEAL' && <p className="text-xs text-muted-foreground">Upload a logo or specific design if required.</p>}

                                {!selectedFile ? (
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors relative group">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.cdr,.ai,.eps,.jpg,.png" />
                                        <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <p className="text-sm font-medium">Click to browse or drag file here</p>
                                        <p className="text-xs text-muted-foreground mt-1">Single file up to 50MB</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-4 border rounded-xl bg-blue-50/50 border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-blue-900 truncate max-w-[200px]">{selectedFile.name}</span>
                                                <span className="text-xs text-blue-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Summary & Pricing */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card className="bg-muted/20 border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-muted-foreground">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedService === 'PRINT' && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-medium capitalize">{goodsType || 'Print'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Technology</span>
                                        <span className="font-medium capitalize">{printType?.toUpperCase() || '-'}</span>
                                    </div>
                                </>
                            )}

                            {selectedService === 'SEAL' && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-medium capitalize">Seal</span>
                                    </div>
                                </>
                            )}


                            <div className="pt-4 border-t flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total Cost</span>
                                    <span className="text-xl font-bold text-primary">₹{estimatedPrice}</span>
                                </div>
                                {priceBreakdown && (
                                    <p className="text-right text-xs text-muted-foreground">{priceBreakdown}</p>
                                )}
                            </div>

                            {/* Credit Status - Only for Dealers */}
                            {isDealer && (
                                <div className={cn(
                                    "mt-4 p-3 rounded-lg text-xs font-medium flex items-start gap-2",
                                    isCreditExceeded ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                                )}>
                                    {isCreditExceeded ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
                                    <div>
                                        {isCreditExceeded
                                            ? `Credit Limit Exceeded by ₹${((CURRENT_DEALER.currentBalance + estimatedPrice) - CURRENT_DEALER.creditLimit).toLocaleString()}`
                                            : `Credit Approved. Balance available.`
                                        }
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" disabled={(isDealer && isCreditExceeded) || estimatedPrice === 0 || (!formData.jobName && selectedService === 'PRINT') || (selectedService === 'SEAL' && !isSealConfigComplete)}>
                                Place Order
                            </Button>
                        </CardFooter>
                    </Card>


                </div>

            </div>
        </div>
    );

    // --- RENDER ---

    // SPECIAL FULL SCREEN MODE FOR SEAL STUDIO
    if (step === 3 && selectedService === 'SEAL' && !isSealConfigComplete) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in duration-300">
                <SealWizardLayout
                    onConfigurationComplete={(config) => {
                        setFormData(prev => ({
                            ...prev,
                            sealConfig: config,
                            sealType: config.type,
                            sealTemplate: config.template,
                            sealContent: config.content.join('\n'),
                            sealColor: config.color
                        }));
                        setIsSealConfigComplete(true);
                    }}
                    onPriceUpdate={(price) => {
                        setEstimatedPrice(price);
                        setPriceBreakdown('Base + Template Modifier');
                    }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8">
            {/* Top Navigation & Title */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
                    <p className="text-muted-foreground">Create a new service request</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleBackStep}
                        disabled={step === 1}
                        className={cn("gap-2 border-primary/20", step > 1 ? "opacity-100" : "opacity-0 pointer-events-none")}
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleNextStep}
                        disabled={
                            (step === 1 && !goodsType) ||
                            (step === 2 && !printType) ||
                            step === 3 // Hide Next on last step
                        }
                        className={cn("gap-2 shadow-lg shadow-primary/20", step === 3 ? "hidden" : "")}
                    >
                        Next Step <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Visual Stepper */}
            <div className="mb-10 max-w-4xl mx-auto px-4">
                <div className="relative flex justify-between items-center">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
                    <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 transition-all duration-500"
                        style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                    />

                    {STEPS.map((s) => {
                        const isActive = step >= s.id;
                        const isCompleted = step > s.id;
                        const isClickable = step > s.id || (s.id < step); // Can go back, or forward if completed (conceptually)

                        return (
                            <div
                                key={s.id}
                                className={cn(
                                    "flex flex-col items-center gap-3 bg-background px-4 py-2 rounded-xl border border-transparent transition-all duration-300",
                                    "cursor-pointer hover:bg-muted/50",
                                    step === s.id && "scale-110"
                                )}
                                onClick={() => {
                                    // Simple logic: Allow going back to any previous step. 
                                    // Allow going forward only if we are basically just reviewing (not implemented strictly here, so just limiting to current flow)
                                    // For now, let's allow clicking any step <= current step + 1 logic if strictly needed, 
                                    // but user asked for "clickable". 
                                    // SAFEST: Allow jumping to any step that we have data for?
                                    // EASIER UX: Just allow setStep(s.id) but maybe validate?
                                    // Let's allow jumping to previous steps always.
                                    // Jumping forward: Only if we have necessary data.

                                    if (s.id < step) {
                                        setStep(s.id);
                                    } else if (s.id === step) {
                                        // Do nothing
                                    } else {
                                        // Trying to go forward
                                        // Only allow if we are on step s.id - 1 and have data
                                        const canGoTo2 = goodsType;
                                        const canGoTo3 = goodsType && printType;

                                        if (s.id === 2 && canGoTo2) setStep(2);
                                        if (s.id === 3 && canGoTo3) setStep(3);
                                    }
                                }}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                                    isActive ? "border-primary bg-primary text-primary-foreground shadow-primary/25" : "border-muted-foreground/30 bg-background text-muted-foreground",
                                    isCompleted ? "bg-primary border-primary" : ""
                                )}>
                                    {isCompleted ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{s.id}</span>}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium transition-colors whitespace-nowrap px-2 py-0.5 rounded-md",
                                    isActive ? "text-foreground font-semibold bg-accent/50" : "text-muted-foreground"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    );
}
