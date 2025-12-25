// Mock Sales/Line Staff Data
// Delivery types, routes, payment methods, and financial tracking

export type DeliveryStatus = 'pending' | 'delivered' | 'returned' | 'in-transit';
export type PaymentStatus = 'pending' | 'paid' | 'partial';
export type PaymentMethod = 'cash' | 'gpay' | 'bank_transfer' | 'credit';
export type Route = 'north_route' | 'city_center' | 'south_zone' | 'east_side';
export type OrderStage = 'uploaded' | 'designer_assigned' | 'design_completed' | 'printing' | 'printed' | 'line_staff_assigned' | 'in_transit' | 'delivered';

export interface OrderTimelineStep {
    stage: OrderStage;
    label: string;
    completed: boolean;
    completedAt?: string;
    person?: string;
    role?: string;
}

export interface Delivery {
    id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerType: 'dealer' | 'customer';
    location: string;
    route: Route;
    status: DeliveryStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    amount: number;
    amountPaid: number;
    itemDescription: string;
    designPreviewUrl?: string;
    printPreviewUrl?: string;
    quantity: number;
    isQuantityVerified: boolean;
    isDesignVerified: boolean;
    returnReason?: string;
    deliveredAt?: string;
    createdAt: string;
    isReadyForDelivery: boolean;
    takenForDelivery: boolean;
    timeline: OrderTimelineStep[];
}

export interface LineStaffInfo {
    id: string;
    name: string;
    phone: string;
    assignedRoute: Route;
    todayDeliveries: number;
    todayCompleted: number;
    cashCollected: number;
}

export interface Expense {
    id: string;
    type: 'salary' | 'fuel' | 'food' | 'travel' | 'other';
    amount: number;
    description: string;
    createdAt: string;
    verifiedByFinance?: boolean;
}

export interface DailyFinancials {
    date: string;
    cashCollected: number;
    onlineReceived: number;
    creditGiven: number;
    salaryTaken: number;
    otherExpenses: number;
    cashToDeposit: number;
}

export interface PaymentRecord {
    id: string;
    deliveryId: string;
    customerName: string;
    amount: number;
    method: PaymentMethod;
    timestamp: string;
    status: 'confirmed' | 'pending';
}

export interface RecentActivity {
    id: string;
    action: string;
    entity: string;
    time: string;
    type: 'success' | 'warning' | 'info';
}

