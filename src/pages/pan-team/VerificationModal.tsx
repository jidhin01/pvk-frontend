import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertCircle,
    CheckCircle2,
    Printer,
    RotateCcw,
    XCircle,
    ZoomIn,
    ZoomOut,
    FileImage,
    CreditCard,
    ChevronDown,
    Maximize2,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PancardOrder } from '@/data/mockPancardData';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import gridPattern from '@/assets/grid-pattern.svg';

interface VerificationModalProps {
    application: PancardOrder;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Updated signature to handle reason for rejection and uploaded file
    onVerify: (action: 'print' | 'complete' | 'reject' | 'reupload', reason?: string, fileUrl?: string) => void;
}

export function VerificationModal({ application, open, onOpenChange, onVerify }: VerificationModalProps) {
    const [zoom, setZoom] = useState(1);
    const [activeTab, setActiveTab] = useState("aadhaar");
    const [generatedPanFile, setGeneratedPanFile] = useState<File | null>(null);

    // Reset zoom when switching tabs or opening
    React.useEffect(() => {
        setZoom(1);
        setGeneratedPanFile(null); // Reset file
    }, [activeTab, open]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.01;
            setZoom(prev => Math.min(Math.max(1, prev + delta), 4));
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setGeneratedPanFile(e.target.files[0]);
        }
    };

    const handleApprove = () => {
        if (!generatedPanFile) return;

        // Mocking a file upload and getting a URL
        // In real app, upload logic here
        const mockUrl = `https://mock-storage.com/generated-pan/${application.id}.pdf`;
        onVerify('print', undefined, mockUrl);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-0 shadow-2xl bg-background rounded-xl">
                {/* Header Section */}
                <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                                    <span>Verifying Application</span>
                                    <span className="font-mono text-base font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">#{application.id}</span>
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                        "text-[11px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase",
                                        application.type === 'EMERGENCY'
                                            ? "bg-red-100 text-red-700 border border-red-200"
                                            : "bg-blue-100 text-blue-700 border border-blue-200"
                                    )}>
                                        {application.type} Priority
                                    </span>
                                    {!application.printerJobId && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase bg-purple-100 text-purple-700 border border-purple-200">
                                            Digital Initial
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground mr-2">Actions:</span>
                            {/* Rejection / Re-upload Logic */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors">
                                        <XCircle className="h-4 w-4" /> Reject/Return <ChevronDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2">
                                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                                        <RotateCcw className="h-3 w-3" /> Request Re-upload
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onVerify('reupload', 'Photo Blurry/Invalid')} className="cursor-pointer">
                                        Photo Blurry / Unclear
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onVerify('reupload', 'Document Unreadable')} className="cursor-pointer">
                                        Document Info Unreadable
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onVerify('reupload', 'Signature Missing')} className="cursor-pointer">
                                        Signature Missing
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2" />

                                    <DropdownMenuLabel className="text-xs font-semibold text-red-600 uppercase flex items-center gap-2">
                                        <XCircle className="h-3 w-3" /> Permanent Rejection
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onVerify('reject', 'Data Mismatch')} className="text-red-700 focus:text-red-800 focus:bg-red-50 cursor-pointer">
                                        Data Mismatch (Reject Order)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onVerify('reject', 'Fraud Suspected')} className="text-red-700 focus:text-red-800 focus:bg-red-50 cursor-pointer">
                                        Fraud Suspected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="h-8 w-px bg-border mx-2" />

                            {/* E-Copy Upload Section - Integrated into Header Actions */}
                            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-dashed border-primary/20 hover:bg-muted/80 transition-colors relative">
                                <Label htmlFor="epan-upload" className={cn(
                                    "cursor-pointer text-xs font-medium px-3 py-1.5 rounded transition-colors flex items-center gap-2 min-w-[140px] justify-center",
                                    generatedPanFile ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-white hover:bg-blue-50 text-muted-foreground border border-transparent shadow-sm"
                                )}>
                                    {generatedPanFile ? (
                                        <>
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            {generatedPanFile.name.length > 15 ? generatedPanFile.name.substring(0, 15) + '...' : generatedPanFile.name}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-3.5 w-3.5" />
                                            Upload E-PAN PDF
                                        </>
                                    )}
                                </Label>
                                <input
                                    id="epan-upload"
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf,image/*"
                                    onChange={handleFileUpload}
                                />
                            </div>

                            {/* Approval Logic */}
                            <Button
                                className={cn(
                                    "gap-2 min-w-[180px] shadow-md transition-all",
                                    generatedPanFile
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02] text-white"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                )}
                                onClick={handleApprove}
                                disabled={!generatedPanFile}
                            >
                                <Printer className="h-4 w-4" />
                                {generatedPanFile ? "Send to Printer" : "Upload E-PAN First"}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Data Verification Form */}
                    <div className="w-[400px] border-r bg-muted/10 overflow-y-auto">
                        <div className="p-6 space-y-8">
                            <div>
                                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Applicant Data
                                </h3>
                                <div className="space-y-5">
                                    <div className="group">
                                        <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-1.5 block">Full Name</Label>
                                        <div className="text-lg font-medium p-3 bg-background rounded-lg border shadow-sm group-hover:border-blue-300 transition-colors select-all">
                                            {application.applicantName}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-1.5 block">Father's Name</Label>
                                        <div className="text-lg font-medium p-3 bg-background rounded-lg border shadow-sm group-hover:border-blue-300 transition-colors select-all">
                                            {application.fatherName}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-1.5 block">Date of Birth</Label>
                                        <div className="text-lg font-medium p-3 bg-background rounded-lg border shadow-sm group-hover:border-blue-300 transition-colors select-all">
                                            {application.dob}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-1.5 block">Aadhaar Number</Label>
                                        <div className="text-xl font-mono font-bold p-3 bg-background rounded-lg border shadow-sm text-blue-700 dark:text-blue-300 tracking-widest group-hover:border-blue-300 transition-colors select-all">
                                            {application.aadharNumber}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-900/50 flex gap-3 text-sm leading-relaxed">
                                <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
                                <div>
                                    <p className="font-semibold mb-1">Verification Note</p>
                                    Verify spelling exactly as per Aadhaar. Check for initials vs full names. Ensure DOB matches proofs.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Document Viewer (Dual View) */}
                    <div className="flex-1 bg-slate-900 relative flex flex-col overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                            {/* Floating Toolbar */}
                            <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
                                <div className="pointer-events-auto bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl flex items-center gap-4">
                                    <TabsList className="bg-transparent border-0 p-0 h-auto gap-1">
                                        <TabsTrigger
                                            value="aadhaar"
                                            className="rounded-full px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:bg-white/10 transition-all font-medium"
                                        >
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Proof (Aadhaar)
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="photo"
                                            className="rounded-full px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:bg-white/10 transition-all font-medium"
                                        >
                                            <FileImage className="h-4 w-4 mr-2" />
                                            Card Photo
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="w-px h-6 bg-white/20"></div>

                                    <div className="flex items-center gap-1 pr-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/20" onClick={() => setZoom(z => Math.max(1, z - 0.5))}>
                                            <ZoomOut className="h-4 w-4" />
                                        </Button>
                                        <span className="text-white text-xs font-mono min-w-[3ch] text-center">{Math.round(zoom * 100)}%</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/20" onClick={() => setZoom(z => Math.min(4, z + 0.5))}>
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/20" onClick={() => setZoom(1)}>
                                            <Maximize2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Viewer Content */}
                            <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-950" style={{ backgroundImage: `url(${gridPattern})`, backgroundSize: '40px 40px', backgroundBlendMode: 'overlay' }}>
                                <TabsContent value="aadhaar" className="w-full h-full flex items-center justify-center p-0 m-0 border-0 outline-none data-[state=inactive]:hidden animate-in fade-in duration-300">
                                    <div
                                        className="relative transition-transform duration-200 ease-out origin-center cursor-grab active:cursor-grabbing"
                                        style={{ transform: `scale(${zoom})` }}
                                        onWheel={handleWheel}
                                    >
                                        {application.aadharProofUrl ? (
                                            <img
                                                src={application.aadharProofUrl}
                                                alt="Aadhaar Front"
                                                className="max-w-full max-h-[75vh] shadow-2xl rounded-lg object-contain bg-white mx-auto ring-1 ring-white/10"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-white/50 gap-4">
                                                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                                                    <CreditCard className="h-12 w-12" />
                                                </div>
                                                <p>No Aadhaar Image Uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="photo" className="w-full h-full flex items-center justify-center p-0 m-0 border-0 outline-none data-[state=inactive]:hidden animate-in fade-in duration-300">
                                    <div
                                        className="relative transition-transform duration-200 ease-out origin-center cursor-grab active:cursor-grabbing"
                                        style={{ transform: `scale(${zoom})` }}
                                        onWheel={handleWheel}
                                    >
                                        {/* Placeholder for photo as we don't have separate photo/back in simple model yet */}
                                        {application.aadharProofUrl ? ( // Using mock logic; in real app this would be photoUrl
                                            <img
                                                src={application.aadharProofUrl}
                                                alt="Applicant Photo"
                                                className="max-w-full max-h-[75vh] shadow-2xl rounded-lg object-contain bg-white mx-auto ring-1 ring-white/10"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-white/50 gap-4">
                                                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                                                    <FileImage className="h-12 w-12" />
                                                </div>
                                                <p>No Photo Image Uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
