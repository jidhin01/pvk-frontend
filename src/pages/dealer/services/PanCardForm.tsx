import React, { useState } from 'react';
import {
    CreditCard,
    Upload,
    Zap,
    Clock,
    ArrowLeft,
    CheckCircle2,
    FileText
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
        fullName: '',
        dob: '',
        fatherName: '',
        mobile: '',
    });
    const [files, setFiles] = useState<{
        aadhaarFront: File | null;
        aadhaarBack: File | null;
        photo: File | null;
    }>({
        aadhaarFront: null,
        aadhaarBack: null,
        photo: null
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
        <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4">
            <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Marketplace
            </Button>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Main Form */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle>New PAN Card Application</CardTitle>
                                        <CardDescription>Enter applicant details accurately as per Aadhaar.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Service Type Toggle */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Service Type</Label>
                                    <RadioGroup
                                        defaultValue="NORMAL"
                                        value={subType}
                                        onValueChange={(v) => setSubType(v as 'NORMAL' | 'EMERGENCY')}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div className={cn(
                                            "flex items-start space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all",
                                            subType === 'NORMAL' ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                        )} onClick={() => setSubType('NORMAL')}>
                                            <RadioGroupItem value="NORMAL" id="normal" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="normal" className="font-semibold cursor-pointer flex items-center gap-2">
                                                    Normal Processing
                                                    {subType === 'NORMAL' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">Standard specific timelines. Lower cost.</p>
                                                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                                                    <Clock className="h-3 w-3" /> 7-10 Days
                                                </div>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "flex items-start space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all",
                                            subType === 'EMERGENCY' ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                        )} onClick={() => setSubType('EMERGENCY')}>
                                            <RadioGroupItem value="EMERGENCY" id="emergency" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="emergency" className="font-semibold cursor-pointer flex items-center gap-2">
                                                    Emergency / Tatkal
                                                    {subType === 'EMERGENCY' && <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">Priority processing for urgent requirements.</p>
                                                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                                    <Clock className="h-3 w-3" /> 2-3 Days
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Applicant Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Applicant Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                required
                                                placeholder="As per Aadhaar"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dob">Date of Birth</Label>
                                            <Input
                                                id="dob"
                                                name="dob"
                                                type="date"
                                                required
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fatherName">Father's Name</Label>
                                            <Input
                                                id="fatherName"
                                                name="fatherName"
                                                required
                                                placeholder="Father's Full Name"
                                                value={formData.fatherName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mobile">Mobile Number</Label>
                                            <Input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                required
                                                placeholder="Linked to Aadhaar"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mandatory Uploads */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Required Documents</h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4 bg-muted/20">
                                            <Label className="mb-2 block">Aadhaar Card Front <span className="text-red-500">*</span></Label>
                                            <Input type="file" required accept="image/*,.pdf" onChange={handleFileChange('aadhaarFront')} />
                                        </div>
                                        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4 bg-muted/20">
                                            <Label className="mb-2 block">Aadhaar Card Back <span className="text-red-500">*</span></Label>
                                            <Input type="file" required accept="image/*,.pdf" onChange={handleFileChange('aadhaarBack')} />
                                        </div>
                                        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4 bg-muted/20">
                                            <Label className="mb-2 block">Passport Size Photo <span className="text-red-500">*</span></Label>
                                            <Input type="file" required accept="image/*" onChange={handleFileChange('photo')} />
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 pt-6 border-t bg-muted/10">
                                <Button variant="outline" type="button" onClick={onBack} disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" className="min-w-[150px]" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                {/* Sidebar / Info */}
                <div className="w-full md:w-80 space-y-6">
                    <Card className="bg-blue-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-900">Document Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2 items-start">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">Ensure Aadhaar photo is clear and text is readable.</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">Passport photo should have a white background.</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">Applicant signature (if applicable) logic to be added later.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span>Processing Fee</span>
                                <span className="font-semibold">
                                    {subType === 'NORMAL' ? '₹107.00' : '₹250.00'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-primary text-lg">
                                    {subType === 'NORMAL' ? '₹107.00' : '₹250.00'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
