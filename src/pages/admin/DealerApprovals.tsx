import React, { useState } from 'react';
import {
    Store,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Building2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    Image,
    Navigation,
    Search,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Route, ROUTES } from '@/data/mockSalesData';

// Mock data
const MOCK_PENDING_DEALERS = [
    {
        id: '1',
        companyName: 'ABC Prints & Graphics',
        ownerName: 'Ramesh Kumar',
        email: 'ramesh@abcprints.com',
        phone: '+91 98765 43210',
        address: '123, Industrial Area, Kochi, Kerala',
        gstNumber: '32AABCU9603R1ZX',
        requestedAt: '2024-12-23',
        documents: ['GST Certificate', 'Business Registration'],
    },
    {
        id: '2',
        companyName: 'PrintMaster Solutions',
        ownerName: 'Lakshmi Nair',
        email: 'lakshmi@printmaster.in',
        phone: '+91 98765 43211',
        address: '456, Commercial Complex, Trivandrum',
        gstNumber: '32BBBCU9703R1ZY',
        requestedAt: '2024-12-22',
        documents: ['GST Certificate', 'PAN Card'],
    },
    {
        id: '3',
        companyName: 'Digital Edge Studio',
        ownerName: 'Arun Menon',
        email: 'arun@digitaledge.co',
        phone: '+91 98765 43212',
        address: '789, Tech Park, Kozhikode',
        gstNumber: '32CCCCU9803R1ZZ',
        requestedAt: '2024-12-20',
        documents: ['Business Registration'],
    },
];

const MOCK_APPROVED_DEALERS = [
    { id: '4', companyName: 'Quick Print Hub', ownerName: 'Suresh Pillai', email: 'suresh@quickprint.in', approvedAt: '2024-12-15', totalOrders: 45 },
    { id: '5', companyName: 'Express Graphics', ownerName: 'Maya Thomas', email: 'maya@expressgfx.com', approvedAt: '2024-12-10', totalOrders: 32 },
];

const MOCK_REJECTED_DEALERS = [
    { id: '6', companyName: 'Fake Company', ownerName: 'Unknown', email: 'fake@test.com', rejectedAt: '2024-12-18', reason: 'Invalid GST number' },
];

const DealerApprovals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDealer, setSelectedDealer] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<Route | ''>('');
    const [rejectReason, setRejectReason] = useState('');

    const openApproveModal = (dealer: any) => {
        setSelectedDealer(dealer);
        setSelectedRoute('');
        setIsApproveModalOpen(true);
    };

    const confirmApproval = () => {
        if (!selectedRoute) return;
        console.log('Approving:', selectedDealer, 'Route:', selectedRoute);
        setIsApproveModalOpen(false);
        setIsViewModalOpen(false);
        setSelectedRoute('');
    };

    const handleReject = () => {
        console.log('Rejecting:', selectedDealer, 'Reason:', rejectReason);
        setIsRejectModalOpen(false);
        setRejectReason('');
    };

    const openRejectModal = (dealer: any) => {
        setSelectedDealer(dealer);
        setIsRejectModalOpen(true);
    };

    const openViewModal = (dealer: any) => {
        setSelectedDealer(dealer);
        setIsViewModalOpen(true);
    };

    // Filter pending dealers
    const filteredPending = MOCK_PENDING_DEALERS.filter(d =>
        d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Store className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Dealer Approvals</h1>
                    <p className="text-sm text-muted-foreground">Review dealer registration requests</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-orange-600">{MOCK_PENDING_DEALERS.length}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-green-600">{MOCK_APPROVED_DEALERS.length}</p>
                                <p className="text-sm text-muted-foreground">Approved</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-red-600">{MOCK_REJECTED_DEALERS.length}</p>
                                <p className="text-sm text-muted-foreground">Rejected</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="pending" className="gap-2">
                            <Clock className="h-4 w-4" />
                            Pending ({MOCK_PENDING_DEALERS.length})
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Approved
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="gap-2">
                            <XCircle className="h-4 w-4" />
                            Rejected
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search dealers..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Pending Tab */}
                <TabsContent value="pending" className="space-y-3">
                    {filteredPending.map((dealer) => (
                        <Card key={dealer.id}>
                            <CardContent className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Store className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold">{dealer.companyName}</h3>
                                                <Badge variant="outline" className="text-orange-600 border-orange-300">
                                                    Pending
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">{dealer.ownerName}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {dealer.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {dealer.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {dealer.requestedAt}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                {dealer.documents.map((doc) => (
                                                    <Badge key={doc} variant="secondary" className="text-xs">
                                                        {doc}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 lg:flex-shrink-0">
                                        <Button variant="outline" size="sm" onClick={() => openViewModal(dealer)}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openApproveModal(dealer)}>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => openRejectModal(dealer)}>
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredPending.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500/50" />
                                <p className="text-muted-foreground">No pending requests</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Approved Tab */}
                <TabsContent value="approved" className="space-y-3">
                    {MOCK_APPROVED_DEALERS.map((dealer) => (
                        <Card key={dealer.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <Store className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{dealer.companyName}</h3>
                                            <p className="text-sm text-muted-foreground">{dealer.ownerName} • {dealer.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Approved
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">{dealer.totalOrders} orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Rejected Tab */}
                <TabsContent value="rejected" className="space-y-3">
                    {MOCK_REJECTED_DEALERS.map((dealer) => (
                        <Card key={dealer.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <Store className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{dealer.companyName}</h3>
                                            <p className="text-sm text-muted-foreground">{dealer.ownerName}</p>
                                            <p className="text-xs text-red-500 mt-1">Reason: {dealer.reason}</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Rejected
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* View Details Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Dealer Details</DialogTitle>
                    </DialogHeader>
                    {selectedDealer && (
                        <div className="space-y-4">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <Image className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground text-xs">Company</p>
                                    <p className="font-medium">{selectedDealer.companyName}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Owner</p>
                                    <p className="font-medium">{selectedDealer.ownerName}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Email</p>
                                    <p className="font-medium">{selectedDealer.email}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Phone</p>
                                    <p className="font-medium">{selectedDealer.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground text-xs">Address</p>
                                    <p className="font-medium">{selectedDealer.address}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">GST Number</p>
                                    <p className="font-medium font-mono">{selectedDealer.gstNumber}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Applied On</p>
                                    <p className="font-medium">{selectedDealer.requestedAt}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => openApproveModal(selectedDealer)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>Provide a reason for rejection</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label>Reason</Label>
                        <Textarea
                            placeholder="Enter rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve Modal */}
            <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Approve Dealer
                        </DialogTitle>
                        <DialogDescription>Assign a delivery route</DialogDescription>
                    </DialogHeader>
                    {selectedDealer && (
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                                <Store className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">{selectedDealer.companyName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedDealer.ownerName}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4" />
                                    Delivery Route
                                </Label>
                                <Select value={selectedRoute} onValueChange={(val) => setSelectedRoute(val as Route)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Select route" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROUTES.map((route) => (
                                            <SelectItem key={route.id} value={route.id}>{route.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={confirmApproval} disabled={!selectedRoute}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DealerApprovals;
