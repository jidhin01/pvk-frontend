import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    CheckCircle,
    Eye,
    Download,
    Printer,
    Clock,
    Image,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Play,
    Pause,
    Package,
    User,
    FileText,
    XCircle,
    Timer,
    Zap,
    TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock Print Jobs Data
const MOCK_PRINT_JOBS = [
    // Currently Printing
    { id: 'PRT-098', orderId: 'JOB-280', dealer: 'City Ads', category: 'flex-banner', printStatus: 'printing', priority: 'normal', copies: 10, approvedAt: '5h ago', assignedPrinter: 'Printer Station 1', operator: 'Arun K.', printProgress: 60, startedAt: '30 min ago', estimatedTime: '15 min remaining', preview: '/api/placeholder/400/300' },
    { id: 'PRT-099', orderId: 'JOB-282', dealer: 'Fresh Signs', category: 'brochure', printStatus: 'printing', priority: 'urgent', copies: 500, approvedAt: '4h ago', assignedPrinter: 'Printer Station 2', operator: 'Vijay R.', printProgress: 35, startedAt: '45 min ago', estimatedTime: '1h remaining', preview: '/api/placeholder/400/300' },
    // Ready to Print
    { id: 'PRT-101', orderId: 'JOB-395', dealer: 'ID Solutions', category: 'pvc-card', printStatus: 'ready-to-print', priority: 'urgent', copies: 50, approvedAt: '20 min ago', assignedPrinter: null, preview: '/api/placeholder/400/300' },
    { id: 'PRT-102', orderId: 'JOB-293', dealer: 'Metro Ads', category: 'price-tag', printStatus: 'ready-to-print', priority: 'normal', copies: 200, approvedAt: '3h 30m ago', assignedPrinter: null, preview: '/api/placeholder/400/300' },
    { id: 'PRT-103', orderId: 'JOB-394', dealer: 'Card Pro', category: 'pvc-card', printStatus: 'ready-to-print', priority: 'normal', copies: 100, approvedAt: '2h 45m ago', assignedPrinter: null, preview: '/api/placeholder/400/300' },
    { id: 'PRT-104', orderId: 'JOB-290', dealer: 'Star Graphics', category: 'poster', printStatus: 'ready-to-print', priority: 'urgent', copies: 25, approvedAt: '1h ago', assignedPrinter: null, preview: '/api/placeholder/400/300' },
    // Completed
    { id: 'PRT-090', orderId: 'JOB-270', dealer: 'Alpha Prints', category: 'poster', printStatus: 'completed', priority: 'normal', copies: 50, approvedAt: '1d ago', assignedPrinter: 'Printer Station 1', operator: 'Arun K.', completedAt: '6h ago', handedOver: false, preview: '/api/placeholder/400/300' },
    { id: 'PRT-091', orderId: 'JOB-271', dealer: 'Metro Signs', category: 'price-tag', printStatus: 'completed', priority: 'normal', copies: 300, approvedAt: '1d ago', assignedPrinter: 'Printer Station 2', operator: 'Vijay R.', completedAt: '5h ago', handedOver: true, preview: '/api/placeholder/400/300' },
    { id: 'PRT-092', orderId: 'JOB-272', dealer: 'ID Solutions', category: 'pvc-card', printStatus: 'completed', priority: 'normal', copies: 75, approvedAt: '2d ago', assignedPrinter: 'Printer Station 1', operator: 'Arun K.', completedAt: '1d ago', handedOver: true, preview: '/api/placeholder/400/300' },
    { id: 'PRT-093', orderId: 'JOB-273', dealer: 'Card Pro', category: 'brochure', printStatus: 'completed', priority: 'normal', copies: 150, approvedAt: '2d ago', assignedPrinter: 'Printer Station 2', operator: 'Vijay R.', completedAt: '1d ago', handedOver: true, preview: '/api/placeholder/400/300' },
    { id: 'PRT-094', orderId: 'JOB-274', dealer: 'City Graphics', category: 'flex-banner', printStatus: 'completed', priority: 'urgent', copies: 5, approvedAt: '3d ago', assignedPrinter: 'Printer Station 1', operator: 'Arun K.', completedAt: '2d ago', handedOver: true, preview: '/api/placeholder/400/300' },
];

