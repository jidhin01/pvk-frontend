import React, { useState, useEffect } from 'react';
import {
    Printer,
    ArrowRight,
    ArrowLeft,
    Upload,
    CheckCircle2,
    Package,
    Layers,
    FileText,
    Check,
    X,
    Info,
    Zap,
    IndianRupee,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CURRENT_DEALER, GoodsType, PrintType } from '@/data/mockMarketplaceData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const STEPS = [
    { id: 1, label: 'Category', icon: Package },
    { id: 2, label: 'Print Type', icon: Printer },
    { id: 3, label: 'Details', icon: FileText }
];

const PRINT_TYPES = [
    {
        id: 'pvc',
        label: 'PVC / Flex Printing',
        desc: 'Banners, hoardings, vehicle wraps. Durable outdoor prints.',
        rate: { dealer: 45, retail: 60 },
        icon: '🎨'
    },
    {
        id: 'laser',
        label: 'Laser / Digital',
        desc: 'Business cards, brochures, short runs with high detail.',
        rate: { dealer: 25, retail: 35 },
        icon: '⚡'
    },
    {
        id: 'offset',
        label: 'Offset Printing',
        desc: 'Books, magazines, bulk prints. Most economical for large quantities.',
        rate: { dealer: 5, retail: 8 },
        icon: '📚'
    },
];

