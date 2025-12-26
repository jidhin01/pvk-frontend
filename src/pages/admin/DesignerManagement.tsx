import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Users,
    CheckCircle,
    Palette,
    Layers,
    Eye,
    AlertTriangle,
    Download,
    PlayCircle,
    CircleDashed,
    ListChecks,
    Clock,
    Image,
    Printer,
    RotateCcw,
    XCircle,
    CheckCircle2,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

// Workflow statuses:
// not-assigned: Waiting to be picked by designer
// working: Designer is working on it
// pending-review: Completed by designer, waiting for admin verification
// review-requested: Admin requested changes, sent back to designer
// approved: Verified and approved, ready for print

// Mock All Designs Data - includes all workflow statuses
const MOCK_ALL_DESIGNS = [
    { id: 'JOB-301', dealer: 'Star Graphics', category: 'poster', workflowStatus: 'not-assigned', priority: 'urgent', createdAt: '10 min ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-302', dealer: 'Fresh Prints', category: 'brochure', workflowStatus: 'not-assigned', priority: 'normal', createdAt: '25 min ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-303', dealer: 'Metro Ads', category: 'price-tag', workflowStatus: 'working', priority: 'normal', createdAt: '30 min ago', assignedTo: 'Anu Designer', preview: '/api/placeholder/400/300' },
    { id: 'JOB-401', dealer: 'ID Solutions', category: 'pvc-card', workflowStatus: 'not-assigned', priority: 'urgent', createdAt: '15 min ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-402', dealer: 'Card Pro', category: 'pvc-card', workflowStatus: 'working', priority: 'normal', createdAt: '40 min ago', assignedTo: 'Deepa PVC Designer', preview: '/api/placeholder/400/300' },
    { id: 'JOB-304', dealer: 'Alpha Designs', category: 'flex-banner', workflowStatus: 'not-assigned', priority: 'urgent', createdAt: '5 min ago', preview: '/api/placeholder/400/300' },
    // Pending Review - waiting for admin approval
    { id: 'JOB-295', dealer: 'Star Graphics', category: 'poster', workflowStatus: 'pending-review', priority: 'normal', createdAt: '2h ago', assignedTo: 'Anu Designer', completedAt: '30 min ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-294', dealer: 'Fresh Prints', category: 'brochure', workflowStatus: 'pending-review', priority: 'normal', createdAt: '4h ago', assignedTo: 'Ravi Designer', completedAt: '2h ago', preview: '/api/placeholder/400/300' },
    // Review Requested - sent back to designer for changes
    { id: 'JOB-290', dealer: 'City Ads', category: 'poster', workflowStatus: 'review-requested', priority: 'normal', createdAt: '1d ago', assignedTo: 'Anu Designer', reviewNote: 'Colors don\'t match brand guidelines. Please fix.', reviewRequestedAt: '1h ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-288', dealer: 'Metro Signs', category: 'flex-banner', workflowStatus: 'review-requested', priority: 'urgent', createdAt: '2d ago', assignedTo: 'Ravi Designer', reviewNote: 'Text alignment needs fixing on right side.', reviewRequestedAt: '3h ago', preview: '/api/placeholder/400/300' },
    // Approved - verified and ready for print
    { id: 'JOB-395', dealer: 'ID Solutions', category: 'pvc-card', workflowStatus: 'approved', priority: 'normal', createdAt: '3h ago', assignedTo: 'Deepa PVC Designer', completedAt: '45 min ago', approvedAt: '20 min ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-293', dealer: 'Metro Ads', category: 'price-tag', workflowStatus: 'approved', priority: 'normal', createdAt: '6h ago', assignedTo: 'Anu Designer', completedAt: '4h ago', approvedAt: '3h 30m ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-394', dealer: 'Card Pro', category: 'pvc-card', workflowStatus: 'approved', priority: 'normal', createdAt: '5h ago', assignedTo: 'Manoj PVC Designer', completedAt: '3h ago', approvedAt: '2h 45m ago', preview: '/api/placeholder/400/300' },
    { id: 'JOB-305', dealer: 'City Prints', category: 'poster', workflowStatus: 'working', priority: 'normal', createdAt: '1h ago', assignedTo: 'Ravi Designer', preview: '/api/placeholder/400/300' },
];

