import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Clock,
    CheckCircle,
    Search,
    CreditCard,
    FileImage,
    User,
    Eye,
    Download,
    Calendar,
    Layers,
    Image,
    Filter
} from 'lucide-react';
import { DesignerType } from '@/contexts/AuthContext';

type JobCategory = 'poster' | 'brochure' | 'price-tag' | 'pvc-card' | 'flex-banner' | 'id-card';
type JobStatus = 'completed' | 'sent-to-print' | 'printed' | 'delivered';

interface CompletedJob {
    id: string;
    dealer: string;
    dealerPhone: string;
    category: JobCategory;
    printType: string;
    quantity: number;
    size: string;
    completedAt: string;
    status: JobStatus;
    frontDesign: string;
    backDesign?: string;
    earnings: number;
    feedback?: string;
}

interface DesignerCompletedProps {
    designerType?: DesignerType;
}

// Extended mock data with comprehensive completed jobs
const COMPLETED_JOBS: CompletedJob[] = [
    // Normal Designer Jobs
    {
        id: 'JOB-295',
        dealer: 'Star Graphics',
        dealerPhone: '+91 98765 43210',
        category: 'poster',
        printType: 'Flex Print',
        quantity: 50,
        size: '24x36 inches',
        completedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'sent-to-print',
        frontDesign: 'wedding_poster_front.jpg',
        backDesign: 'wedding_poster_back.jpg',
        earnings: 5,
        feedback: 'Excellent work!'
    },
    {
        id: 'JOB-294',
        dealer: 'Fresh Prints Co',
        dealerPhone: '+91 98765 43211',
        category: 'brochure',
        printType: 'Offset',
        quantity: 500,
        size: 'A4 Tri-fold',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: 'printed',
        frontDesign: 'company_brochure_front.pdf',
        backDesign: 'company_brochure_back.pdf',
        earnings: 5
    },
    {
        id: 'JOB-293',
        dealer: 'Metro Advertising',
        dealerPhone: '+91 98765 43212',
        category: 'price-tag',
        printType: 'Digital',
        quantity: 200,
        size: '3x5 inches',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        status: 'delivered',
        frontDesign: 'sale_pricetag.jpg',
        earnings: 5,
        feedback: 'Perfect! Will order again.'
    },
    {
        id: 'JOB-292',
        dealer: 'Alpha Designs',
        dealerPhone: '+91 98765 43213',
        category: 'flex-banner',
        printType: 'Flex Print',
        quantity: 10,
        size: '6x4 feet',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        status: 'delivered',
        frontDesign: 'shop_banner.jpg',
        earnings: 5
    },
    {
        id: 'JOB-291',
        dealer: 'Quick Print Hub',
        dealerPhone: '+91 98765 43214',
        category: 'poster',
        printType: 'Digital',
        quantity: 100,
        size: '18x24 inches',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: 'delivered',
        frontDesign: 'event_poster.jpg',
        earnings: 5
    },
    {
        id: 'JOB-290',
        dealer: 'Omega Traders',
        dealerPhone: '+91 98765 43215',
        category: 'brochure',
        printType: 'Offset',
        quantity: 1000,
        size: 'A5 Bi-fold',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: 'delivered',
        frontDesign: 'product_catalog_front.pdf',
        backDesign: 'product_catalog_back.pdf',
        earnings: 5
    },
    // PVC Card Designer Jobs
    {
        id: 'JOB-395',
        dealer: 'ID Solutions',
        dealerPhone: '+91 98765 43220',
        category: 'pvc-card',
        printType: 'PVC Printing',
        quantity: 100,
        size: 'Standard Card',
        completedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'sent-to-print',
        frontDesign: 'company_id_front.jpg',
        backDesign: 'company_id_back.jpg',
        earnings: 5
    },
    {
        id: 'JOB-394',
        dealer: 'Card Pro',
        dealerPhone: '+91 98765 43221',
        category: 'pvc-card',
        printType: 'PVC Printing',
        quantity: 50,
        size: 'Standard Card',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        status: 'printed',
        frontDesign: 'membership_card_front.jpg',
        backDesign: 'membership_card_back.jpg',
        earnings: 5,
        feedback: 'Good design quality'
    },
    {
        id: 'JOB-393',
        dealer: 'Elite Cards',
        dealerPhone: '+91 98765 43222',
        category: 'id-card',
        printType: 'PVC Printing',
        quantity: 200,
        size: 'Standard Card',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: 'delivered',
        frontDesign: 'school_id_front.jpg',
        backDesign: 'school_id_back.jpg',
        earnings: 5,
        feedback: 'Perfect cards for students!'
    },
    {
        id: 'JOB-392',
        dealer: 'VIP Cards',
        dealerPhone: '+91 98765 43223',
        category: 'pvc-card',
        printType: 'PVC Printing',
        quantity: 500,
        size: 'Standard Card',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        status: 'delivered',
        frontDesign: 'business_card_front.jpg',
        backDesign: 'business_card_back.jpg',
        earnings: 5
    },
];

const getCategoryLabel = (category: JobCategory): string => {
    const labels: Record<JobCategory, string> = {
        'poster': 'Poster',
        'brochure': 'Brochure',
        'price-tag': 'Price Tag',
        'pvc-card': 'PVC Card',
        'flex-banner': 'Flex Banner',
        'id-card': 'ID Card',
    };
    return labels[category];
};

const getCategoryIcon = (category: JobCategory) => {
    if (category === 'pvc-card' || category === 'id-card') return <CreditCard className="h-4 w-4" />;
    return <FileImage className="h-4 w-4" />;
};

