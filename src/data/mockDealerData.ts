
export interface Dealer {
    businessName: string;
    gstNumber: string;
    creditLimit: number;
    currentBalance: number;
}

export type OrderStatus = 'printing' | 'pending' | 'delivered';

export interface BaseOrder {
    jobName: string;
    status: OrderStatus;
    cost: number;
    date: string; // Added date property as it's required for the table in DashboardHome
}

export interface PrintOrder extends BaseOrder {
    type: 'PRINT';
    material: string;
}

export interface PanOrder extends BaseOrder {
    type: 'PAN';
    applicant: string;
}

export interface SealOrder extends BaseOrder {
    type: 'SEAL';
    matter: string;
}

export type Order = PrintOrder | PanOrder | SealOrder;

export const CURRENT_DEALER: Dealer = {
    businessName: "PVK Dealer Enterprise",
    gstNumber: "22AAAAA0000A1Z5",
    creditLimit: 50000,
    currentBalance: 42000,
};

export const RECENT_ORDERS: Order[] = [
    {
        type: 'PRINT',
        jobName: 'Summer Campaign Banners',
        status: 'printing',
        cost: 1200,
        material: 'Flex',
        date: '2023-10-25'
    },
    {
        type: 'PAN',
        jobName: 'New Applicant Reg',
        status: 'pending',
        cost: 150,
        applicant: 'John Doe',
        date: '2023-10-26'
    },
    {
        type: 'SEAL',
        jobName: 'Director Stamp',
        status: 'delivered',
        cost: 350,
        matter: 'Director',
        date: '2023-10-20'
    },
    {
        type: 'PRINT',
        jobName: 'Office Branding',
        status: 'pending',
        cost: 4500,
        material: 'Vinyl',
        date: '2023-10-27'
    },
    {
        type: 'SEAL',
        jobName: 'Round Seal',
        status: 'delivered',
        cost: 200,
        matter: 'Manager',
        date: '2023-10-22'
    }
];
