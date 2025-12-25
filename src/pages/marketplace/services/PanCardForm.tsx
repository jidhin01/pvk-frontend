import React, { useState } from 'react';
import {
    CreditCard,
    Upload,
    Zap,
    Clock,
    ArrowLeft,
    CheckCircle2,
    FileText,
    User,
    Phone,
    Calendar,
    ShieldCheck,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { addPancardOrder } from '@/data/mockPancardData';

// Mock function to simulate API call
const submitPanOrder = async (orderData: any) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            addPancardOrder({
                dealerId: '4', // Default to dealer for now
                dealerName: 'Dealer', // Default
                applicantName: orderData.details.applicantName,
                fatherName: orderData.details.fatherName,
                dob: orderData.details.dob,
                aadharNumber: orderData.details.aadhaarNumber,
                aadharProofUrl: 'mock-url-to-file', // Simulation
            });
            resolve(true);
        }, 1500);
    });
};

interface PanCardFormProps {
    onBack: () => void;
}

export default function PanCardForm({ onBack }: PanCardFormProps) {
    const [subType, setSubType] = useState<'NORMAL' | 'EMERGENCY'>('NORMAL');
    const [formData, setFormData] = useState({
        applicantName: '',
        nameAsPerAadhaar: '',
        aadhaarNumber: '',
        dob: '',
        fatherName: '',
        mobile: '',
    });
    const [files, setFiles] = useState<{
        aadhaarFront: File | null;
        aadhaarBack: File | null;
        photo: File | null;
        designReference: File | null;
    }>({
        aadhaarFront: null,
        aadhaarBack: null,
        photo: null,
        designReference: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (key: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!files.aadhaarFront || !files.aadhaarBack || !files.photo) {
            toast.error("Please upload all required documents (Aadhaar Front, Back & Photo)");
            return;
        }

        setIsSubmitting(true);

        const panOrder = {
            type: 'PAN_SERVICE',
            subType: subType,
            targetTeam: 'PAN_TEAM',
            details: { ...formData },
            files: { ...files }
        };

        try {
            console.log("Submitting PAN Order:", panOrder);
            await submitPanOrder(panOrder);
            toast.success("PAN Application Submitted Successfully!");
            onBack();
        } catch (error) {
            toast.error("Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent hover:text-primary group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-inner">
                                <CreditCard className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">New PAN Card Application</h1>
                                <p className="mt-2 text-blue-100 max-w-lg leading-relaxed">
                                    Official PAN Card processing service. Ensure all details match the applicant's Aadhaar card exactly to avoid rejection.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Service Type Selection */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" /> Select Processing Priority
                            </Label>
                            <RadioGroup
                                defaultValue="NORMAL"
                                value={subType}
                                onValueChange={(v) => setSubType(v as 'NORMAL' | 'EMERGENCY')}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <div
                                    onClick={() => setSubType('NORMAL')}
                                    className={cn(
                                        "relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md",
                                        subType === 'NORMAL'
                                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                            : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <RadioGroupItem value="NORMAL" id="normal" className="mt-1" />
                                    </div>
                                    <Label htmlFor="normal" className="font-bold text-lg mb-1 cursor-pointer">Normal Processing</Label>
                                    <p className="text-sm text-muted-foreground mb-4">Standard government processing timeline.</p>
                                    <div className="mt-auto pt-4 border-t border-dashed border-blue-200 dark:border-blue-800 flex justify-between items-center">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">7-10 Days</span>
                                        <span className="font-bold text-lg">₹107</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSubType('EMERGENCY')}
                                    className={cn(
                                        "relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md",
                                        subType === 'EMERGENCY'
                                            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20"
                                            : "border-border bg-card hover:border-amber-200 dark:hover:border-amber-800"
                                    )}
                                >
                                    {subType === 'EMERGENCY' && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                            Recommended
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-600 dark:text-amber-400">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <RadioGroupItem value="EMERGENCY" id="emergency" className="mt-1 text-amber-600 border-amber-600" />
                                    </div>
                                    <Label htmlFor="emergency" className="font-bold text-lg mb-1 cursor-pointer">Emergency / Tatkal</Label>
                                    <p className="text-sm text-muted-foreground mb-4">Priority handling for urgent needs.</p>
                                    <div className="mt-auto pt-4 border-t border-dashed border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">2-3 Days</span>
                                        <span className="font-bold text-lg">₹250</span>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Applicant Details */}
                        <Card className="border shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Applicant Details
                                </CardTitle>
                                <CardDescription>Personal information as it appears on documents</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="applicantName" className="text-xs font-semibold uppercase text-muted-foreground">Applicant Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="applicantName"
                                            name="applicantName"
                                            required
                                            placeholder="Enter full name"
                                            className="bg-muted/30 focus:bg-background transition-colors"
                                            value={formData.applicantName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nameAsPerAadhaar" className="text-xs font-semibold uppercase text-muted-foreground">Name on Aadhaar <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="nameAsPerAadhaar"
                                            name="nameAsPerAadhaar"
                                            required
                                            placeholder="Exact match required"
                                            className="bg-muted/30 focus:bg-background transition-colors"
                                            value={formData.nameAsPerAadhaar}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="aadhaarNumber" className="text-xs font-semibold uppercase text-muted-foreground">Aadhaar Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="aadhaarNumber"
                                            name="aadhaarNumber"
                                            required
                                            placeholder="XXXX XXXX XXXX"
                                            className="font-mono bg-muted/30 focus:bg-background transition-colors tracking-wide"
                                            maxLength={12}
                                            pattern="[0-9]{12}"
                                            value={formData.aadhaarNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dob" className="text-xs font-semibold uppercase text-muted-foreground">Date of Birth <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            required
                                            className="bg-muted/30 focus:bg-background transition-colors"
                                            value={formData.dob}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherName" className="text-xs font-semibold uppercase text-muted-foreground">Father's Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="fatherName"
                                            name="fatherName"
                                            required
                                            placeholder="Father's full name"
                                            className="bg-muted/30 focus:bg-background transition-colors"
                                            value={formData.fatherName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mobile" className="text-xs font-semibold uppercase text-muted-foreground">Mobile Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="mobile"
                                            name="mobile"
                                            type="tel"
                                            required
                                            placeholder="Linked to Aadhaar"
                                            className="bg-muted/30 focus:bg-background transition-colors"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Uploads */}
                        <Card className="border shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Document Verification
                                </CardTitle>
                                <CardDescription>Upload clear scans of original documents</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { key: 'aadhaarFront', label: 'Aadhaar Front', icon: CreditCard },
                                        { key: 'aadhaarBack', label: 'Aadhaar Back', icon: CreditCard },
                                        { key: 'photo', label: 'Passport Photo', icon: User },
                                    ].map((field) => (
                                        <div key={field.key} className="group relative border-2 border-dashed rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all text-center">
                                            <div className="mb-3 mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-white group-hover:shadow-sm">
                                                {files[field.key as keyof typeof files] ? (
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                ) : (
                                                    <field.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                                                )}
                                            </div>
                                            <Label htmlFor={field.key} className="block text-sm font-medium mb-1 cursor-pointer">
                                                {field.label} <span className="text-red-500">*</span>
                                            </Label>
                                            <p className="text-xs text-muted-foreground truncate max-w-full px-2">
                                                {files[field.key as keyof typeof files]?.name || "Click to upload"}
                                            </p>
                                            <Input
                                                id={field.key}
                                                type="file"
                                                required
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange(field.key as any)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 rounded-xl bg-muted/20 border border-dashed flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-muted rounded shadow-sm">
                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="designRef" className="text-sm font-medium block">Optional Design Reference</Label>
                                        <p className="text-xs text-muted-foreground">Upload any specific design preference</p>
                                    </div>
                                    <Input
                                        id="designRef"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange('designReference')}
                                        className="w-auto max-w-[200px] h-9 text-xs"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button variant="outline" type="button" onClick={onBack} size="lg" className="px-8">
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" className="px-8 shadow-lg shadow-blue-500/20" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting Application..." : "Submit Application"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="sticky top-6 border shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Service</span>
                                    <span className="font-medium">New PAN Card</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Priority</span>
                                    <span className={cn(
                                        "font-medium px-2 py-0.5 rounded text-xs",
                                        subType === 'NORMAL' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {subType === 'NORMAL' ? 'Standard' : 'Emergency'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm ">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span className="font-medium text-xs">
                                        {subType === 'NORMAL' ? '7-10 Days' : '2-3 Days'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium">Total Payable</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {subType === 'NORMAL' ? '₹107' : '₹250'}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">Includes GST & Processing Fees</p>
                            </div>

                            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 flex gap-2 items-start border border-emerald-100 dark:border-emerald-800">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Wallet Balance Check</p>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Your wallet has sufficient balance for this transaction.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
