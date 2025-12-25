import React from 'react';
import { PvcBatchJob } from '@/data/mockPrinterData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, Layers, Play, CheckCircle2, AlertTriangle, Eye, User, Building } from 'lucide-react';
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
        <Card className="flex flex-col shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary bg-card text-card-foreground">
            <CardHeader className="pb-3 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                            <Layers className="h-3 w-3 mr-1" /> PVC Batch
                        </Badge>
                        <Badge variant={batch.status === 'printing' ? 'default' : 'secondary'} className="capitalize">
                            {batch.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
                        {batch.capacity} Items
                    </Badge>
                </div>

                <div>
                    <CardTitle className="text-lg leading-tight mb-2">{batch.jobName}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                        <div className={`p-1.5 rounded-full ${batch.dealerType === 'dealer' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {batch.dealerType === 'dealer' ? <Building className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        </div>
                        <span className="font-medium text-foreground">{batch.dealerName || 'Unknown Dealer'}</span>
                    </div>
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
                                    <FileDown className="mr-2 h-4 w-4" /> Download Sheet
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
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => onStatusChange(batch.id, 'completed')}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Print Done
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
