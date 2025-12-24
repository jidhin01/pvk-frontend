export interface DealerProfile {
    id: string;
    businessName: string;
    gstNumber: string;
    creditLimit: number;
    currentBalance: number;
    isApproved: boolean; // New field for account status
}

export type OrderStatus = 'printing' | 'pending' | 'delivered';
export type GoodsType = 'finished' | 'unfinished';
export type PrintType = 'pvc' | 'laser' | 'offset';

export interface BaseOrder {
    id: string;
    jobName: string;
    status: OrderStatus;
    cost: number;
    date: string;
    goodsType?: GoodsType; // New field
    printType?: PrintType; // New field
}

export interface PrintOrder extends BaseOrder {
    type: 'PRINT';
    fileUrl: string;
    specs: {
        dimensions: string; // e.g., "10x12 ft"
        mediaType: string;
        quality: string;
    }
}

export interface ServiceOrder extends BaseOrder {
    type: 'PAN' | 'SEAL';
    details: any;
}

export type Order = PrintOrder | ServiceOrder;

export const CURRENT_DEALER: DealerProfile = {
    id: "D-101",
    businessName: "Kerala Digital House",
    gstNumber: "22AAAAA0000A1Z5",
    creditLimit: 50000,
    currentBalance: 42000,
    isApproved: true, // Mock approved status
};

export const RECENT_ORDERS: Order[] = [
    {
        id: "ORD-001",
        jobName: "Summer Sale Banner",
        type: "PRINT",
        status: "printing",
        cost: 450,
        date: "2023-10-25",
        fileUrl: "#",
        specs: { dimensions: "10x4 ft", mediaType: "Flex Star", quality: "High" },
        goodsType: 'unfinished',
        printType: 'laser'
    },
    {
        id: "ORD-002",
        jobName: "John Doe PAN Card",
        type: "PAN",
        status: "pending",
        cost: 120,
        date: "2023-10-26",
        details: { name: "John Doe", type: "Individual" }
    },
    {
        id: "ORD-003",
        jobName: "Office Rubber Stamp",
        type: "SEAL",
        status: "delivered",
        cost: 250,
        date: "2023-10-22",
        details: { text: "APPROVED", type: "Self Inking" }
    }
];
