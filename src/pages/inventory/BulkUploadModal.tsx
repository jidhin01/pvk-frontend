
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { UploadCloud, FileSpreadsheet, Download, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImport: (items: any[]) => void;
}

export function BulkUploadModal({ open, onOpenChange, onImport }: BulkUploadModalProps) {
    const [fileState, setFileState] = useState<'idle' | 'uploading' | 'preview'>('idle');
    const [previewData, setPreviewData] = useState<any[]>([]);

    const handleFileUpload = () => {
        setFileState('uploading');
        // Simulate file processing delay
        setTimeout(() => {
            const mockData = [
                { name: 'Glossy Card Paper 300gsm', category: 'Paper', shopQty: 0, godownQty: 500, cost: 450 },
                { name: 'Canon Ink Bottle - Black', category: 'Ink', shopQty: 10, godownQty: 40, cost: 650 },
                { name: 'Lamination Roll 100mic', category: 'Lamination', shopQty: 5, godownQty: 20, cost: 1200 },
            ];
            setPreviewData(mockData);
            setFileState('preview');
        }, 1500);
    };

    const handleConfirm = () => {
        onImport(previewData);
        toast.success(`Successfully imported ${previewData.length} items from file.`);
        onOpenChange(false);
        setFileState('idle');
        setPreviewData([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                        Bulk Inventory Import
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {fileState === 'idle' && (
                        <div
                            className="border-2 border-dashed rounded-lg p-12 text-center space-y-4 hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={handleFileUpload}
                        >
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <UploadCloud className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Click to Upload</h3>
                                <p className="text-muted-foreground text-sm">Support: .CSV, .XLSX</p>
                            </div>
                        </div>
                    )}

                    {fileState === 'uploading' && (
                        <div className="py-12 text-center space-y-4">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                            <p className="text-muted-foreground">Processing inventory file...</p>
                        </div>
                    )}

                    {fileState === 'preview' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <p className="text-muted-foreground">Previewing 3 of 3 rows found.</p>
                                <Button variant="ghost" size="sm" className="h-8 text-blue-600">
                                    <Download className="mr-2 h-3 w-3" /> Download Source
                                </Button>
                            </div>
                            <div className="rounded-md border max-h-[300px] overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Qty (Total)</TableHead>
                                            <TableHead className="text-right">Cost</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewData.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium">{row.name}</TableCell>
                                                <TableCell>{row.category}</TableCell>
                                                <TableCell className="text-right">{row.shopQty + row.godownQty}</TableCell>
                                                <TableCell className="text-right">₹{row.cost}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-md flex gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <p>Note: Imported items will be added to Godown by default unless specified.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="link" className="px-0 text-muted-foreground" disabled={fileState !== 'idle'}>
                            <Download className="mr-2 h-4 w-4" /> Download Template
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button disabled={fileState !== 'preview'} onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">
                                <Check className="mr-2 h-4 w-4" /> Confirm Import
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