export const ROUTES: { id: Route; label: string; color: string }[] = [
    { id: 'north_route', label: 'North Route', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: 'city_center', label: 'City Center', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { id: 'south_zone', label: 'South Zone', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { id: 'east_side', label: 'East Side', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
];

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'cash', label: 'Cash', icon: 'Wallet' },
    { id: 'gpay', label: 'GPay', icon: 'Smartphone' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: 'Building2' },
    { id: 'credit', label: 'Credit', icon: 'Clock' },
];

// Mock Line Staff Info
export const MOCK_LINE_STAFF: LineStaffInfo = {
    id: 'LS-001',
    name: 'Rajan Kumar',
    phone: '+91 98765 00001',
    assignedRoute: 'north_route',
    todayDeliveries: 8,
    todayCompleted: 3,
    cashCollected: 5600,
};

// Helper to generate timeline
const generateTimeline = (currentStage: OrderStage): OrderTimelineStep[] => {
    const stages: { stage: OrderStage; label: string }[] = [
        { stage: 'uploaded', label: 'Work Uploaded' },
        { stage: 'designer_assigned', label: 'Designer Assigned' },
        { stage: 'design_completed', label: 'Design Completed' },
        { stage: 'printing', label: 'Printing Started' },
        { stage: 'printed', label: 'Printing Completed' },
        { stage: 'line_staff_assigned', label: 'Line Staff Assigned' },
        { stage: 'in_transit', label: 'Out for Delivery' },
        { stage: 'delivered', label: 'Delivered' },
    ];

    const currentIndex = stages.findIndex(s => s.stage === currentStage);
    return stages.map((s, i) => ({
        ...s,
        completed: i <= currentIndex,
        completedAt: i <= currentIndex ? `Dec ${24 - (currentIndex - i)}, 2024` : undefined,
        person: i <= currentIndex ? ['System', 'Anu Designer', 'Anu Designer', 'Printer A', 'Printer A', 'Rajan Kumar', 'Rajan Kumar', 'Rajan Kumar'][i] : undefined,
        role: i <= currentIndex ? ['System', 'Designer', 'Designer', 'Printer', 'Printer', 'Sales Staff', 'Sales Staff', 'Sales Staff'][i] : undefined,
    }));
};

// Mock Deliveries with enhanced data
export const MOCK_DELIVERIES: Delivery[] = [
    // Pending Deliveries (4)
    {
        id: 'DEL-001',
        orderId: 'ORD-2024-1001',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 98765 43210',
        customerType: 'dealer',
        location: 'Shop No. 14, Market Road, Sector 5',
        route: 'north_route',
        status: 'pending',
        paymentStatus: 'pending',
        amount: 1500,
        amountPaid: 0,
        itemDescription: 'Visiting Cards - 500 pcs (Matt Lamination)',
        designPreviewUrl: '/placeholder-design.jpg',
        printPreviewUrl: '/placeholder-print.jpg',
        quantity: 500,
        isQuantityVerified: false,
        isDesignVerified: false,
        createdAt: '2024-12-24T08:00:00',
        isReadyForDelivery: true,
        takenForDelivery: true,
        timeline: generateTimeline('line_staff_assigned'),
    },
    {
        id: 'DEL-002',
        orderId: 'ORD-2024-1002',
        customerName: 'Priya Sharma',
        customerPhone: '+91 87654 32109',
        customerType: 'customer',
        location: 'Office 301, Tech Park, MG Road',
        route: 'city_center',
        status: 'pending',
        paymentStatus: 'partial',
        amount: 3200,
        amountPaid: 1000,
        itemDescription: 'Letterheads - 200 pcs + Envelopes - 200 pcs',
        designPreviewUrl: '/placeholder-design.jpg',
        printPreviewUrl: '/placeholder-print.jpg',
        quantity: 400,
        isQuantityVerified: false,
        isDesignVerified: false,
        createdAt: '2024-12-24T09:30:00',
        isReadyForDelivery: true,
        takenForDelivery: false,
        timeline: generateTimeline('line_staff_assigned'),
    },
    {
        id: 'DEL-003',
        orderId: 'ORD-2024-1003',
        customerName: 'Mohammed Ali',
        customerPhone: '+91 76543 21098',
        customerType: 'dealer',
        location: '45, Gandhi Nagar, Near Bus Stand',
        route: 'south_zone',
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'gpay',
        amount: 850,
        amountPaid: 850,
        itemDescription: 'Self-Ink Rubber Stamp (Round)',
        designPreviewUrl: '/placeholder-design.jpg',
        printPreviewUrl: '/placeholder-print.jpg',
        quantity: 1,
        isQuantityVerified: false,
        isDesignVerified: false,
        createdAt: '2024-12-24T10:15:00',
        isReadyForDelivery: true,
        takenForDelivery: true,
        timeline: generateTimeline('line_staff_assigned'),
    },
    {
        id: 'DEL-006',
        orderId: 'ORD-2024-1006',
        customerName: 'Arjun Traders',
        customerPhone: '+91 98765 11111',
        customerType: 'dealer',
        location: 'Block A, Industrial Estate, NH Road',
        route: 'north_route',
        status: 'in-transit',
        paymentStatus: 'pending',
        amount: 2200,
        amountPaid: 0,
        itemDescription: 'Flex Banner - 4x3 ft',
        designPreviewUrl: '/placeholder-design.jpg',
        printPreviewUrl: '/placeholder-print.jpg',
        quantity: 1,
        isQuantityVerified: true,
        isDesignVerified: true,
        createdAt: '2024-12-24T07:30:00',
        isReadyForDelivery: true,
        takenForDelivery: true,
        timeline: generateTimeline('in_transit'),
    },
    // Completed Delivery (1)
    {
        id: 'DEL-004',
        orderId: 'ORD-2024-0998',
        customerName: 'Sunita Patel',
        customerPhone: '+91 65432 10987',
        customerType: 'customer',
        location: '78, Industrial Area, Phase 2',
        route: 'east_side',
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        amount: 2800,
        amountPaid: 2800,
        itemDescription: 'Brochures - 100 pcs (Tri-fold, Gloss)',
        designPreviewUrl: '/placeholder-design.jpg',
        printPreviewUrl: '/placeholder-print.jpg',
        quantity: 100,
        isQuantityVerified: true,
        isDesignVerified: true,
        deliveredAt: '2024-12-24T11:45:00',
        createdAt: '2024-12-23T16:00:00',
        isReadyForDelivery: false,
        takenForDelivery: false,
        timeline: generateTimeline('delivered'),
    },
    // Sales Return (1)
    {
        id: 'DEL-005',
        orderId: 'ORD-2024-0995',
        customerName: 'Amit Verma',
        customerPhone: '+91 54321 09876',
        customerType: 'dealer',
        location: '12, Commercial Complex, Station Road',
        route: 'city_center',
        status: 'returned',
        paymentStatus: 'pending',
        amount: 1200,
        amountPaid: 0,
        itemDescription: 'PAN Card Print - 10 pcs',
        designPreviewUrl: '/placeholder-design.jpg',
        printPreviewUrl: '/placeholder-print.jpg',
        quantity: 10,
        isQuantityVerified: true,
        isDesignVerified: false,
        returnReason: 'Print quality issue - Colors faded and text not sharp',
        createdAt: '2024-12-23T14:30:00',
        isReadyForDelivery: false,
        takenForDelivery: false,
        timeline: generateTimeline('in_transit'),
    },
];

// Pre-filled financial stats
export const MOCK_TODAY_FINANCIALS: DailyFinancials = {
    date: '2024-12-24',
    cashCollected: 5600,
    onlineReceived: 3200,
    creditGiven: 2200,
    salaryTaken: 500,
    otherExpenses: 350,
    cashToDeposit: 4750,
};

// Mock expenses
export const MOCK_EXPENSES: Expense[] = [
    {
        id: 'EXP-001',
        type: 'salary',
        amount: 500,
        description: 'Daily salary advance',
        createdAt: '2024-12-24T09:00:00',
        verifiedByFinance: true,
    },
    {
        id: 'EXP-002',
        type: 'fuel',
        amount: 200,
        description: 'Petrol for delivery bike',
        createdAt: '2024-12-24T08:30:00',
        verifiedByFinance: true,
    },
    {
        id: 'EXP-003',
        type: 'food',
        amount: 150,
        description: 'Lunch',
        createdAt: '2024-12-24T13:00:00',
        verifiedByFinance: false,
    },
];

// Mock payment records
export const MOCK_PAYMENT_RECORDS: PaymentRecord[] = [
    {
        id: 'PAY-001',
        deliveryId: 'DEL-004',
        customerName: 'Sunita Patel',
        amount: 2800,
        method: 'cash',
        timestamp: '2024-12-24T11:45:00',
        status: 'confirmed',
    },
    {
        id: 'PAY-002',
        deliveryId: 'DEL-002',
        customerName: 'Priya Sharma',
        amount: 1000,
        method: 'gpay',
        timestamp: '2024-12-24T09:35:00',
        status: 'confirmed',
    },
    {
        id: 'PAY-003',
        deliveryId: 'DEL-003',
        customerName: 'Mohammed Ali',
        amount: 850,
        method: 'gpay',
        timestamp: '2024-12-24T10:20:00',
        status: 'confirmed',
    },
];

// Mock Recent Activity
export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
    { id: '1', action: 'Delivered', entity: 'Order #0998 - Sunita Patel', time: '30 min ago', type: 'success' },
    { id: '2', action: 'Payment received', entity: '₹2,800 Cash', time: '30 min ago', type: 'success' },
    { id: '3', action: 'Taken for delivery', entity: 'Order #1001 - Rajesh Kumar', time: '1h ago', type: 'info' },
    { id: '4', action: 'Sales return', entity: 'Order #0995 - Quality issue', time: '2h ago', type: 'warning' },
    { id: '5', action: 'New assignment', entity: '3 orders assigned', time: '3h ago', type: 'info' },
];

// Helper functions
export function getRouteLabel(routeId: Route): string {
    return ROUTES.find(r => r.id === routeId)?.label || routeId;
}

export function getRouteColor(routeId: Route): string {
    return ROUTES.find(r => r.id === routeId)?.color || '';
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
    return PAYMENT_METHODS.find(m => m.id === method)?.label || method;
}

export function getStatusColor(status: DeliveryStatus): string {
    switch (status) {
        case 'delivered':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        case 'returned':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        case 'in-transit':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        case 'pending':
        default:
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
    switch (status) {
        case 'paid':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        case 'partial':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        case 'pending':
        default:
            return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
}

// Notification count (items ready from printer)
export function getReadyForDeliveryCount(): number {
    return MOCK_DELIVERIES.filter(d => d.isReadyForDelivery && d.status === 'pending').length;
}

// Get deliveries by route
export function getDeliveriesByRoute(route: Route | 'all'): Delivery[] {
    if (route === 'all') return MOCK_DELIVERIES;
    return MOCK_DELIVERIES.filter(d => d.route === route);
}

// Get items taken for delivery
export function getItemsTakenForDelivery(): Delivery[] {
    return MOCK_DELIVERIES.filter(d => d.takenForDelivery && d.status !== 'delivered');
}