type Design = typeof MOCK_ALL_DESIGNS[0] & { reviewNote?: string; reviewRequestedAt?: string; approvedAt?: string };

const DesignerManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [previewDesign, setPreviewDesign] = useState<Design | null>(null);
    const [reviewDialog, setReviewDialog] = useState<{ design: Design | null; action: 'approve' | 'reject' | 'review' | null }>({ design: null, action: null });
    const [reviewNote, setReviewNote] = useState('');

    // Filter designs based on search
    const filterDesigns = (designs: Design[]) => {
        if (!searchQuery) return designs;
        return designs.filter(d =>
            d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.dealer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Workflow stats
    const totalDesigns = MOCK_ALL_DESIGNS.length;
    const workingDesigns = MOCK_ALL_DESIGNS.filter(d => d.workflowStatus === 'working').length;
    const notAssignedDesigns = MOCK_ALL_DESIGNS.filter(d => d.workflowStatus === 'not-assigned').length;
    const pendingReviewDesigns = MOCK_ALL_DESIGNS.filter(d => d.workflowStatus === 'pending-review').length;
    const reviewRequestedDesigns = MOCK_ALL_DESIGNS.filter(d => d.workflowStatus === 'review-requested').length;
    const approvedDesigns = MOCK_ALL_DESIGNS.filter(d => d.workflowStatus === 'approved').length;

    const getCategoryBadge = (category: string) => {
        if (category === 'pvc-card' || category === 'id-card') {
            return <Badge className="bg-purple-100 text-purple-700">PVC Card</Badge>;
        }
        const labels: Record<string, string> = {
            'poster': 'Poster',
            'brochure': 'Brochure',
            'price-tag': 'Price Tag',
            'flex-banner': 'Flex Banner',
        };
        return <Badge variant="secondary">{labels[category] || category}</Badge>;
    };

    const getWorkflowBadge = (status: string) => {
        switch (status) {
            case 'not-assigned':
                return <Badge className="bg-orange-100 text-orange-700"><CircleDashed className="h-3 w-3 mr-1" />Not Assigned</Badge>;
            case 'working':
                return <Badge className="bg-blue-100 text-blue-700"><PlayCircle className="h-3 w-3 mr-1" />Working</Badge>;
            case 'pending-review':
                return <Badge className="bg-yellow-100 text-yellow-700"><AlertCircle className="h-3 w-3 mr-1" />Pending Review</Badge>;
            case 'review-requested':
                return <Badge className="bg-red-100 text-red-700"><RotateCcw className="h-3 w-3 mr-1" />Review Requested</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleApprove = (design: Design) => {
        toast.success(`Design ${design.id} approved and sent to print`);
        setReviewDialog({ design: null, action: null });
    };

    const handleReject = (design: Design) => {
        toast.error(`Design ${design.id} rejected`);
        setReviewDialog({ design: null, action: null });
    };

    const handleRequestReview = (design: Design, note: string) => {
        toast.info(`Review requested for ${design.id}. Sent back to ${design.assignedTo}`);
        setReviewNote('');
        setReviewDialog({ design: null, action: null });
    };

    // Render design card
    const renderDesignCard = (design: Design) => (
        <Card key={design.id} className={`group hover:shadow-sm transition-all border-l-4 ${design.priority === 'urgent' ? 'border-l-orange-500' :
            design.workflowStatus === 'review-requested' ? 'border-l-red-500' :
                design.workflowStatus === 'approved' ? 'border-l-green-500' :
                    'border-l-transparent'
            }`}>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Preview thumbnail */}
                    <div
                        className="w-full sm:w-20 h-20 bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors relative flex-shrink-0"
                        onClick={() => setPreviewDesign(design)}
                    >
                        <Image className="h-8 w-8 text-muted-foreground/50" />
                        {design.workflowStatus === 'pending-review' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                <AlertCircle className="h-3 w-3 text-white" />
                            </div>
                        )}
                        {design.workflowStatus === 'review-requested' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                <RotateCcw className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-base">{design.id}</span>
                                    {design.priority === 'urgent' && (
                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Urgent</Badge>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-foreground/80">{design.dealer}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {getCategoryBadge(design.category)}
                                    {getWorkflowBadge(design.workflowStatus)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setPreviewDesign(design)}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Preview Design
                                        </DropdownMenuItem>
                                        {design.workflowStatus === 'not-assigned' && (
                                            <DropdownMenuItem>
                                                <Users className="h-4 w-4 mr-2" />
                                                Assign to Designer
                                            </DropdownMenuItem>
                                        )}
                                        {design.workflowStatus === 'pending-review' && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-green-600" onClick={() => setReviewDialog({ design, action: 'approve' })}>
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Approve for Print
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-orange-600" onClick={() => setReviewDialog({ design, action: 'review' })}>
                                                    <RotateCcw className="h-4 w-4 mr-2" />
                                                    Request Changes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setReviewDialog({ design, action: 'reject' })}>
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {design.workflowStatus === 'approved' && (
                                            <DropdownMenuItem>
                                                <Printer className="h-4 w-4 mr-2" />
                                                Send to Print Queue
                                            </DropdownMenuItem>
                                        )}
                                        {design.workflowStatus !== 'approved' && design.workflowStatus !== 'not-assigned' && (
                                            <DropdownMenuItem>
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                Mark as Urgent
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Review Note */}
                        {design.workflowStatus === 'review-requested' && design.reviewNote && (
                            <div className="mt-3 p-3 bg-red-50/50 rounded-lg text-sm border border-red-100">
                                <div className="flex items-center gap-1.5 text-red-700 font-medium mb-1">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Review Note from Admin
                                </div>
                                <p className="text-red-600 pl-5 text-xs sm:text-sm">{design.reviewNote}</p>
                            </div>
                        )}

                        {/* Footer Info & Actions */}
                        <div className="mt-4 flex items-center justify-between border-t pt-3">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {design.assignedTo && (
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" />
                                        {design.assignedTo}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    {design.approvedAt ? `Approved ${design.approvedAt}` :
                                        design.completedAt ? `Completed ${design.completedAt}` :
                                            design.reviewRequestedAt ? `Sent back ${design.reviewRequestedAt}` :
                                                design.createdAt}
                                </div>
                            </div>

                            {/* Action buttons for pending review */}
                            {design.workflowStatus === 'pending-review' && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                                        onClick={() => setReviewDialog({ design, action: 'review' })}
                                    >
                                        Request Changes
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-7 text-xs bg-green-600 hover:bg-green-700"
                                        onClick={() => setReviewDialog({ design, action: 'approve' })}
                                    >
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </div>
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
                    <h1 className="text-3xl font-bold tracking-tight">Design Workflow</h1>
                    <p className="text-muted-foreground mt-1">Manage and track design requests</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search designs..."
                        className="pl-9 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total</p>
                            <div className="text-2xl font-bold">{totalDesigns}</div>
                        </div>
                        <div className="p-2 rounded-full bg-slate-100">
                            <Layers className="h-4 w-4 text-slate-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                            <div className="text-2xl font-bold text-orange-600">{notAssignedDesigns}</div>
                        </div>
                        <div className="p-2 rounded-full bg-orange-100">
                            <CircleDashed className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                            <div className="text-2xl font-bold text-blue-600">{workingDesigns}</div>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <PlayCircle className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50/50 border-yellow-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-700">Pending Review</p>
                            <div className="text-2xl font-bold text-yellow-700">{pendingReviewDesigns}</div>
                        </div>
                        <div className="p-2 rounded-full bg-yellow-100">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50/50 border-red-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-700">Changes Req.</p>
                            <div className="text-2xl font-bold text-red-700">{reviewRequestedDesigns}</div>
                        </div>
                        <div className="p-2 rounded-full bg-red-100">
                            <RotateCcw className="h-4 w-4 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Approved</p>
                            <div className="text-2xl font-bold text-green-600">{approvedDesigns}</div>
                        </div>
                        <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs - 4 tabs for workflow */}
            <Tabs defaultValue="all-designs" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-12">
                    <TabsTrigger value="all-designs" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <ListChecks className="h-4 w-4" />
                        All Designs
                    </TabsTrigger>
                    <TabsTrigger value="working" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <PlayCircle className="h-4 w-4" />
                        Working
                    </TabsTrigger>
                    <TabsTrigger value="not-assigned" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <CircleDashed className="h-4 w-4" />
                        Not Assigned
                    </TabsTrigger>
                    <TabsTrigger value="complete" className="gap-2 relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <CheckCircle className="h-4 w-4" />
                        Complete
                        {pendingReviewDesigns > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {pendingReviewDesigns}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* All Designs Tab */}
                <TabsContent value="all-designs" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">All Designs</h3>
                            <p className="text-sm text-muted-foreground">{filterDesigns(MOCK_ALL_DESIGNS as Design[]).length} designs in system</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filterDesigns(MOCK_ALL_DESIGNS as Design[]).map(design => renderDesignCard(design))}
                    </div>
                </TabsContent>

                {/* Working Tab */}
                <TabsContent value="working" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Working</h3>
                            <p className="text-sm text-muted-foreground">{filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'working' || d.workflowStatus === 'review-requested')).length} designs in progress</p>
                        </div>
                    </div>
                    {/* Show Review Requested first as they need attention */}
                    {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'review-requested')).length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Sent Back for Review ({filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'review-requested')).length})
                            </h4>
                            {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'review-requested')).map(design => renderDesignCard(design))}
                        </div>
                    )}
                    <div className="space-y-3">
                        {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'working')).length === 0 && filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'review-requested')).length === 0 ? (
                            <Card className="p-8 text-center">
                                <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">No designs currently in progress</p>
                            </Card>
                        ) : (
                            <>
                                {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'working')).length > 0 && (
                                    <>
                                        <h4 className="text-sm font-medium text-blue-600 flex items-center gap-2 mt-4">
                                            <PlayCircle className="h-4 w-4" />
                                            Currently Working ({filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'working')).length})
                                        </h4>
                                        {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'working')).map(design => renderDesignCard(design))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </TabsContent>

                {/* Not Assigned Tab */}
                <TabsContent value="not-assigned" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Not Assigned</h3>
                            <p className="text-sm text-muted-foreground">{filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'not-assigned')).length} designs waiting to be picked</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'not-assigned')).length === 0 ? (
                            <Card className="p-8 text-center">
                                <CircleDashed className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">All designs have been assigned</p>
                            </Card>
                        ) : (
                            filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'not-assigned')).map(design => renderDesignCard(design))
                        )}
                    </div>
                </TabsContent>

                {/* Complete Tab - Shows Pending Review and Approved */}
                <TabsContent value="complete" className="space-y-4">
                    {/* Pending Review Section - Needs Admin Action */}
                    {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'pending-review')).length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    <h3 className="text-lg font-semibold text-yellow-700">Pending Verification</h3>
                                    <Badge className="bg-yellow-100 text-yellow-700">{filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'pending-review')).length} awaiting</Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">These designs are completed and waiting for your verification before printing</p>
                            {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'pending-review')).map(design => renderDesignCard(design))}
                        </div>
                    )}

                    {/* Approved Section */}
                    <div className="space-y-3 mt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold">Approved</h3>
                                <Badge className="bg-green-100 text-green-700">{filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'approved')).length} ready</Badge>
                            </div>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        {filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'approved')).length === 0 ? (
                            <Card className="p-8 text-center">
                                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">No approved designs yet</p>
                            </Card>
                        ) : (
                            filterDesigns((MOCK_ALL_DESIGNS as Design[]).filter(d => d.workflowStatus === 'approved')).map(design => renderDesignCard(design))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview Dialog */}
            <Dialog open={!!previewDesign} onOpenChange={() => setPreviewDesign(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>{previewDesign?.id}</span>
                            {previewDesign && getCategoryBadge(previewDesign.category)}
                            {previewDesign && getWorkflowBadge(previewDesign.workflowStatus)}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                            <div className="text-center">
                                <Image className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">Design Preview</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Dealer:</span>
                                <span className="ml-2 font-medium">{previewDesign?.dealer}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Created:</span>
                                <span className="ml-2 font-medium">{previewDesign?.createdAt}</span>
                            </div>
                            {previewDesign?.assignedTo && (
                                <div>
                                    <span className="text-muted-foreground">Assigned To:</span>
                                    <span className="ml-2 font-medium">{previewDesign.assignedTo}</span>
                                </div>
                            )}
                            {previewDesign?.completedAt && (
                                <div>
                                    <span className="text-muted-foreground">Completed:</span>
                                    <span className="ml-2 font-medium">{previewDesign.completedAt}</span>
                                </div>
                            )}
                        </div>
                        {previewDesign?.workflowStatus === 'review-requested' && previewDesign.reviewNote && (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm font-medium text-red-700 mb-1">Review Note:</p>
                                <p className="text-sm text-red-600">{previewDesign.reviewNote}</p>
                            </div>
                        )}
                        {previewDesign?.workflowStatus === 'pending-review' && (
                            <div className="flex gap-2 pt-2">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => { setPreviewDesign(null); setReviewDialog({ design: previewDesign, action: 'approve' }); }}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Approve for Print
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 text-orange-600 border-orange-300"
                                    onClick={() => { setPreviewDesign(null); setReviewDialog({ design: previewDesign, action: 'review' }); }}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Request Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Review Action Dialog */}
            <Dialog open={!!reviewDialog.design} onOpenChange={() => setReviewDialog({ design: null, action: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {reviewDialog.action === 'approve' && 'Approve Design'}
                            {reviewDialog.action === 'reject' && 'Reject Design'}
                            {reviewDialog.action === 'review' && 'Request Changes'}
                        </DialogTitle>
                        <DialogDescription>
                            {reviewDialog.action === 'approve' && `Approve ${reviewDialog.design?.id} for printing?`}
                            {reviewDialog.action === 'reject' && `Reject ${reviewDialog.design?.id}? This action cannot be undone.`}
                            {reviewDialog.action === 'review' && `Send ${reviewDialog.design?.id} back to ${reviewDialog.design?.assignedTo} for changes.`}
                        </DialogDescription>
                    </DialogHeader>
                    {reviewDialog.action === 'review' && (
                        <div className="space-y-2">
                            <Label>Review Note (required)</Label>
                            <Textarea
                                placeholder="Describe what needs to be changed..."
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                rows={3}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewDialog({ design: null, action: null })}>
                            Cancel
                        </Button>
                        {reviewDialog.action === 'approve' && (
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => reviewDialog.design && handleApprove(reviewDialog.design)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                        )}
                        {reviewDialog.action === 'reject' && (
                            <Button variant="destructive" onClick={() => reviewDialog.design && handleReject(reviewDialog.design)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                        )}
                        {reviewDialog.action === 'review' && (
                            <Button
                                className="bg-orange-600 hover:bg-orange-700"
                                disabled={!reviewNote.trim()}
                                onClick={() => reviewDialog.design && handleRequestReview(reviewDialog.design, reviewNote)}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Send for Review
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DesignerManagement;
