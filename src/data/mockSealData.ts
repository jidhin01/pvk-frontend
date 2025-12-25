
export interface TimelineStep {
    stage: string;
    completed: boolean;
    date?: string;
    description?: string;
}

export interface SealOrder {
    id: string;
    content: string; // e.g., "Director, PVK Ent"
    sealMatter: string; // Full seal text content
    type: 'WOODEN' | 'SELF_INK' | 'POCKET';
    machineModel?: string; // e.g., "Shiny S-842" (Only for Self-Ink)
    size: string; // "2x1 inch"
    status: 'pending_batch' | 'exposure_done' | 'mounting' | 'completed';
    isUrgent: boolean;
    orderDate: string;
    // Enhanced fields
    dealerName: string;
    dealerId: string;
    language: 'Malayalam' | 'English';
    priority: 'normal' | 'rush';
    assignedTo?: string;
    estimatedCompletion?: string;
    completedDate?: string;
    price: number;
    cost: number;
    timeline: TimelineStep[];
}

export const MOCK_SEAL_ORDERS: SealOrder[] = [
    {
        id: 'SEAL-001',
        content: 'For PVK Enterprises, Partner',
        sealMatter: 'For PVK Enterprises\nAuthorized Partner\nKottayam, Kerala',
        type: 'SELF_INK',
        machineModel: 'Shiny S-842',
        size: '38x14 mm',
        status: 'pending_batch',
        isUrgent: true,
        orderDate: '2025-12-24T10:00:00',
        dealerName: 'Arun Traders',
        dealerId: 'DLR-001',
        language: 'English',
        priority: 'rush',
        assignedTo: 'Rahul K',
        estimatedCompletion: '2025-12-26T14:00:00',
        price: 350,
        cost: 120,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-24T10:00:00', description: 'Order placed by dealer' },
            { stage: 'Design Verified', completed: true, date: '2025-12-24T10:30:00', description: 'Content approved' },
            { stage: 'Pending Batch', completed: false, description: 'Waiting for batch exposure' },
            { stage: 'Exposure Done', completed: false },
            { stage: 'Mounting', completed: false },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-002',
        content: 'Round Seal: Govt. High School',
        sealMatter: 'GOVERNMENT HIGH SCHOOL\n★ KOTTAYAM ★\nEst. 1956',
        type: 'WOODEN',
        size: '2 inch Round',
        status: 'pending_batch',
        isUrgent: false,
        orderDate: '2025-12-24T10:15:00',
        dealerName: 'Kerala Stationary',
        dealerId: 'DLR-003',
        language: 'English',
        priority: 'normal',
        estimatedCompletion: '2025-12-27T16:00:00',
        price: 200,
        cost: 80,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-24T10:15:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-24T11:00:00' },
            { stage: 'Pending Batch', completed: false },
            { stage: 'Exposure Done', completed: false },
            { stage: 'Mounting', completed: false },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-003',
        content: 'Dr. Ananya Sharma, MBBS',
        sealMatter: 'Dr. ANANYA SHARMA\nMBBS, MD (Medicine)\nReg. No: 45678',
        type: 'POCKET',
        machineModel: 'Colop Pocket 20',
        size: '38x14 mm',
        status: 'exposure_done',
        isUrgent: false,
        orderDate: '2025-12-23T16:00:00',
        dealerName: 'MedSupply Kerala',
        dealerId: 'DLR-005',
        language: 'English',
        priority: 'normal',
        assignedTo: 'Suresh M',
        estimatedCompletion: '2025-12-26T12:00:00',
        price: 450,
        cost: 180,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-23T16:00:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-23T17:00:00' },
            { stage: 'Pending Batch', completed: true, date: '2025-12-24T09:00:00' },
            { stage: 'Exposure Done', completed: true, date: '2025-12-25T10:00:00', description: 'Polymer exposed and cured' },
            { stage: 'Mounting', completed: false },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-004',
        content: 'PAID & CANCELLED',
        sealMatter: 'PAID & CANCELLED\nDate: ___________',
        type: 'SELF_INK',
        machineModel: 'Shiny S-843',
        size: '47x18 mm',
        status: 'mounting',
        isUrgent: false,
        orderDate: '2025-12-23T14:30:00',
        dealerName: 'Office Plus',
        dealerId: 'DLR-002',
        language: 'English',
        priority: 'normal',
        assignedTo: 'Rahul K',
        estimatedCompletion: '2025-12-26T10:00:00',
        price: 300,
        cost: 100,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-23T14:30:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-23T15:00:00' },
            { stage: 'Pending Batch', completed: true, date: '2025-12-23T17:00:00' },
            { stage: 'Exposure Done', completed: true, date: '2025-12-24T11:00:00' },
            { stage: 'Mounting', completed: false, description: 'Being attached to handle' },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-005',
        content: 'Checked by Officer',
        sealMatter: 'CHECKED BY\nAuthorized Officer',
        type: 'WOODEN',
        size: '2x1 inch',
        status: 'pending_batch',
        isUrgent: false,
        orderDate: '2025-12-24T10:45:00',
        dealerName: 'Govt Supplies',
        dealerId: 'DLR-007',
        language: 'English',
        priority: 'normal',
        estimatedCompletion: '2025-12-27T14:00:00',
        price: 180,
        cost: 70,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-24T10:45:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-24T11:15:00' },
            { stage: 'Pending Batch', completed: false },
            { stage: 'Exposure Done', completed: false },
            { stage: 'Mounting', completed: false },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-006',
        content: 'True Copy Attested',
        sealMatter: 'TRUE COPY\nATTESTED\n_____________\nNotary Public',
        type: 'SELF_INK',
        machineModel: 'Shiny S-844',
        size: '58x22 mm',
        status: 'completed',
        isUrgent: true,
        orderDate: '2025-12-22T09:00:00',
        dealerName: 'Legal Docs Center',
        dealerId: 'DLR-004',
        language: 'English',
        priority: 'rush',
        assignedTo: 'Suresh M',
        estimatedCompletion: '2025-12-23T12:00:00',
        completedDate: '2025-12-23T11:30:00',
        price: 420,
        cost: 150,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-22T09:00:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-22T09:30:00' },
            { stage: 'Pending Batch', completed: true, date: '2025-12-22T10:00:00' },
            { stage: 'Exposure Done', completed: true, date: '2025-12-22T15:00:00' },
            { stage: 'Mounting', completed: true, date: '2025-12-23T10:00:00' },
            { stage: 'Completed', completed: true, date: '2025-12-23T11:30:00', description: 'Delivered to dealer' }
        ]
    },
    {
        id: 'SEAL-007',
        content: 'Submitted via Studio',
        sealMatter: 'SUBMITTED\nVia Online Portal',
        type: 'SELF_INK',
        machineModel: 'Shiny S-842',
        size: '38x14 mm',
        status: 'pending_batch',
        isUrgent: false,
        orderDate: '2025-12-24T14:15:00',
        dealerName: 'Quick Print Shop',
        dealerId: 'DLR-006',
        language: 'English',
        priority: 'normal',
        estimatedCompletion: '2025-12-27T16:00:00',
        price: 280,
        cost: 95,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-24T14:15:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-24T15:00:00' },
            { stage: 'Pending Batch', completed: false },
            { stage: 'Exposure Done', completed: false },
            { stage: 'Mounting', completed: false },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-008',
        content: 'കേരള സർക്കാർ',
        sealMatter: 'കേരള സർക്കാർ\nGovernment of Kerala\nOfficial Seal',
        type: 'WOODEN',
        size: '30mm Round',
        status: 'pending_batch',
        isUrgent: false,
        orderDate: '2025-12-25T09:00:00',
        dealerName: 'Kerala Govt Press',
        dealerId: 'DLR-008',
        language: 'Malayalam',
        priority: 'normal',
        estimatedCompletion: '2025-12-28T12:00:00',
        price: 350,
        cost: 130,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-25T09:00:00' },
            { stage: 'Design Verified', completed: false },
            { stage: 'Pending Batch', completed: false },
            { stage: 'Exposure Done', completed: false },
            { stage: 'Mounting', completed: false },
            { stage: 'Completed', completed: false }
        ]
    },
    {
        id: 'SEAL-009',
        content: 'RECEIVED',
        sealMatter: 'RECEIVED\nDate: ___/___/___\nTime: _____',
        type: 'SELF_INK',
        machineModel: 'Shiny S-843',
        size: '47x18 mm',
        status: 'completed',
        isUrgent: false,
        orderDate: '2025-12-21T11:00:00',
        dealerName: 'Office Plus',
        dealerId: 'DLR-002',
        language: 'English',
        priority: 'normal',
        assignedTo: 'Rahul K',
        completedDate: '2025-12-23T16:00:00',
        price: 300,
        cost: 100,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-21T11:00:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-21T11:30:00' },
            { stage: 'Pending Batch', completed: true, date: '2025-12-21T14:00:00' },
            { stage: 'Exposure Done', completed: true, date: '2025-12-22T10:00:00' },
            { stage: 'Mounting', completed: true, date: '2025-12-23T14:00:00' },
            { stage: 'Completed', completed: true, date: '2025-12-23T16:00:00' }
        ]
    },
    {
        id: 'SEAL-010',
        content: 'ORIGINAL',
        sealMatter: 'ORIGINAL\nDocument',
        type: 'SELF_INK',
        machineModel: 'Shiny S-842',
        size: '38x14 mm',
        status: 'completed',
        isUrgent: false,
        orderDate: '2025-12-20T14:00:00',
        dealerName: 'Legal Docs Center',
        dealerId: 'DLR-004',
        language: 'English',
        priority: 'normal',
        assignedTo: 'Suresh M',
        completedDate: '2025-12-22T17:00:00',
        price: 250,
        cost: 85,
        timeline: [
            { stage: 'Order Received', completed: true, date: '2025-12-20T14:00:00' },
            { stage: 'Design Verified', completed: true, date: '2025-12-20T14:30:00' },
            { stage: 'Pending Batch', completed: true, date: '2025-12-20T16:00:00' },
            { stage: 'Exposure Done', completed: true, date: '2025-12-21T11:00:00' },
            { stage: 'Mounting', completed: true, date: '2025-12-22T15:00:00' },
            { stage: 'Completed', completed: true, date: '2025-12-22T17:00:00' }
        ]
    }
];

