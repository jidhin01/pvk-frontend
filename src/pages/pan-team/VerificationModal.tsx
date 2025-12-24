
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
    Check,
    CheckCircle2,
    Printer,
    RotateCcw,
    XCircle,
    ZoomIn,
    ZoomOut,
    FileImage,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanApplication } from '@/data/mockPanData';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import gridPattern from '@/assets/grid-pattern.svg';

interface VerificationModalProps {
    application: PanApplication;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Updated signature to handle reason for rejection
    onVerify: (action: 'print' | 'complete' | 'reject' | 'reupload', reason?: string) => void;
}

export function VerificationModal({ application, open, onOpenChange, onVerify }: VerificationModalProps) {
    const [zoom, setZoom] = useState(1);
    const [activeTab, setActiveTab] = useState("aadhaar");

    // Reset zoom when switching tabs or opening
    React.useEffect(() => {
        setZoom(1);
    }, [activeTab, open]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.01;
            setZoom(prev => Math.min(Math.max(1, prev + delta), 4));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-muted/20">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <span>Verifying: {application.id}</span>
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full border",
                                application.type === 'EMERGENCY' ? "bg-red-100 text-red-700 border-red-200" : "bg-blue-100 text-blue-700 border-blue-200"
                            )}>
                                {application.type}
                            </span>
                            {!application.isPrintRequired && (
                                <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-100 text-purple-700 border-purple-200">
                                    Digital Only
                                </span>
                            )}
                        </DialogTitle>

                        <div className="flex items-center gap-2">
                            {/* Rejection / Re-upload Logic */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="destructive" className="gap-2">
                                        <XCircle className="h-4 w-4" /> Reject Options
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Soft Rejection (Re-upload)</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onVerify('reupload', 'Photo Blurry/Invalid')}>
                                        Photo Blurry
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onVerify('reupload', 'Document Unreadable')}>
                                        Aadhaar Unreadable
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onVerify('reupload', 'Signature Missing')}>
                                        Signature Missing
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel className="text-red-600">Fatal Rejection</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onVerify('reject', 'Data Mismatch')} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        Data Mismatch (Reject Order)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onVerify('reject', 'Fraud Suspected')} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        Fraud Suspected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Approval Logic */}
                            {application.isPrintRequired ? (
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 gap-2 w-48"
                                    onClick={() => onVerify('print')}
                                >
                                    <Printer className="h-4 w-4" />
                                    Approve & Print
                                </Button>
                            ) : (
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 gap-2 w-48"
                                    onClick={() => onVerify('complete')}
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Digital Complete
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Data Verification Form */}
                    <div className="w-1/3 min-w-[350px] p-6 border-r bg-background overflow-y-auto space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Applicant Data</h3>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Full Name</Label>
                                <div className="text-lg font-medium p-2 bg-muted/30 rounded border select-all">{application.applicantName}</div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Father's Name</Label>
                                <div className="text-lg font-medium p-2 bg-muted/30 rounded border select-all">{application.fatherName}</div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Date of Birth</Label>
                                <div className="text-lg font-medium p-2 bg-muted/30 rounded border select-all">{application.dob}</div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Aadhaar Number</Label>
                                <div className="text-lg font-mono font-medium p-2 bg-muted/30 rounded border tracking-wider select-all">{application.aadhaarNumber}</div>
                            </div>

                            <div className="text-xs text-muted-foreground mt-8 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
                                ℹ Verify spelling exactly as per Aadhaar. Check for initials vs full names.
                            </div>
                        </div>
                    </div>

                    {/* Right: Document Viewer (Dual View) */}
                    <div className="flex-1 bg-slate-900 relative flex flex-col">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm">
                                <TabsList className="grid w-full grid-cols-2 shadow-lg bg-black/60 border border-white/10 text-white">
                                    <TabsTrigger value="aadhaar" className="data-[state=active]:bg-white data-[state=active]:text-black">
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Proof (Aadhaar)
                                    </TabsTrigger>
                                    <TabsTrigger value="photo" className="data-[state=active]:bg-white data-[state=active]:text-black">
                                        <FileImage className="h-4 w-4 mr-2" />
                                        Card Photo
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="absolute top-4 right-4 z-10 flex gap-2 bg-black/50 p-1 rounded-lg backdrop-blur-sm">
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setZoom(z => Math.max(1, z - 0.5))}>
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-white text-xs flex items-center min-w-[3ch]">{Math.round(zoom * 100)}%</span>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setZoom(z => Math.min(4, z + 0.5))}>
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-auto flex items-center justify-center p-8" style={{ backgroundImage: `url(${gridPattern})` }}>
                                <TabsContent value="aadhaar" className="w-full h-full flex items-center justify-center p-0 m-0 border-0 outline-none data-[state=inactive]:hidden">
                                    <div
                                        className="relative transition-transform duration-200 ease-out origin-center cursor-move"
                                        style={{ transform: `scale(${zoom})` }}
                                    >
                                        {application.documents.aadhaarFront ? (
                                            <img
                                                src={application.documents.aadhaarFront}
                                                alt="Aadhaar Front"
                                                className="max-w-full max-h-[80vh] shadow-2xl rounded-lg object-contain bg-white"
                                            />
                                        ) : (
                                            <div className="text-white">No Aadhaar Image</div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="photo" className="w-full h-full flex items-center justify-center p-0 m-0 border-0 outline-none data-[state=inactive]:hidden">
                                    <div
                                        className="relative transition-transform duration-200 ease-out origin-center cursor-move"
                                        style={{ transform: `scale(${zoom})` }}
                                    >
                                        {application.documents.photo ? (
                                            <img
                                                src={application.documents.photo}
                                                alt="Applicant Photo"
                                                className="max-w-full max-h-[80vh] shadow-2xl rounded-lg object-contain bg-white"
                                            />
                                        ) : (
                                            <div className="text-white">No Photo Image</div>
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