type PrintJob = typeof MOCK_PRINT_JOBS[0] & {
    printProgress?: number;
    startedAt?: string;
    completedAt?: string;
    handedOver?: boolean;
    estimatedTime?: string;
    operator?: string;
};

export default function PrinterManager() {
    const [searchQuery, setSearchQuery] = useState('');
    const [previewJob, setPreviewJob] = useState<PrintJob | null>(null);
    const [reviewDialog, setReviewDialog] = useState<{ job: PrintJob | null }>({ job: null });
    const [reviewNote, setReviewNote] = useState('');

    // Filter jobs based on search
    const filterJobs = (jobs: PrintJob[]) => {
        if (!searchQuery) return jobs;
        return jobs.filter(j =>
            j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.dealer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Stats
    const currentlyPrinting = MOCK_PRINT_JOBS.filter(j => j.printStatus === 'printing').length;
    const readyToPrint = MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print').length;
    const urgentReady = MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print' && j.priority === 'urgent').length;
    const completedToday = MOCK_PRINT_JOBS.filter(j => j.printStatus === 'completed').length;
    const pendingHandover = MOCK_PRINT_JOBS.filter(j => j.printStatus === 'completed' && !j.handedOver).length;

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'pvc-card': 'PVC Card',
            'poster': 'Poster',
            'brochure': 'Brochure',
            'price-tag': 'Price Tag',
            'flex-banner': 'Flex Banner',
        };
        return labels[category] || category;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'pvc-card': 'bg-purple-100 text-purple-700 border-purple-200',
            'poster': 'bg-blue-100 text-blue-700 border-blue-200',
            'brochure': 'bg-green-100 text-green-700 border-green-200',
            'price-tag': 'bg-orange-100 text-orange-700 border-orange-200',
            'flex-banner': 'bg-pink-100 text-pink-700 border-pink-200',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const handleDownload = (job: PrintJob) => {
        toast.success(`Downloading ${job.id} print files...`);
    };

    const handleMarkComplete = (job: PrintJob) => {
        toast.success(`${job.id} marked as completed`);
    };

    const handleRequestReview = (job: PrintJob, note: string) => {
        toast.info(`${job.id} sent back for design review`);
        setReviewNote('');
        setReviewDialog({ job: null });
    };

    // Render Currently Printing Card
    const renderPrintingCard = (job: PrintJob) => (
        <Card key={job.id} className="border-l-4 border-l-yellow-500 group hover:shadow-sm transition-all">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Preview */}
                    <div
                        className="w-full sm:w-20 h-20 bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors flex-shrink-0"
                        onClick={() => setPreviewJob(job)}
                    >
                        <Image className="h-8 w-8 text-muted-foreground/50" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-base">{job.id}</span>
                                <Badge variant="outline" className="font-normal">{job.orderId}</Badge>
                                {job.priority === 'urgent' && (
                                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Urgent</Badge>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setPreviewJob(job)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.info('Print paused')}>
                                    <Pause className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={() => handleMarkComplete(job)}>
                                    <CheckCircle2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                                <span className="text-muted-foreground text-xs">Dealer</span>
                                <p className="font-medium truncate">{job.dealer}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground text-xs">Copies</span>
                                <p className="font-medium">{job.copies}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground text-xs">Printer</span>
                                <p className="font-medium truncate">{job.assignedPrinter}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground text-xs">Est. Time</span>
                                <p className="font-medium">{job.estimatedTime}</p>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-yellow-600 font-medium animate-pulse">Printing in Progress...</span>
                                <span className="font-medium">{job.printProgress}%</span>
                            </div>
                            <Progress value={job.printProgress} className="h-2" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Render Ready to Print Card
    const renderReadyCard = (job: PrintJob) => (
        <Card key={job.id} className={`group hover:shadow-sm transition-all border-l-4 ${job.priority === 'urgent' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div
                            className="w-14 h-14 bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors flex-shrink-0"
                            onClick={() => setPreviewJob(job)}
                        >
                            <Image className="h-6 w-6 text-muted-foreground/50" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-base">{job.id}</span>
                                <span className="text-sm text-muted-foreground">• {job.orderId}</span>
                                {job.priority === 'urgent' && (
                                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Urgent</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                                <span className="font-medium text-foreground/80">{job.dealer}</span>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">{getCategoryLabel(job.category)}</span>
                                <span>•</span>
                                <span>{job.copies} copies</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:block text-right mr-2">
                            <span className="text-xs text-muted-foreground font-medium block">Approved</span>
                            <span className="text-xs text-muted-foreground">{job.approvedAt}</span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setPreviewJob(job)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(job)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Files
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-blue-600">
                                    <Printer className="h-4 w-4 mr-2" />
                                    Start Printing
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-orange-600" onClick={() => setReviewDialog({ job })}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Send Back for Review
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                            Start
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Render Completed Card
    const renderCompletedCard = (job: PrintJob) => (
        <Card key={job.id} className={`group hover:shadow-sm transition-all border-l-4 ${!job.handedOver ? 'border-l-orange-500' : 'border-l-green-500 opacity-75 hover:opacity-100'}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${job.handedOver ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {job.handedOver ? <CheckCircle2 className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold">{job.id}</span>
                                <span className="text-sm text-muted-foreground">• {job.orderId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground/80">{job.dealer}</span>
                                <span>•</span>
                                <span>{getCategoryLabel(job.category)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${job.handedOver ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                {job.handedOver ? 'Handed Over' : 'Pending Handover'}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">Completed {job.completedAt}</p>
                        </div>
                        {!job.handedOver && (
                            <Button size="sm" variant="outline" className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50">
                                Handover
                            </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setPreviewJob(job)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Printer Workflow</h1>
                    <p className="text-muted-foreground mt-1">Manage print queue and operations</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs..."
                        className="pl-9 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Printing</p>
                            <div className="text-2xl font-bold text-yellow-600">{currentlyPrinting}</div>
                        </div>
                        <div className="p-2 rounded-full bg-yellow-100">
                            <Play className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Queue</p>
                            <div className="text-2xl font-bold text-blue-600">{readyToPrint}</div>
                            {urgentReady > 0 && <span className="text-xs text-red-500 font-medium">{urgentReady} urgent</span>}
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <Printer className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <div className="text-2xl font-bold text-green-600">{completedToday}</div>
                        </div>
                        <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Handover</p>
                            <div className="text-2xl font-bold text-orange-600">{pendingHandover}</div>
                        </div>
                        <div className="p-2 rounded-full bg-orange-100">
                            <Package className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs - 3 Tabs */}
            <Tabs defaultValue="currently-printing" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="currently-printing" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Play className="h-4 w-4" />
                        Printing ({currentlyPrinting})
                    </TabsTrigger>
                    <TabsTrigger value="ready-to-print" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Printer className="h-4 w-4" />
                        Queue ({readyToPrint})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <CheckCircle className="h-4 w-4" />
                        Completed ({completedToday})
                    </TabsTrigger>
                </TabsList>

                {/* Currently Printing Tab */}
                <TabsContent value="currently-printing" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                Active Print Jobs
                            </h3>
                            <p className="text-muted-foreground">{currentlyPrinting} jobs currently being printed</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'printing') as PrintJob[]).length === 0 ? (
                            <Card className="p-12 text-center border-dashed border-2">
                                <Printer className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                                <h4 className="text-lg font-medium text-muted-foreground mb-1">No Active Print Jobs</h4>
                                <p className="text-sm text-muted-foreground">All printers are currently idle</p>
                            </Card>
                        ) : (
                            filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'printing') as PrintJob[]).map(job => renderPrintingCard(job))
                        )}
                    </div>
                </TabsContent>

                {/* Ready to Print Tab */}
                <TabsContent value="ready-to-print" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Ready to Print</h3>
                            <p className="text-muted-foreground">{readyToPrint} jobs waiting in queue</p>
                        </div>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download All Files
                        </Button>
                    </div>

                    {/* Urgent Jobs First */}
                    {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print' && j.priority === 'urgent') as PrintJob[]).length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-red-500" />
                                <h4 className="font-medium text-red-600">Urgent ({urgentReady})</h4>
                            </div>
                            {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print' && j.priority === 'urgent') as PrintJob[]).map(job => renderReadyCard(job))}
                        </div>
                    )}

                    {/* Normal Jobs */}
                    <div className="space-y-3">
                        {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print' && j.priority !== 'urgent') as PrintJob[]).length > 0 && (
                            <h4 className="font-medium text-muted-foreground">Normal Priority</h4>
                        )}
                        {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print') as PrintJob[]).length === 0 ? (
                            <Card className="p-12 text-center border-dashed border-2">
                                <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                                <h4 className="text-lg font-medium text-muted-foreground mb-1">Queue is Empty</h4>
                                <p className="text-sm text-muted-foreground">No jobs waiting to be printed</p>
                            </Card>
                        ) : (
                            filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'ready-to-print' && j.priority !== 'urgent') as PrintJob[]).map(job => renderReadyCard(job))
                        )}
                    </div>
                </TabsContent>

                {/* Completed Tab */}
                <TabsContent value="completed" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Completed Jobs</h3>
                            <p className="text-muted-foreground">{completedToday} jobs completed</p>
                        </div>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                    </div>

                    {/* Pending Handover First */}
                    {pendingHandover > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-orange-500" />
                                <h4 className="font-medium text-orange-600">Pending Handover ({pendingHandover})</h4>
                            </div>
                            {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'completed' && !j.handedOver) as PrintJob[]).map(job => renderCompletedCard(job))}
                        </div>
                    )}

                    {/* Handed Over */}
                    <div className="space-y-3 mt-4">
                        <h4 className="font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Handed Over
                        </h4>
                        {filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'completed' && j.handedOver) as PrintJob[]).length === 0 ? (
                            <Card className="p-8 text-center border-dashed border-2">
                                <p className="text-muted-foreground">No handed over jobs</p>
                            </Card>
                        ) : (
                            filterJobs(MOCK_PRINT_JOBS.filter(j => j.printStatus === 'completed' && j.handedOver) as PrintJob[]).map(job => renderCompletedCard(job))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview Dialog */}
            <Dialog open={!!previewJob} onOpenChange={() => setPreviewJob(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <span className="text-xl">{previewJob?.id}</span>
                            <Badge variant="outline">{previewJob?.orderId}</Badge>
                            <Badge className={getCategoryColor(previewJob?.category || '')}>{getCategoryLabel(previewJob?.category || '')}</Badge>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                            <div className="text-center">
                                <Image className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">Print Preview</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-muted/50 rounded-lg">
                            <div>
                                <span className="text-muted-foreground">Dealer</span>
                                <p className="font-medium">{previewJob?.dealer}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Copies</span>
                                <p className="font-medium">{previewJob?.copies}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Approved</span>
                                <p className="font-medium">{previewJob?.approvedAt}</p>
                            </div>
                            {previewJob?.assignedPrinter && (
                                <div>
                                    <span className="text-muted-foreground">Printer</span>
                                    <p className="font-medium">{previewJob.assignedPrinter}</p>
                                </div>
                            )}
                        </div>
                        {previewJob?.printStatus === 'ready-to-print' && (
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => handleDownload(previewJob)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => { setPreviewJob(null); toast.success('Sent to printer'); }}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Send to Print
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Review Request Dialog */}
            <Dialog open={!!reviewDialog.job} onOpenChange={() => setReviewDialog({ job: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Back for Review</DialogTitle>
                        <DialogDescription>
                            Send {reviewDialog.job?.id} back to the designer for changes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Review Note (required)</Label>
                        <Textarea
                            placeholder="Describe what needs to be fixed..."
                            value={reviewNote}
                            onChange={(e) => setReviewNote(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewDialog({ job: null })}>Cancel</Button>
                        <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={!reviewNote.trim()}
                            onClick={() => reviewDialog.job && handleRequestReview(reviewDialog.job, reviewNote)}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Send for Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}