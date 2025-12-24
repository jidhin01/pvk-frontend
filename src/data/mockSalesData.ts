// Mock Sales/Line Staff Data
// Delivery types, routes, payment methods, and financial tracking

export type DeliveryStatus = 'pending' | 'delivered' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'partial';
export type PaymentMethod = 'cash' | 'gpay' | 'bank_transfer' | 'credit';
export type Route = 'north_route' | 'city_center' | 'south_zone' | 'east_side';

export interface Delivery {
    id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    location: string;
    route: Route;
    status: DeliveryStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    amount: number;
    amountPaid: number;
    itemDescription: string;
    designPreviewUrl?: string;
    quantity: number;
    isQuantityVerified: boolean;
    isDesignVerified: boolean;
    returnReason?: string;
    deliveredAt?: string;
    createdAt: string;
    isReadyForDelivery: boolean;
}

export interface Expense {
    id: string;
    type: 'salary' | 'fuel' | 'food' | 'travel' | 'other';
    amount: number;
    description: string;
    createdAt: string;
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
}

export const ROUTES: { id: Route; label: string }[] = [
    { id: 'north_route', label: 'North Route' },
    { id: 'city_center', label: 'City Center' },
    { id: 'south_zone', label: 'South Zone' },
    { id: 'east_side', label: 'East Side' },
];

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
    { id: 'cash', label: 'Cash' },
    { id: 'gpay', label: 'GPay' },
    { id: 'bank_transfer', label: 'Bank Transfer' },
    { id: 'credit', label: 'Credit' },
];

// Mock Deliveries: 3 Pending, 1 Completed, 1 Sales Return
export const MOCK_DELIVERIES: Delivery[] = [
    // Pending Deliveries (3)
    {
        id: 'DEL-001',
        orderId: 'ORD-2024-1001',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 98765 43210',
        location: 'Shop No. 14, Market Road, Sector 5',
        route: 'north_route',
        status: 'pending',
        paymentStatus: 'pending',
        amount: 1500,
        amountPaid: 0,
        itemDescription: 'Visiting Cards - 500 pcs (Matt Lamination)',
        designPreviewUrl: '/placeholder-design.jpg',
        quantity: 500,
        isQuantityVerified: false,
        isDesignVerified: false,
        createdAt: '2024-12-24T08:00:00',
        isReadyForDelivery: true,
    },
    {
        id: 'DEL-002',
        orderId: 'ORD-2024-1002',
        customerName: 'Priya Sharma',
        customerPhone: '+91 87654 32109',
        location: 'Office 301, Tech Park, MG Road',
        route: 'city_center',
        status: 'pending',
        paymentStatus: 'partial',
        amount: 3200,
        amountPaid: 1000,
        itemDescription: 'Letterheads - 200 pcs + Envelopes - 200 pcs',
        designPreviewUrl: '/placeholder-design.jpg',
        quantity: 400,
        isQuantityVerified: false,
        isDesignVerified: false,
        createdAt: '2024-12-24T09:30:00',
        isReadyForDelivery: true,
    },
    {
        id: 'DEL-003',
        orderId: 'ORD-2024-1003',
        customerName: 'Mohammed Ali',
        customerPhone: '+91 76543 21098',
        location: '45, Gandhi Nagar, Near Bus Stand',
        route: 'south_zone',
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'gpay',
        amount: 850,
        amountPaid: 850,
        itemDescription: 'Self-Ink Rubber Stamp (Round)',
        designPreviewUrl: '/placeholder-design.jpg',
        quantity: 1,
        isQuantityVerified: false,
        isDesignVerified: false,
        createdAt: '2024-12-24T10:15:00',
        isReadyForDelivery: true,
    },
    // Completed Delivery (1)
    {
        id: 'DEL-004',
        orderId: 'ORD-2024-0998',
        customerName: 'Sunita Patel',
        customerPhone: '+91 65432 10987',
        location: '78, Industrial Area, Phase 2',
        route: 'east_side',
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        amount: 2800,
        amountPaid: 2800,
        itemDescription: 'Brochures - 100 pcs (Tri-fold, Gloss)',
        designPreviewUrl: '/placeholder-design.jpg',
        quantity: 100,
        isQuantityVerified: true,
        isDesignVerified: true,
        deliveredAt: '2024-12-24T11:45:00',
        createdAt: '2024-12-23T16:00:00',
        isReadyForDelivery: false,
    },
    // Sales Return (1)
    {
        id: 'DEL-005',
        orderId: 'ORD-2024-0995',
        customerName: 'Amit Verma',
        customerPhone: '+91 54321 09876',
        location: '12, Commercial Complex, Station Road',
        route: 'city_center',
        status: 'returned',
        paymentStatus: 'pending',
        amount: 1200,
        amountPaid: 0,
        itemDescription: 'PAN Card Print - 10 pcs',
        designPreviewUrl: '/placeholder-design.jpg',
        quantity: 10,
        isQuantityVerified: true,
        isDesignVerified: false,
        returnReason: 'Print quality issue - Colors faded and text not sharp',
        createdAt: '2024-12-23T14:30:00',
        isReadyForDelivery: false,
    },
];

// Pre-filled financial stats
export const MOCK_TODAY_FINANCIALS: DailyFinancials = {
    date: '2024-12-24',
    cashCollected: 5000,
    onlineReceived: 3200,
    creditGiven: 2200,
    salaryTaken: 500,
    otherExpenses: 350,
    cashToDeposit: 4150, // 5000 - 500 - 350
};

// Mock expenses
export const MOCK_EXPENSES: Expense[] = [
    {
        id: 'EXP-001',
        type: 'salary',
        amount: 500,
        description: 'Daily salary advance',
        createdAt: '2024-12-24T09:00:00',
    },
    {
        id: 'EXP-002',
        type: 'fuel',
        amount: 200,
        description: 'Petrol for delivery bike',
        createdAt: '2024-12-24T08:30:00',
    },
    {
        id: 'EXP-003',
        type: 'food',
        amount: 150,
        description: 'Lunch',
        createdAt: '2024-12-24T13:00:00',
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
    },
    {
        id: 'PAY-002',
        deliveryId: 'DEL-002',
        customerName: 'Priya Sharma',
        amount: 1000,
        method: 'gpay',
        timestamp: '2024-12-24T09:35:00',
    },
    {
        id: 'PAY-003',
        deliveryId: 'DEL-003',
        customerName: 'Mohammed Ali',
        amount: 850,
        method: 'gpay',
        timestamp: '2024-12-24T10:20:00',
    },
];

// Helper functions
export function getRouteLabel(routeId: Route): string {
    return ROUTES.find(r => r.id === routeId)?.label || routeId;
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
