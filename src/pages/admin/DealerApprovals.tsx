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
    Image
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

// Mock pending dealer requests
const MOCK_PENDING_DEALERS = [
    {
        id: '1',
        companyName: 'ABC Prints & Graphics',
        ownerName: 'Ramesh Kumar',
        email: 'ramesh@abcprints.com',
        phone: '+91 98765 43210',
        address: '123, Industrial Area, Kochi, Kerala - 682024',
        gstNumber: '32AABCU9603R1ZX',
        requestedAt: '2024-12-23',
        documents: ['GST Certificate', 'Business Registration'],
        shopImage: '/placeholder-shop.jpg',
    },
    {
        id: '2',
        companyName: 'PrintMaster Solutions',
        ownerName: 'Lakshmi Nair',
        email: 'lakshmi@printmaster.in',
        phone: '+91 98765 43211',
        address: '456, Commercial Complex, Trivandrum, Kerala - 695001',
        gstNumber: '32BBBCU9703R1ZY',
        requestedAt: '2024-12-22',
        documents: ['GST Certificate', 'PAN Card'],
        shopImage: '/placeholder-shop.jpg',
    },
    {
        id: '3',
        companyName: 'Digital Edge Studio',
        ownerName: 'Arun Menon',
        email: 'arun@digitaledge.co',
        phone: '+91 98765 43212',
        address: '789, Tech Park, Kozhikode, Kerala - 673001',
        gstNumber: '32CCCCU9803R1ZZ',
        requestedAt: '2024-12-20',
        documents: ['Business Registration'],
        shopImage: '/placeholder-shop.jpg',
    },
];

// Mock approved dealers
const MOCK_APPROVED_DEALERS = [
    {
        id: '4',
        companyName: 'Quick Print Hub',
        ownerName: 'Suresh Pillai',
        email: 'suresh@quickprint.in',
        phone: '+91 98765 43213',
        address: '101, Market Road, Thrissur, Kerala - 680001',
        approvedAt: '2024-12-15',
        totalOrders: 45,
    },
    {
        id: '5',
        companyName: 'Express Graphics',
        ownerName: 'Maya Thomas',
        email: 'maya@expressgfx.com',
        phone: '+91 98765 43214',
        address: '202, Main Street, Kannur, Kerala - 670001',
        approvedAt: '2024-12-10',
        totalOrders: 32,
    },
];

// Mock rejected dealers
const MOCK_REJECTED_DEALERS = [
    {
        id: '6',
        companyName: 'Fake Company',
        ownerName: 'Unknown',
        email: 'fake@test.com',
        rejectedAt: '2024-12-18',
        reason: 'Invalid GST number and incomplete documentation',
    },
];

const DealerApprovals = () => {
    const [selectedDealer, setSelectedDealer] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = (dealer: any) => {
        console.log('Approving dealer:', dealer);
        // Mock approval
    };

    const handleReject = () => {
        console.log('Rejecting dealer:', selectedDealer, 'Reason:', rejectReason);
        setIsRejectModalOpen(false);
        setRejectReason('');
        // Mock rejection
    };

    const openRejectModal = (dealer: any) => {
        setSelectedDealer(dealer);
        setIsRejectModalOpen(true);
    };

    const openViewModal = (dealer: any) => {
        setSelectedDealer(dealer);
        setIsViewModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dealer Approvals</h1>
                <p className="text-muted-foreground">Review and manage dealer registration requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-orange-200 dark:border-orange-800">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-500">{MOCK_PENDING_DEALERS.length}</div>
                                <p className="text-xs text-muted-foreground">Pending Requests</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 dark:border-green-800">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-500">{MOCK_APPROVED_DEALERS.length}</div>
                                <p className="text-xs text-muted-foreground">Approved Dealers</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-800">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-red-500">{MOCK_REJECTED_DEALERS.length}</div>
                                <p className="text-xs text-muted-foreground">Rejected</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Pending ({MOCK_PENDING_DEALERS.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approved ({MOCK_APPROVED_DEALERS.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="gap-2">
                        <XCircle className="h-4 w-4" />
                        Rejected ({MOCK_REJECTED_DEALERS.length})
                    </TabsTrigger>
                </TabsList>

                {/* Pending Tab */}
                <TabsContent value="pending" className="space-y-4">
                    {MOCK_PENDING_DEALERS.map((dealer) => (
                        <Card key={dealer.id} className="overflow-hidden">
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Store className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{dealer.companyName}</h3>
                                                <p className="text-sm text-muted-foreground">{dealer.ownerName}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pending
                                        </Badge>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            {dealer.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            {dealer.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                                            <MapPin className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{dealer.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="h-4 w-4" />
                                            GST: {dealer.gstNumber}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            Applied: {dealer.requestedAt}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Documents:</span>
                                        {dealer.documents.map((doc) => (
                                            <Badge key={doc} variant="secondary" className="text-xs">
                                                {doc}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-2 p-4 lg:p-6 bg-muted/30 border-t lg:border-t-0 lg:border-l">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => openViewModal(dealer)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprove(dealer)}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => openRejectModal(dealer)}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {MOCK_PENDING_DEALERS.length === 0 && (
                        <Card className="p-8">
                            <div className="text-center text-muted-foreground">
                                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
                                <p>No pending dealer requests</p>
                            </div>
                        </Card>
                    )}
                </TabsContent>

                {/* Approved Tab */}
                <TabsContent value="approved" className="space-y-4">
                    {MOCK_APPROVED_DEALERS.map((dealer) => (
                        <Card key={dealer.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                        <Store className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{dealer.companyName}</h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span>{dealer.ownerName}</span>
                                            <span>•</span>
                                            <span>{dealer.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approved
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {dealer.totalOrders} orders placed
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>

                {/* Rejected Tab */}
                <TabsContent value="rejected" className="space-y-4">
                    {MOCK_REJECTED_DEALERS.map((dealer) => (
                        <Card key={dealer.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                        <Store className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{dealer.companyName}</h3>
                                        <p className="text-sm text-muted-foreground">{dealer.ownerName} • {dealer.email}</p>
                                        <p className="text-sm text-red-500 mt-1">Reason: {dealer.reason}</p>
                                    </div>
                                </div>
                                <Badge variant="destructive">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Rejected
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* View Details Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Dealer Application Details</DialogTitle>
                        <DialogDescription>
                            Review the complete application before approval
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDealer && (
                        <div className="space-y-4">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <Image className="h-12 w-12 text-muted-foreground opacity-50" />
                                <span className="ml-2 text-muted-foreground">Shop Front Image</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Company Name</Label>
                                    <p className="font-medium">{selectedDealer.companyName}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Owner Name</Label>
                                    <p className="font-medium">{selectedDealer.ownerName}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedDealer.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <p className="font-medium">{selectedDealer.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground">Address</Label>
                                    <p className="font-medium">{selectedDealer.address}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">GST Number</Label>
                                    <p className="font-medium">{selectedDealer.gstNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Applied On</Label>
                                    <p className="font-medium">{selectedDealer.requestedAt}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                            Close
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                                handleApprove(selectedDealer);
                                setIsViewModalOpen(false);
                            }}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this dealer application
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Rejection Reason</Label>
                            <Textarea
                                placeholder="Enter the reason for rejection..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DealerApprovals;