export default function NewOrder() {
    const [step, setStep] = useState(1);
    const [goodsType, setGoodsType] = useState<GoodsType | null>(null);
    const [printType, setPrintType] = useState<PrintType | null>(null);

    const [formData, setFormData] = useState<any>({
        jobName: '',
        width: '',
        height: '',
        quantity: '1'
    });
    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const [priceBreakdown, setPriceBreakdown] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { user } = useAuth();
    const isDealer = user?.role === 'dealer';

    // Price Calculation Logic
    useEffect(() => {
        let price = 0;
        let breakdown = '';

        const width = parseFloat(formData.width) || 0;
        const height = parseFloat(formData.height) || 0;
        const quantity = parseInt(formData.quantity) || 1;

        const selectedPrintType = PRINT_TYPES.find(t => t.id === printType);
        const ratePerSqFt = selectedPrintType
            ? (isDealer ? selectedPrintType.rate.dealer : selectedPrintType.rate.retail)
            : 10;

        if (width > 0 && height > 0) {
            const area = width * height;
            const unitPrice = area * ratePerSqFt;
            price = Math.round(unitPrice * quantity);
            breakdown = `${area.toFixed(1)} sq.ft × ₹${ratePerSqFt}/sq.ft × ${quantity} qty`;
        }

        setEstimatedPrice(price);
        setPriceBreakdown(breakdown);
    }, [formData, printType, isDealer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            toast.success("File uploaded successfully");
        }
    };

    const handleNextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const handleBackStep = () => setStep(prev => Math.max(prev - 1, 1));

    const canProceedToStep2 = !!goodsType;
    const canProceedToStep3 = !!goodsType && !!printType;
    const canPlaceOrder = formData.jobName && estimatedPrice > 0;

    // Credit check only for dealers
    const isCreditExceeded = isDealer && ((CURRENT_DEALER.currentBalance + estimatedPrice) > CURRENT_DEALER.creditLimit);

    const handlePlaceOrder = () => {
        if (!canPlaceOrder) {
            toast.error("Please fill all required fields");
            return;
        }
        if (isCreditExceeded) {
            toast.error("Credit limit exceeded");
            return;
        }

        const orderData = {
            goodsType,
            printType,
            ...formData,
            file: selectedFile,
            estimatedPrice
        };

        console.log("Placing order:", orderData);
        toast.success("Order placed successfully!");
    };

    // --- STEP RENDERERS ---

    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
                <h2 className="text-xl font-bold mb-2">Select Product Category</h2>
                <p className="text-sm text-muted-foreground">Choose the type of goods you want to order</p>
            </div>

            <RadioGroup
                value={goodsType || ""}
                onValueChange={(val) => setGoodsType(val as GoodsType)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
                {/* Finished Goods */}
                <label
                    className={cn(
                        "relative flex flex-col gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all",
                        "hover:border-primary/50 hover:shadow-md",
                        goodsType === 'finished'
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border bg-card"
                    )}
                >
                    <RadioGroupItem value="finished" className="sr-only" />
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-3 rounded-xl transition-colors",
                            goodsType === 'finished' ? "bg-primary text-white" : "bg-blue-100 text-blue-600"
                        )}>
                            <Package className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-lg">Finished Goods</span>
                                {goodsType === 'finished' && (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Complete products ready for use. Includes cutting, binding, lamination, and packaging.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Posters</span>
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Banners</span>
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Standees</span>
                    </div>
                </label>

                {/* Unfinished Goods */}
                <label
                    className={cn(
                        "relative flex flex-col gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all",
                        "hover:border-primary/50 hover:shadow-md",
                        goodsType === 'unfinished'
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border bg-card"
                    )}
                >
                    <RadioGroupItem value="unfinished" className="sr-only" />
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-3 rounded-xl transition-colors",
                            goodsType === 'unfinished' ? "bg-primary text-white" : "bg-purple-100 text-purple-600"
                        )}>
                            <Layers className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-lg">Unfinished Goods</span>
                                {goodsType === 'unfinished' && (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Raw prints on rolls or sheets. No post-processing included. You finish it yourself.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Roll Prints</span>
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Sheets</span>
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Bulk Media</span>
                    </div>
                </label>
            </RadioGroup>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
                <h2 className="text-xl font-bold mb-2">Select Print Technology</h2>
                <p className="text-sm text-muted-foreground">
                    Choose the best printing method for your {goodsType} order
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {PRINT_TYPES.map((type) => (
                    <Card
                        key={type.id}
                        className={cn(
                            "cursor-pointer transition-all hover:shadow-lg relative overflow-hidden group",
                            printType === type.id
                                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                : "hover:border-primary/50"
                        )}
                        onClick={() => setPrintType(type.id as PrintType)}
                    >
                        {printType === type.id && (
                            <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1 rounded-full">
                                <Check className="h-3 w-3" />
                            </div>
                        )}
                        <CardContent className="pt-6 pb-5 text-center">
                            <div className="text-4xl mb-3">{type.icon}</div>
                            <h3 className="font-semibold mb-2">{type.label}</h3>
                            <p className="text-xs text-muted-foreground mb-4 min-h-[40px]">
                                {type.desc}
                            </p>
                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-primary">
                                <IndianRupee className="h-3.5 w-3.5" />
                                {isDealer ? type.rate.dealer : type.rate.retail}
                                <span className="text-xs text-muted-foreground font-normal">/sq.ft</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="text-center lg:text-left">
                        <h2 className="text-xl font-bold mb-1">Order Details</h2>
                        <p className="text-sm text-muted-foreground">Enter specifications for your print job</p>
                    </div>

                    <Card>
                        <CardContent className="pt-6 space-y-5">
                            {/* Job Name */}
                            <div className="space-y-2">
                                <Label htmlFor="jobName" className="text-sm font-medium">
                                    Job Name / Reference <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="jobName"
                                    name="jobName"
                                    placeholder="e.g. Summer Campaign Banner"
                                    value={formData.jobName}
                                    onChange={handleInputChange}
                                    className="h-10"
                                />
                            </div>

                            {/* Dimensions */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="width" className="text-sm font-medium">
                                        Width (ft) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="width"
                                        name="width"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        step="0.5"
                                        value={formData.width}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height" className="text-sm font-medium">
                                        Height (ft) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="height"
                                        name="height"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        step="0.5"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity" className="text-sm font-medium">
                                        Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    Upload Design File
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>PDF, CDR, AI, EPS, JPG, PNG supported</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>

                                {!selectedFile ? (
                                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors relative group cursor-pointer">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            accept=".pdf,.cdr,.ai,.eps,.jpg,.png"
                                        />
                                        <div className="p-2.5 bg-primary/10 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-sm font-medium">Drop file or click to browse</p>
                                        <p className="text-xs text-muted-foreground">Max 50MB</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 border rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                                <FileText className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedFile(null)}
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Order Summary */}
                <div className="space-y-4">
                    <Card className="sticky top-4">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category</span>
                                    <span className="font-medium capitalize">{goodsType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Print Type</span>
                                    <span className="font-medium uppercase">{printType}</span>
                                </div>
                                {formData.width && formData.height && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Size</span>
                                        <span className="font-medium">{formData.width} × {formData.height} ft</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantity</span>
                                    <span className="font-medium">{formData.quantity || 1}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Estimated Total</span>
                                    <span className="text-2xl font-bold text-primary flex items-center">
                                        <IndianRupee className="h-5 w-5" />
                                        {estimatedPrice.toLocaleString()}
                                    </span>
                                </div>
                                {priceBreakdown && (
                                    <p className="text-xs text-muted-foreground mt-1 text-right">{priceBreakdown}</p>
                                )}
                            </div>

                            {/* Credit Status - Only for Dealers */}
                            {isDealer && estimatedPrice > 0 && (
                                <div className={cn(
                                    "p-3 rounded-lg text-xs font-medium flex items-start gap-2",
                                    isCreditExceeded
                                        ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                                        : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                                )}>
                                    {isCreditExceeded
                                        ? <AlertCircle className="h-4 w-4 shrink-0" />
                                        : <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    }
                                    <span>
                                        {isCreditExceeded
                                            ? `Credit exceeded by ₹${((CURRENT_DEALER.currentBalance + estimatedPrice) - CURRENT_DEALER.creditLimit).toLocaleString()}`
                                            : "Within credit limit"
                                        }
                                    </span>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={(isDealer && isCreditExceeded) || !canPlaceOrder}
                            >
                                Place Order
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">New Print Order</h1>
                    <p className="text-sm text-muted-foreground">Create a new printing service request</p>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    {STEPS.map((s, index) => {
                        const isActive = step >= s.id;
                        const isCompleted = step > s.id;
                        const isCurrent = step === s.id;
                        const StepIcon = s.icon;

                        return (
                            <React.Fragment key={s.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (s.id < step) setStep(s.id);
                                        else if (s.id === 2 && canProceedToStep2) setStep(2);
                                        else if (s.id === 3 && canProceedToStep3) setStep(3);
                                    }}
                                    className={cn(
                                        "flex flex-col items-center gap-2 transition-all",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2",
                                        isCurrent && "scale-105"
                                    )}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                                        isCompleted
                                            ? "bg-primary border-primary text-white"
                                            : isActive
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-muted-foreground/30 text-muted-foreground"
                                    )}>
                                        {isCompleted
                                            ? <Check className="h-5 w-5" />
                                            : <StepIcon className="h-5 w-5" />
                                        }
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {s.label}
                                    </span>
                                </button>

                                {index < STEPS.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-0.5 mx-2 rounded-full transition-colors",
                                        step > s.id ? "bg-primary" : "bg-muted"
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                    variant="outline"
                    onClick={handleBackStep}
                    disabled={step === 1}
                    className={cn("gap-2", step === 1 && "invisible")}
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                {step < 3 && (
                    <Button
                        onClick={handleNextStep}
                        disabled={(step === 1 && !canProceedToStep2) || (step === 2 && !canProceedToStep3)}
                        className="gap-2"
                    >
                        Next <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
