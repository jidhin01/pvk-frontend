import React from 'react';
import { OffsetJob } from '@/data/mockPrinterData';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Play, CheckCircle2, AlertTriangle, Calendar, Printer, User, Building } from 'lucide-react';

interface OffsetJobCardProps {
    job: OffsetJob;
    onStatusChange: (id: string, status: any) => void;
    onReject: (id: string) => void;
}

export default function OffsetJobCard({ job, onStatusChange, onReject }: OffsetJobCardProps) {
    const isPrinting = job.status === 'printing';

    return (
        <Card className="flex flex-col shadow-md hover:shadow-xl transition-all border-t-8 border-t-slate-800 dark:border-t-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
            <CardHeader className="pb-2 pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            <Settings className="h-3 w-3" /> Offset Run
                        </div>
                        <h3 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-white">{job.jobName}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="h-3 w-3" /> Due: {job.dueDate}
                        </div>
                    </div>
                    <Badge variant={job.status === 'printing' ? 'default' : 'secondary'} className="capitalize">
                        {job.status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-200/50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-300/50 dark:border-slate-700/50">
                    <div className={`p-1.5 rounded-full ${job.dealerType === 'dealer' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {job.dealerType === 'dealer' ? <Building className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <span className="font-medium text-foreground text-xs">{job.dealerName || 'Unknown Dealer'}</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 pt-2">
                {/* Quantity Block */}
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{job.quantity.toLocaleString()}</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Copies</span>
                </div>

                {/* Specs */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <span className="text-xs uppercase font-bold text-slate-400">Paper Stock</span>
                        <div className="font-serif text-base text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1">{job.paperType}</div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs uppercase font-bold text-slate-400">Finishing</span>
                        <div className="flex flex-wrap gap-2">
                            {job.finishing.map((finish, i) => (
                                <Badge key={i} variant="secondary" className="bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                    {finish}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4 pb-6 bg-slate-100/50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800">
                <div className="flex w-full gap-3">
                    {job.status === 'ready_for_print' ? (
                        <Button className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20" onClick={() => onStatusChange(job.id, 'printing')}>
                            <Printer className="mr-2 h-5 w-5" /> Mark Plates Ready & Start
                        </Button>
                    ) : (
                        <Button className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20" onClick={() => onStatusChange(job.id, 'completed')}>
                            <CheckCircle2 className="mr-2 h-5 w-5" /> Print Done
                        </Button>
                    )}

                    <Button variant="outline" size="icon" className="h-12 w-12 border-slate-300 text-slate-500 hover:text-destructive" onClick={() => onReject(job.id)}>
                        <AlertTriangle className="h-5 w-5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
