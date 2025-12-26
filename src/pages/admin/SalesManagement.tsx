import React, { useState } from 'react';
import {
    Truck,
    Eye,
    Wallet,
    Package,
    Clock,
    CheckCircle,
    AlertTriangle,
    Download,
    Filter,
    Calendar,
    Plus,
    Search,
    X,
    User,
    MapPin,
    Palette,
    PrinterIcon,
    Printer,
    ShoppingCart,
    ChevronDown,
    ChevronUp,
    CreditCard,
    Receipt,
    TrendingUp,
    TrendingDown,
    DollarSign,
    BadgeDollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

// Routes
const ROUTES = [
    { id: 'north_route', label: 'North Route', color: 'bg-blue-100 text-blue-700' },
    { id: 'city_center', label: 'City Center', color: 'bg-purple-100 text-purple-700' },
    { id: 'south_zone', label: 'South Zone', color: 'bg-green-100 text-green-700' },
    { id: 'east_side', label: 'East Side', color: 'bg-orange-100 text-orange-700' },
];

// Timeline step interface
interface TimelineStep {
    id: string;
    stage: string;
    status: 'completed' | 'in-progress' | 'pending';
    date?: string;
    time?: string;
    role: string;
    person?: string;
    action?: string;
}

// Mock Delivery Orders with detailed timeline
const MOCK_DELIVERIES = [
    {
        id: 'ORD-2024-001',
        product: 'Business Cards - 1000 pcs',
        productType: 'Print',
        dealer: 'ABC Prints & Graphics',
        dealerEmail: 'abc@prints.com',
        partnerType: 'dealer',
        amount: 2500,
        status: 'pending',
        date: '2024-12-24',
        quantity: '1000 pcs',
        route: 'north_route',
        staff: 'Rajan Kumar',
        progress: 17,
        timeline: [
            { id: '1', stage: 'Order Placed', status: 'completed', date: '2024-12-24', time: '10:30 AM', role: 'Dealer', person: 'ABC Prints', action: 'Uploaded order' },
            { id: '2', stage: 'Manager Review', status: 'pending', role: 'Manager', action: 'Pending approval' },
            { id: '3', stage: 'Designer Assigned', status: 'pending', role: 'Designer', action: 'Awaiting assignment' },
            { id: '4', stage: 'Design Completed', status: 'pending', role: 'Designer', action: 'Pending design' },
            { id: '5', stage: 'Printing', status: 'pending', role: 'Printer', action: 'Pending print' },
            { id: '6', stage: 'Ready for Delivery', status: 'pending', role: 'Line Staff', action: 'Pending pickup' },
        ] as TimelineStep[],
    },
    {
        id: 'ORD-2024-002',
        product: 'Visiting Cards - 500 pcs',
        productType: 'Print',
        dealer: 'XYZ Digital Hub',
        dealerEmail: 'xyz@digital.com',
        partnerType: 'dealer',
        amount: 1800,
        status: 'in-transit',
        date: '2024-12-23',
        quantity: '500 pcs',
        route: 'city_center',
        staff: 'Suresh Menon',
        progress: 83,
        timeline: [
            { id: '1', stage: 'Order Placed', status: 'completed', date: '2024-12-23', time: '09:00 AM', role: 'Dealer', person: 'XYZ Digital', action: 'Uploaded order' },
            { id: '2', stage: 'Manager Review', status: 'completed', date: '2024-12-23', time: '10:15 AM', role: 'Manager', person: 'Admin', action: 'Approved' },
            { id: '3', stage: 'Designer Assigned', status: 'completed', date: '2024-12-23', time: '11:00 AM', role: 'Designer', person: 'Arun K', action: 'Assigned' },
            { id: '4', stage: 'Design Completed', status: 'completed', date: '2024-12-23', time: '02:30 PM', role: 'Designer', person: 'Arun K', action: 'Design approved' },
            { id: '5', stage: 'Printing', status: 'completed', date: '2024-12-24', time: '09:00 AM', role: 'Printer', person: 'Ram P', action: 'Printed' },
            { id: '6', stage: 'Ready for Delivery', status: 'in-progress', date: '2024-12-24', time: '11:00 AM', role: 'Line Staff', person: 'Suresh Menon', action: 'Out for delivery' },
        ] as TimelineStep[],
    },
    {
        id: 'ORD-2024-003',
        product: 'Flex Banner - 10x5 ft',
        productType: 'Print',
        dealer: 'Quick Print Solutions',
        dealerEmail: 'quick@prints.com',
        partnerType: 'customer',
        amount: 3200,
        status: 'delivered',
        date: '2024-12-22',
        quantity: '1 pc',
        route: 'south_zone',
        staff: 'Vijay Nair',
        progress: 100,
        timeline: [
            { id: '1', stage: 'Order Placed', status: 'completed', date: '2024-12-22', time: '08:00 AM', role: 'Customer', person: 'Quick Print', action: 'Uploaded order' },
            { id: '2', stage: 'Manager Review', status: 'completed', date: '2024-12-22', time: '09:00 AM', role: 'Manager', person: 'Admin', action: 'Approved' },
            { id: '3', stage: 'Designer Assigned', status: 'completed', date: '2024-12-22', time: '10:00 AM', role: 'Designer', person: 'Priya S', action: 'Assigned' },
            { id: '4', stage: 'Design Completed', status: 'completed', date: '2024-12-22', time: '01:00 PM', role: 'Designer', person: 'Priya S', action: 'Design approved' },
            { id: '5', stage: 'Printing', status: 'completed', date: '2024-12-22', time: '04:00 PM', role: 'Printer', person: 'Sam K', action: 'Printed' },
            { id: '6', stage: 'Ready for Delivery', status: 'completed', date: '2024-12-23', time: '10:30 AM', role: 'Line Staff', person: 'Vijay Nair', action: 'Delivered' },
        ] as TimelineStep[],
    },
    {
        id: 'ORD-2024-004',
        product: 'Letterheads - 200 pcs',
        productType: 'Print',
        dealer: 'Office Supplies Ltd',
        dealerEmail: 'office@supplies.com',
        partnerType: 'dealer',
        amount: 1200,
        status: 'returned',
        date: '2024-12-21',
        quantity: '200 pcs',
        route: 'east_side',
        staff: 'Rajan Kumar',
        progress: 100,
        timeline: [
            { id: '1', stage: 'Order Placed', status: 'completed', date: '2024-12-21', time: '11:00 AM', role: 'Dealer', person: 'Office Supplies', action: 'Uploaded order' },
            { id: '2', stage: 'Manager Review', status: 'completed', date: '2024-12-21', time: '12:00 PM', role: 'Manager', person: 'Admin', action: 'Approved' },
            { id: '3', stage: 'Designer Assigned', status: 'completed', date: '2024-12-21', time: '01:00 PM', role: 'Designer', person: 'Arun K', action: 'Assigned' },
            { id: '4', stage: 'Design Completed', status: 'completed', date: '2024-12-21', time: '03:00 PM', role: 'Designer', person: 'Arun K', action: 'Design approved' },
            { id: '5', stage: 'Printing', status: 'completed', date: '2024-12-22', time: '09:00 AM', role: 'Printer', person: 'Ram P', action: 'Printed' },
            { id: '6', stage: 'Ready for Delivery', status: 'completed', date: '2024-12-22', time: '02:00 PM', role: 'Line Staff', person: 'Rajan Kumar', action: 'Returned - Quality issue' },
        ] as TimelineStep[],
    },
];

// Mock Cash Records with enhanced data including expense breakdown
interface ExpenseItem {
    type: 'salary' | 'fuel' | 'food' | 'travel' | 'other';
    amount: number;
    description: string;
}

interface DeliveryRecord {
    orderId: string;
    customer: string;
    toCollect: number;
    received: number;
    credit: number;
    pending: number;
    paymentMode: 'cash' | 'credit' | 'online';
    status: 'collected' | 'pending' | 'failed';
}

interface CashRecord {
    id: string;
    date: string;
    staffId: string;
    staff: string;
    toCollect: number;
    received: number;
    credits: number;
    expenses: number;
    pending: number;
    verified: boolean;
    expenseBreakdown: ExpenseItem[];
    deliveries: DeliveryRecord[];
}

const MOCK_CASH_RECORDS: CashRecord[] = [
    {
        id: 'CASH-001',
        date: '2024-12-25',
        staffId: '1',
        staff: 'Rajan Kumar',
        toCollect: 18000,
        received: 15600,
        credits: 1200,
        expenses: 850,
        pending: 350,
        verified: true,
        expenseBreakdown: [
            { type: 'salary', amount: 500, description: 'Salary advance' },
            { type: 'fuel', amount: 200, description: 'Petrol' },
            { type: 'food', amount: 100, description: 'Lunch' },
            { type: 'other', amount: 50, description: 'Parking' },
        ],
        deliveries: [
            { orderId: 'ORD-2024-010', customer: 'Sunita Patel', toCollect: 2800, received: 2800, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-011', customer: 'Rajesh Kumar', toCollect: 1500, received: 1500, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-012', customer: 'Amit Singh', toCollect: 3200, received: 3000, credit: 0, pending: 200, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-013', customer: 'Priya Traders', toCollect: 4500, received: 3300, credit: 1200, pending: 0, paymentMode: 'credit', status: 'collected' },
            { orderId: 'ORD-2024-014', customer: 'NK Graphics', toCollect: 3600, received: 3450, credit: 0, pending: 150, paymentMode: 'cash', status: 'collected' },
        ],
    },
    {
        id: 'CASH-002',
        date: '2024-12-25',
        staffId: '2',
        staff: 'Suresh Menon',
        toCollect: 12000,
        received: 8500,
        credits: 2500,
        expenses: 500,
        pending: 1000,
        verified: false,
        expenseBreakdown: [
            { type: 'salary', amount: 300, description: 'Salary advance' },
            { type: 'fuel', amount: 150, description: 'Petrol' },
            { type: 'food', amount: 50, description: 'Tea & snacks' },
        ],
        deliveries: [
            { orderId: 'ORD-2024-015', customer: 'City Prints', toCollect: 2200, received: 2200, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-016', customer: 'Metro Signs', toCollect: 3800, received: 3300, credit: 0, pending: 500, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-017', customer: 'Quick Copy', toCollect: 3500, received: 1000, credit: 2500, pending: 0, paymentMode: 'credit', status: 'collected' },
        ],
    },
    {
        id: 'CASH-003',
        date: '2024-12-25',
        staffId: '3',
        staff: 'Vijay Nair',
        toCollect: 9500,
        received: 6200,
        credits: 1800,
        expenses: 400,
        pending: 1100,
        verified: false,
        expenseBreakdown: [
            { type: 'fuel', amount: 250, description: 'Petrol' },
            { type: 'food', amount: 80, description: 'Lunch' },
            { type: 'travel', amount: 70, description: 'Toll charges' },
        ],
        deliveries: [
            { orderId: 'ORD-2024-018', customer: 'South Prints', toCollect: 1800, received: 1800, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-019', customer: 'Green Graphics', toCollect: 2400, received: 600, credit: 1800, pending: 0, paymentMode: 'credit', status: 'collected' },
            { orderId: 'ORD-2024-020', customer: 'Digital Hub', toCollect: 2000, received: 2000, credit: 0, pending: 0, paymentMode: 'online', status: 'collected' },
            { orderId: 'ORD-2024-021', customer: 'Sri Traders', toCollect: 1800, received: 700, credit: 0, pending: 1100, paymentMode: 'cash', status: 'pending' },
        ],
    },
    {
        id: 'CASH-004',
        date: '2024-12-24',
        staffId: '1',
        staff: 'Rajan Kumar',
        toCollect: 15000,
        received: 12000,
        credits: 2300,
        expenses: 700,
        pending: 0,
        verified: true,
        expenseBreakdown: [
            { type: 'salary', amount: 400, description: 'Salary advance' },
            { type: 'fuel', amount: 180, description: 'Petrol' },
            { type: 'food', amount: 120, description: 'Meals' },
        ],
        deliveries: [
            { orderId: 'ORD-2024-005', customer: 'ABC Traders', toCollect: 4000, received: 4000, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-006', customer: 'XYZ Prints', toCollect: 5000, received: 4700, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-007', customer: 'PQR Solutions', toCollect: 3000, received: 700, credit: 2300, pending: 0, paymentMode: 'credit', status: 'collected' },
        ],
    },
    {
        id: 'CASH-005',
        date: '2024-12-24',
        staffId: '2',
        staff: 'Suresh Menon',
        toCollect: 10000,
        received: 8800,
        credits: 800,
        expenses: 400,
        pending: 0,
        verified: true,
        expenseBreakdown: [
            { type: 'salary', amount: 250, description: 'Salary advance' },
            { type: 'fuel', amount: 150, description: 'Petrol' },
        ],
        deliveries: [
            { orderId: 'ORD-2024-008', customer: 'City Center Ads', toCollect: 4800, received: 4800, credit: 0, pending: 0, paymentMode: 'cash', status: 'collected' },
            { orderId: 'ORD-2024-009', customer: 'Metro Graphics', toCollect: 4000, received: 3200, credit: 800, pending: 0, paymentMode: 'credit', status: 'collected' },
        ],
    },
];

const SalesManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedDelivery, setSelectedDelivery] = useState<typeof MOCK_DELIVERIES[0] | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isAddCashOpen, setIsAddCashOpen] = useState(false);
    const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2024, 11, 23), // Dec 23, 2024
        to: new Date(2024, 11, 25), // Dec 25, 2024
    });

    // New cash record form state
    const [newCashRecord, setNewCashRecord] = useState({
        staff: '',
        toCollect: '',
        received: '',
        credits: '',
        expenses: '',
    });

    // Stats
    const pendingDeliveries = MOCK_DELIVERIES.filter(d => d.status === 'pending').length;
    const inTransitDeliveries = MOCK_DELIVERIES.filter(d => d.status === 'in-transit').length;
    const deliveredCount = MOCK_DELIVERIES.filter(d => d.status === 'delivered').length;
    const returnedCount = MOCK_DELIVERIES.filter(d => d.status === 'returned').length;

    // Cash stats
    // Cash stats - filtered by date range
    const cashRecords = MOCK_CASH_RECORDS.filter(r => {
        if (!dateRange?.from) return true;
        const recordDate = parseISO(r.date);
        const start = startOfDay(dateRange.from);
        const end = endOfDay(dateRange.to || dateRange.from);
        return isWithinInterval(recordDate, { start, end });
    });

    const totalToCollect = cashRecords.reduce((sum, r) => sum + r.toCollect, 0);
    const totalReceived = cashRecords.reduce((sum, r) => sum + r.received, 0);
    const totalCredits = cashRecords.reduce((sum, r) => sum + r.credits, 0);
    const totalExpenses = cashRecords.reduce((sum, r) => sum + r.expenses, 0);
    const totalPending = cashRecords.reduce((sum, r) => sum + r.pending, 0);


    // Filter deliveries
    const filteredDeliveries = MOCK_DELIVERIES.filter(d => {
        const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.dealer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.product.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

        let matchesDate = true;
        if (dateRange?.from) {
            const deliveryDate = parseISO(d.date);
            const start = startOfDay(dateRange.from);
            const end = endOfDay(dateRange.to || dateRange.from);
            matchesDate = isWithinInterval(deliveryDate, { start, end });
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getRouteBadge = (routeId: string) => {
        const route = ROUTES.find(r => r.id === routeId);
        return route ? <Badge className={route.color}>{route.label}</Badge> : <Badge variant="outline">{routeId}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return <Badge className="bg-green-100 text-green-700">Delivered</Badge>;
            case 'in-transit':
                return <Badge className="bg-blue-100 text-blue-700">In Transit</Badge>;
            case 'returned':
                return <Badge className="bg-red-100 text-red-700">Returned</Badge>;
            case 'pending':
            default:
                return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'dealer':
            case 'customer':
                return <ShoppingCart className="h-4 w-4" />;
            case 'manager':
                return <User className="h-4 w-4" />;
            case 'designer':
                return <Palette className="h-4 w-4" />;
            case 'printer':
                return <Printer className="h-4 w-4" />;
            case 'line staff':
                return <Truck className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const handleViewDetails = (delivery: typeof MOCK_DELIVERIES[0]) => {
        setSelectedDelivery(delivery);
        setIsDetailsOpen(true);
    };

    const handleAddCashRecord = () => {
        if (!newCashRecord.staff || !newCashRecord.toCollect) {
            toast.error('Please fill required fields');
            return;
        }
        toast.success('Cash record added successfully');
        setIsAddCashOpen(false);
        setNewCashRecord({ staff: '', toCollect: '', received: '', credits: '', expenses: '' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sales Management</h1>
                        <p className="text-muted-foreground">Manage deliveries and cash collections</p>
                    </div>
                </div>
            </div>

            {/* Main Tabs - Only 2 tabs now */}
            <Tabs defaultValue="deliveries" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-14 p-1">
                    <TabsTrigger value="deliveries" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Truck className="h-4 w-4" />
                        <span>Deliveries</span>
                    </TabsTrigger>
                    <TabsTrigger value="cash" className="h-12 text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Wallet className="h-4 w-4" />
                        <span>Cash</span>
                    </TabsTrigger>
                </TabsList>

                {/* ========== DELIVERIES TAB ========== */}
                <TabsContent value="deliveries" className="space-y-4">
                    {/* Stats */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-amber-600">{pendingDeliveries}</div>
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">{inTransitDeliveries}</div>
                                        <p className="text-xs text-muted-foreground">In Transit</p>
                                    </div>
                                    <Truck className="h-8 w-8 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{deliveredCount}</div>
                                        <p className="text-xs text-muted-foreground">Delivered</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-red-600">{returnedCount}</div>
                                        <p className="text-xs text-muted-foreground">Returns</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('pending')}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === 'in-transit' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('in-transit')}
                            >
                                In Transit
                            </Button>
                            <Button
                                variant={statusFilter === 'delivered' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('delivered')}
                            >
                                Delivered
                            </Button>
                        </div>
                    </div>

                    {/* Delivery Cards with Timeline Preview */}
                    <div className="space-y-4">
                        {filteredDeliveries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted-foreground/25">
                                <div className="p-4 mb-4 rounded-full bg-muted">
                                    <Truck className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium">No deliveries found</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    No deliveries match your current filters and date range.
                                </p>
                            </div>
                        ) : (
                            filteredDeliveries.map((delivery) => (
                                <Card key={delivery.id} className={`hover:shadow-md transition-shadow ${delivery.status === 'returned' ? 'border-red-200 bg-red-50/30' : ''
                                    }`}>
                                    <CardContent className="p-5">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Left Section: Order Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                    <span className="font-bold text-lg">{delivery.id}</span>
                                                    {getStatusBadge(delivery.status)}
                                                    {getRouteBadge(delivery.route)}
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs">{delivery.productType}</Badge>
                                                    <span className="text-sm font-medium">{delivery.product}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-2">
                                                    <span className="font-medium">{delivery.partnerType === 'dealer' ? 'Dealer' : 'Customer'}:</span> {delivery.dealer}
                                                </div>
                                            </div>

                                            {/* Middle Section: Progress */}
                                            <div className="lg:w-64">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-muted-foreground">Order Progress</span>
                                                    <span className="text-sm font-semibold">{delivery.progress}%</span>
                                                </div>
                                                <Progress value={delivery.progress} className="h-2" />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Staff: <span className="font-medium">{delivery.staff}</span>
                                                </p>
                                            </div>

                                            {/* Right Section: Amount & Actions */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold">₹{delivery.amount.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground">{delivery.date}</p>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(delivery)}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* ========== CASH TAB ========== */}
                <TabsContent value="cash" className="space-y-4">
                    {/* Date Filter & Add Record */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Label>Date Range:</Label>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setIsAddCashOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Record
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Cash Summary Cards */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        To Collect
                                    </span>
                                </div>
                                <div className="text-xl font-bold">₹{totalToCollect.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-xs text-muted-foreground">
                                        Received
                                    </span>
                                </div>
                                <div className="text-xl font-bold text-green-600">₹{totalReceived.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs text-muted-foreground">Credits</span>
                                </div>
                                <div className="text-xl font-bold text-blue-600">₹{totalCredits.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Receipt className="h-4 w-4 text-orange-600" />
                                    <span className="text-xs text-muted-foreground">Expenses</span>
                                </div>
                                <div className="text-xl font-bold text-orange-600">₹{totalExpenses.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                    <span className="text-xs text-muted-foreground">Pending</span>
                                </div>
                                <div className="text-xl font-bold text-red-600">₹{totalPending.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cash Records Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cash Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Staff</TableHead>
                                        <TableHead className="text-right">To Collect</TableHead>
                                        <TableHead className="text-right">Received</TableHead>
                                        <TableHead className="text-right">Credits</TableHead>
                                        <TableHead className="text-right">Expenses</TableHead>
                                        <TableHead className="text-right">Pending</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cashRecords.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <Wallet className="h-8 w-8 mb-2 opacity-20" />
                                                    <p>No cash records found for this period</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        cashRecords.map((record) => (
                                            <React.Fragment key={record.id}>
                                                <TableRow
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => setExpandedStaff(expandedStaff === record.id ? null : record.id)}
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <User className="h-4 w-4 text-primary" />
                                                            </div>
                                                            {record.staff}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">₹{record.toCollect.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-green-600 font-medium">₹{record.received.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-blue-600">₹{record.credits.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-orange-600">₹{record.expenses.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-red-600 font-medium">₹{record.pending.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        {record.verified ? (
                                                            <Badge className="bg-green-100 text-green-700">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-100 text-amber-700">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Pending
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon">
                                                            {expandedStaff === record.id ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded Delivery Details */}
                                                {expandedStaff === record.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="bg-muted/30 p-4">
                                                            <div className="space-y-4">
                                                                {/* Expense Breakdown */}
                                                                <div>
                                                                    <h4 className="font-semibold text-sm mb-3">Expense Breakdown</h4>
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {record.expenseBreakdown.map((exp, idx) => (
                                                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                                                                                <Badge className={
                                                                                    exp.type === 'salary' ? 'bg-purple-100 text-purple-700' :
                                                                                        exp.type === 'fuel' ? 'bg-amber-100 text-amber-700' :
                                                                                            exp.type === 'food' ? 'bg-green-100 text-green-700' :
                                                                                                exp.type === 'travel' ? 'bg-blue-100 text-blue-700' :
                                                                                                    'bg-gray-100 text-gray-700'
                                                                                }>
                                                                                    {exp.type}
                                                                                </Badge>
                                                                                <span className="text-sm">{exp.description}</span>
                                                                                <span className="font-bold text-orange-700">₹{exp.amount}</span>
                                                                            </div>
                                                                        ))}
                                                                        <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 border border-orange-300 rounded-lg">
                                                                            <span className="text-sm font-medium">Total Expenses:</span>
                                                                            <span className="font-bold text-orange-700">₹{record.expenses.toLocaleString()}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Delivery Details Table */}
                                                                <div>
                                                                    <h4 className="font-semibold text-sm mb-3">Delivery Details for {record.staff}</h4>
                                                                    <div className="bg-background rounded-lg border overflow-hidden">
                                                                        <table className="w-full text-sm">
                                                                            <thead className="bg-muted">
                                                                                <tr>
                                                                                    <th className="text-left p-3 font-medium">Order</th>
                                                                                    <th className="text-left p-3 font-medium">Customer</th>
                                                                                    <th className="text-right p-3 font-medium">To Collect</th>
                                                                                    <th className="text-right p-3 font-medium">Received</th>
                                                                                    <th className="text-right p-3 font-medium">Credit</th>
                                                                                    <th className="text-right p-3 font-medium">Pending</th>
                                                                                    <th className="text-center p-3 font-medium">Mode</th>
                                                                                    <th className="text-center p-3 font-medium">Status</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {record.deliveries.map((delivery, idx) => (
                                                                                    <tr key={delivery.orderId} className={idx % 2 === 0 ? '' : 'bg-muted/30'}>
                                                                                        <td className="p-3">
                                                                                            <Badge variant="outline">{delivery.orderId}</Badge>
                                                                                        </td>
                                                                                        <td className="p-3 font-medium">{delivery.customer}</td>
                                                                                        <td className="p-3 text-right">₹{delivery.toCollect.toLocaleString()}</td>
                                                                                        <td className="p-3 text-right text-green-600 font-medium">₹{delivery.received.toLocaleString()}</td>
                                                                                        <td className="p-3 text-right text-blue-600">{delivery.credit > 0 ? `₹${delivery.credit.toLocaleString()}` : '-'}</td>
                                                                                        <td className="p-3 text-right text-red-600 font-medium">{delivery.pending > 0 ? `₹${delivery.pending.toLocaleString()}` : '-'}</td>
                                                                                        <td className="p-3 text-center">
                                                                                            <Badge className={
                                                                                                delivery.paymentMode === 'cash' ? 'bg-green-100 text-green-700' :
                                                                                                    delivery.paymentMode === 'credit' ? 'bg-blue-100 text-blue-700' :
                                                                                                        'bg-purple-100 text-purple-700'
                                                                                            }>
                                                                                                {delivery.paymentMode}
                                                                                            </Badge>
                                                                                        </td>
                                                                                        <td className="p-3 text-center">
                                                                                            {delivery.status === 'collected' ? (
                                                                                                <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                                                                                            ) : delivery.status === 'failed' ? (
                                                                                                <X className="h-4 w-4 text-red-600 mx-auto" />
                                                                                            ) : (
                                                                                                <Clock className="h-4 w-4 text-amber-600 mx-auto" />
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent >
            </Tabs >

            {/* ========== ORDER DETAILS POPUP ========== */}
            < Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedDelivery && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {selectedDelivery.id}
                                    {getStatusBadge(selectedDelivery.status)}
                                </DialogTitle>
                                <DialogDescription>
                                    Order details and timeline
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Order Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Product</Label>
                                        <p className="font-medium">{selectedDelivery.product}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Quantity</Label>
                                        <p className="font-medium">{selectedDelivery.quantity}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">{selectedDelivery.partnerType === 'dealer' ? 'Dealer' : 'Customer'}</Label>
                                        <p className="font-medium">{selectedDelivery.dealer}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Email</Label>
                                        <p className="font-medium">{selectedDelivery.dealerEmail}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Amount</Label>
                                        <p className="font-bold text-lg">₹{selectedDelivery.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Order Date</Label>
                                        <p className="font-medium">{selectedDelivery.date}</p>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Order Progress</span>
                                        <span className="text-sm font-bold">{selectedDelivery.progress}%</span>
                                    </div>
                                    <Progress value={selectedDelivery.progress} className="h-3" />
                                </div>

                                {/* Timeline */}
                                <div>
                                    <h4 className="font-semibold mb-4">Order Timeline</h4>
                                    <div className="space-y-4">
                                        {selectedDelivery.timeline.map((step, index) => (
                                            <div key={step.id} className="flex gap-4">
                                                {/* Timeline connector */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        step.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {getRoleIcon(step.role)}
                                                    </div>
                                                    {index < selectedDelivery.timeline.length - 1 && (
                                                        <div className={`w-0.5 flex-1 min-h-[24px] ${step.status === 'completed' ? 'bg-green-300' : 'bg-muted'
                                                            }`} />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{step.stage}</span>
                                                        {step.status === 'completed' && (
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        )}
                                                        {step.status === 'in-progress' && (
                                                            <Badge className="bg-blue-100 text-blue-700 text-xs">In Progress</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        <span className="font-medium">{step.role}</span>
                                                        {step.person && <span> — {step.person}</span>}
                                                        {step.action && <span> — {step.action}</span>}
                                                    </div>
                                                    {step.date && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {step.date} {step.time}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog >

            {/* ========== ADD CASH RECORD POPUP ========== */}
            < Dialog open={isAddCashOpen} onOpenChange={setIsAddCashOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Cash Record</DialogTitle>
                        <DialogDescription>
                            Enter cash collection details for a staff member
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Staff Member *</Label>
                            <Select
                                value={newCashRecord.staff}
                                onValueChange={(v) => setNewCashRecord({ ...newCashRecord, staff: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rajan">Rajan Kumar</SelectItem>
                                    <SelectItem value="suresh">Suresh Menon</SelectItem>
                                    <SelectItem value="vijay">Vijay Nair</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>To Collect (₹) *</Label>
                                <Input
                                    type="number"
                                    placeholder="Expected amount"
                                    value={newCashRecord.toCollect}
                                    onChange={(e) => setNewCashRecord({ ...newCashRecord, toCollect: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Received (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="Actual received"
                                    value={newCashRecord.received}
                                    onChange={(e) => setNewCashRecord({ ...newCashRecord, received: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Credits (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="Credit amount"
                                    value={newCashRecord.credits}
                                    onChange={(e) => setNewCashRecord({ ...newCashRecord, credits: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expenses (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="Expense amount"
                                    value={newCashRecord.expenses}
                                    onChange={(e) => setNewCashRecord({ ...newCashRecord, expenses: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Balance (Pending):</span>
                                <span className="font-bold">
                                    ₹{(
                                        (parseFloat(newCashRecord.toCollect) || 0) -
                                        (parseFloat(newCashRecord.received) || 0) -
                                        (parseFloat(newCashRecord.credits) || 0)
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddCashOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddCashRecord}>
                            Add Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </div >
    );
};

export default SalesManagement;
