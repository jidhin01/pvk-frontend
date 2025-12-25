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
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock function to simulate API call
const submitPanOrder = async (orderData: any) => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
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

            // Here you would typically navigate to orders list or show success state
            // For now, we go back
            onBack();
        } catch (error) {
            toast.error("Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Marketplace
                </Button>
            </div>

            {/* Main Layout - Sidebar on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Form - Takes more space */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-md">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">New PAN Card Application</CardTitle>
                                        <CardDescription>Enter applicant details accurately as per Aadhaar.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                {/* Service Type Toggle - Compact */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Service Type</Label>
                                    <RadioGroup
                                        defaultValue="NORMAL"
                                        value={subType}
                                        onValueChange={(v) => setSubType(v as 'NORMAL' | 'EMERGENCY')}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        <div className={cn(
                                            "flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all",
                                            subType === 'NORMAL' ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                        )} onClick={() => setSubType('NORMAL')}>
                                            <RadioGroupItem value="NORMAL" id="normal" />
                                            <div className="flex-1 min-w-0">
                                                <Label htmlFor="normal" className="font-medium cursor-pointer text-sm flex items-center gap-1.5">
                                                    Normal Processing
                                                    {subType === 'NORMAL' && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                                                </Label>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> 7-10 Days
                                                </div>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all",
                                            subType === 'EMERGENCY' ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                        )} onClick={() => setSubType('EMERGENCY')}>
                                            <RadioGroupItem value="EMERGENCY" id="emergency" />
                                            <div className="flex-1 min-w-0">
                                                <Label htmlFor="emergency" className="font-medium cursor-pointer text-sm flex items-center gap-1.5">
                                                    Emergency / Tatkal
                                                    {subType === 'EMERGENCY' && <Zap className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                                                </Label>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> 2-3 Days
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Applicant Details - 3 Column Grid */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Applicant Details</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="applicantName" className="text-xs flex items-center gap-1">
                                                <User className="h-3 w-3" /> Applicant Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="applicantName"
                                                name="applicantName"
                                                required
                                                placeholder="Enter name"
                                                className="h-9"
                                                value={formData.applicantName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="nameAsPerAadhaar" className="text-xs flex items-center gap-1">
                                                <FileText className="h-3 w-3" /> Name as per Aadhaar <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="nameAsPerAadhaar"
                                                name="nameAsPerAadhaar"
                                                required
                                                placeholder="Exact Aadhaar name"
                                                className="h-9"
                                                value={formData.nameAsPerAadhaar}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="aadhaarNumber" className="text-xs flex items-center gap-1">
                                                <CreditCard className="h-3 w-3" /> Aadhaar Number <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="aadhaarNumber"
                                                name="aadhaarNumber"
                                                required
                                                placeholder="12-digit number"
                                                className="h-9"
                                                maxLength={12}
                                                pattern="[0-9]{12}"
                                                value={formData.aadhaarNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="dob" className="text-xs flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Date of Birth <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="dob"
                                                name="dob"
                                                type="date"
                                                required
                                                className="h-9"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="fatherName" className="text-xs flex items-center gap-1">
                                                <User className="h-3 w-3" /> Father's Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="fatherName"
                                                name="fatherName"
                                                required
                                                placeholder="Father's full name"
                                                className="h-9"
                                                value={formData.fatherName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="mobile" className="text-xs flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> Mobile Number <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                required
                                                placeholder="Aadhaar linked"
                                                className="h-9"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Upload - Compact Grid */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Required Documents</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="border border-dashed rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <Label className="text-xs font-medium mb-2 block">
                                                Aadhaar Front <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="file"
                                                required
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange('aadhaarFront')}
                                                className="h-8 text-xs file:text-xs file:mr-2"
                                            />
                                        </div>
                                        <div className="border border-dashed rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <Label className="text-xs font-medium mb-2 block">
                                                Aadhaar Back <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="file"
                                                required
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange('aadhaarBack')}
                                                className="h-8 text-xs file:text-xs file:mr-2"
                                            />
                                        </div>
                                        <div className="border border-dashed rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <Label className="text-xs font-medium mb-2 block">
                                                Passport Photo <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="file"
                                                required
                                                accept="image/*"
                                                onChange={handleFileChange('photo')}
                                                className="h-8 text-xs file:text-xs file:mr-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Design Reference */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Design Reference (Optional)</Label>
                                    <div className="border border-dashed rounded-lg p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-lg">
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground mb-2">Upload design template or reference image if needed</p>
                                                <Input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={handleFileChange('designReference')}
                                                    className="h-8 text-xs file:text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </CardContent>

                            <CardFooter className="flex justify-end gap-3 pt-4 border-t bg-muted/30">
                                <Button variant="outline" type="button" onClick={onBack} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                {/* Sidebar - Right Side */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Document Checklist */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Document Checklist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 pt-0">
                            <div className="flex gap-2 items-start">
                                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-200">Aadhaar photo must be clear and readable</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-200">Passport photo with white background</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-200">All details must match Aadhaar exactly</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Summary */}
                    <Card className="sticky top-4">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-primary" />
                                Pricing Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-muted-foreground">Processing Type</span>
                                    <span className="font-medium">
                                        {subType === 'NORMAL' ? 'Normal' : 'Emergency'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-sm border-t">
                                    <span className="text-muted-foreground">Processing Fee</span>
                                    <span className="font-semibold">
                                        {subType === 'NORMAL' ? '₹107.00' : '₹250.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t bg-primary/5 -mx-6 px-6 -mb-6 rounded-b-lg">
                                    <span className="font-bold">Total Amount</span>
                                    <span className="font-bold text-primary text-lg">
                                        {subType === 'NORMAL' ? '₹107.00' : '₹250.00'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Processing Time Info */}
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200/50 dark:border-amber-800/30">
                        <CardContent className="py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-200/50 dark:bg-amber-800/30 rounded-lg">
                                    <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Estimated Delivery</p>
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                        {subType === 'NORMAL' ? '7-10 Business Days' : '2-3 Business Days'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