const getStatusBadge = (status: JobStatus) => {
    switch (status) {
        case 'completed':
            return <Badge className="bg-blue-100 text-blue-700">Completed</Badge>;
        case 'sent-to-print':
            return <Badge className="bg-orange-100 text-orange-700">Sent to Print</Badge>;
        case 'printed':
            return <Badge className="bg-purple-100 text-purple-700">Printed</Badge>;
        case 'delivered':
            return <Badge className="bg-green-100 text-green-700">Delivered</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const DesignerCompleted = ({ designerType = 'normal' }: DesignerCompletedProps) => {
    const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewJob, setPreviewJob] = useState<CompletedJob | null>(null);

    const isPVC = designerType === 'pvc';

    // Filter jobs based on designer type
    const typeFilteredJobs = COMPLETED_JOBS.filter(job => {
        if (designerType === 'pvc') {
            return job.category === 'pvc-card' || job.category === 'id-card';
        } else {
            return job.category !== 'pvc-card' && job.category !== 'id-card';
        }
    });

    // Apply search filter
    const searchFilteredJobs = typeFilteredJobs.filter(job => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            job.id.toLowerCase().includes(query) ||
            job.dealer.toLowerCase().includes(query) ||
            getCategoryLabel(job.category).toLowerCase().includes(query)
        );
    });

    // Apply time filter
    const filteredJobs = searchFilteredJobs.filter(job => {
        const completedDate = new Date(job.completedAt);
        const now = new Date();
        if (filter === 'today') {
            return completedDate.toDateString() === now.toDateString();
        }
        if (filter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return completedDate >= weekAgo;
        }
        return true;
    });

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffMins < 60) return `${diffMins}m ago`;
        const hours = Math.floor(diffMins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const totalEarnings = filteredJobs.reduce((sum, job) => sum + job.earnings, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Completed Works</h1>
                    <p className="text-muted-foreground">
                        View your finished designs and their status
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={`px-3 py-1.5 text-sm font-medium ${isPVC
                        ? 'border-purple-300 bg-purple-50 text-purple-700'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        }`}
                >
                    {isPVC ? <CreditCard className="h-4 w-4 mr-2" /> : <FileImage className="h-4 w-4 mr-2" />}
                    {filteredJobs.length} Works • ₹{totalEarnings} Earned
                </Badge>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by job ID, dealer, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                    <TabsList>
                        <TabsTrigger value="all">All Time</TabsTrigger>
                        <TabsTrigger value="today">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Today
                        </TabsTrigger>
                        <TabsTrigger value="week">This Week</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredJobs.length}</div>
                        <p className="text-xs text-muted-foreground">works</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalEarnings}</div>
                        <p className="text-xs text-muted-foreground">from designs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {filteredJobs.filter(j => j.status === 'delivered').length}
                        </div>
                        <p className="text-xs text-muted-foreground">to customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No completed works found.</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Complete designs from your workbench to see them here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredJobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {/* Job Info */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className={`p-2 rounded-lg shrink-0 ${isPVC ? 'bg-purple-100' : 'bg-emerald-100'
                                            }`}>
                                            {getCategoryIcon(job.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold">{job.id}</span>
                                                {getStatusBadge(job.status)}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <User className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{job.dealer}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <Badge variant="outline" className="text-xs">
                                                    {getCategoryLabel(job.category)}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    Qty: {job.quantity}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    {job.size}
                                                </Badge>
                                                <Badge className="bg-green-100 text-green-700 text-xs">
                                                    +₹{job.earnings}
                                                </Badge>
                                            </div>
                                            {job.feedback && (
                                                <p className="text-sm text-muted-foreground mt-2 italic">
                                                    "{job.feedback}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {getTimeAgo(job.completedAt)}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPreviewJob(job)}
                                            >
                                                <Eye className="h-3.5 w-3.5 mr-1" />
                                                Preview
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <Dialog open={!!previewJob} onOpenChange={(open) => !open && setPreviewJob(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            {previewJob?.id} - Completed Work
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Job Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Dealer</p>
                                <p className="font-medium">{previewJob?.dealer}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">{previewJob?.dealerPhone}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-medium">{previewJob?.category && getCategoryLabel(previewJob.category)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Print Type</p>
                                <p className="font-medium">{previewJob?.printType}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium">{previewJob?.quantity}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Size</p>
                                <p className="font-medium">{previewJob?.size}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <div className="mt-1">{previewJob?.status && getStatusBadge(previewJob.status)}</div>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Earnings</p>
                                <p className="font-medium text-green-600">+₹{previewJob?.earnings}</p>
                            </div>
                        </div>

                        {/* Design Files */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-3">Design Files</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-4 text-center bg-muted/50">
                                    <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">Front Design</p>
                                    <p className="text-xs text-muted-foreground truncate">{previewJob?.frontDesign}</p>
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Download className="h-3.5 w-3.5 mr-1" />
                                        Download
                                    </Button>
                                </div>
                                {previewJob?.backDesign && (
                                    <div className="border rounded-lg p-4 text-center bg-muted/50">
                                        <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium">Back Design</p>
                                        <p className="text-xs text-muted-foreground truncate">{previewJob?.backDesign}</p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            <Download className="h-3.5 w-3.5 mr-1" />
                                            Download
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Feedback */}
                        {previewJob?.feedback && (
                            <div className="border-t pt-4">
                                <p className="text-sm text-muted-foreground mb-2">Customer Feedback</p>
                                <p className="text-sm italic">"{previewJob.feedback}"</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewJob(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DesignerCompleted;