// Earnings summary for seal team
export const SEAL_TEAM_EARNINGS = {
    today: { orders: 2, revenue: 720, cost: 250, profit: 470 },
    thisWeek: { orders: 8, revenue: 2830, cost: 980, profit: 1850 },
    thisMonth: { orders: 45, revenue: 14500, cost: 5200, profit: 9300 },
    lastMonth: { orders: 52, revenue: 16800, cost: 5900, profit: 10900 },
    byType: {
        SELF_INK: { orders: 28, revenue: 9100, percentage: 63 },
        WOODEN: { orders: 12, revenue: 3400, percentage: 23 },
        POCKET: { orders: 5, revenue: 2000, percentage: 14 }
    },
    topDealers: [
        { dealerId: 'DLR-002', dealerName: 'Office Plus', orders: 12, revenue: 3600 },
        { dealerId: 'DLR-004', dealerName: 'Legal Docs Center', orders: 8, revenue: 2800 },
        { dealerId: 'DLR-001', dealerName: 'Arun Traders', orders: 7, revenue: 2100 },
        { dealerId: 'DLR-003', dealerName: 'Kerala Stationary', orders: 6, revenue: 1800 },
        { dealerId: 'DLR-005', dealerName: 'MedSupply Kerala', orders: 5, revenue: 2250 }
    ]
};

// Production metrics
export const SEAL_PRODUCTION_STATS = {
    avgProcessingTime: '2.5 hours',
    avgDailyOutput: 8,
    rushOrderPercentage: 15,
    customerSatisfaction: 4.8,
    weeklyTrend: [
        { day: 'Mon', completed: 12, pending: 4 },
        { day: 'Tue', completed: 15, pending: 6 },
        { day: 'Wed', completed: 10, pending: 3 },
        { day: 'Thu', completed: 18, pending: 5 },
        { day: 'Fri', completed: 14, pending: 7 },
        { day: 'Sat', completed: 8, pending: 2 },
        { day: 'Sun', completed: 3, pending: 1 }
    ]
};
