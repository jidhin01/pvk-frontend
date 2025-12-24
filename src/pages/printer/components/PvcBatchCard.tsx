import React from 'react';
import { PvcBatchJob } from '@/data/mockPrinterData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, Layers, Play, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PvcBatchCardProps {
    batch: PvcBatchJob;
    onDownload: (job: PvcBatchJob) => void;
    onStatusChange: (id: string, status: any) => void;
    onReject: (id: string) => void;
    onViewContents?: (job: PvcBatchJob) => void;
}

export default function PvcBatchCard({ batch, onDownload, onStatusChange, onReject, onViewContents }: PvcBatchCardProps) {
    return (
        <Card className="flex flex-col shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary bg-card text-card-foreground h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Layers className="h-3 w-3" />
                            PVC Batch
                        </div>
                        <CardTitle className="text-lg leading-tight">{batch.jobName}</CardTitle>
                    </div>
                    <Badge className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-3">
                        {batch.capacity} Items
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-y-3 text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div>
                        <div className="text-muted-foreground text-xs font-medium">Material</div>
                        <div className="font-semibold">{batch.material}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs font-medium">Sheet Size</div>
                        <div className="font-semibold">{batch.sheetSize}</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 flex flex-col gap-3">
                <div className="flex w-full gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-10 text-sm border-dashed text-blue-700 border-blue-200 hover:bg-blue-50"
                                    onClick={() => onDownload(batch)}
                                >
                                    <FileDown className="mr-2 h-4 w-4" /> Download A4 Sheet
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Download Merged Composition</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {onViewContents && (
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground" onClick={() => onViewContents(batch)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex w-full gap-2">
                    {batch.status === 'ready_for_print' ? (
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => onStatusChange(batch.id, 'printing')}>
                            <Play className="mr-2 h-4 w-4" /> Start Print
                        </Button>
                    ) : (
                        <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold" onClick={() => onStatusChange(batch.id, 'completed')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
                        </Button>
                    )}
                    <Button variant="destructive" size="icon" onClick={() => onReject(batch.id)}>
                        <AlertTriangle className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
