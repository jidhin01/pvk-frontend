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

// Product Interface and Marketplace Products for Dashboard
import { LucideIcon, Image, FileText, Stamp, CreditCard, Printer, Package } from 'lucide-react';

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    retailPrice: number;
    dealerPrice: number;
    icon: LucideIcon;
    offerBadge?: string;
}

export const MARKETPLACE_PRODUCTS: Product[] = [
    {
        id: 'prd-1',
        name: 'Flex Banner Printing',
        slug: 'flex-banner',
        category: 'Large Format',
        retailPrice: 25,
        dealerPrice: 18,
        icon: Image,
        offerBadge: '28% OFF',
    },
    {
        id: 'prd-2',
        name: 'Business Cards',
        slug: 'business-cards',
        category: 'Stationery',
        retailPrice: 150,
        dealerPrice: 100,
        icon: CreditCard,
    },
    {
        id: 'prd-3',
        name: 'PVC ID Cards',
        slug: 'pvc-id-cards',
        category: 'ID Solutions',
        retailPrice: 80,
        dealerPrice: 55,
        icon: CreditCard,
        offerBadge: 'HOT',
    },
    {
        id: 'prd-4',
        name: 'Rubber Stamps',
        slug: 'rubber-stamps',
        category: 'Office Supplies',
        retailPrice: 250,
        dealerPrice: 180,
        icon: Stamp,
    },
    {
        id: 'prd-5',
        name: 'Brochures & Flyers',
        slug: 'brochures-flyers',
        category: 'Marketing',
        retailPrice: 200,
        dealerPrice: 140,
        icon: FileText,
    },
    {
        id: 'prd-6',
        name: 'Offset Printing',
        slug: 'offset-printing',
        category: 'Bulk Printing',
        retailPrice: 500,
        dealerPrice: 350,
        icon: Printer,
    },
    {
        id: 'prd-7',
        name: 'Packaging & Labels',
        slug: 'packaging-labels',
        category: 'Packaging',
        retailPrice: 300,
        dealerPrice: 220,
        icon: Package,
    },
    {
        id: 'prd-8',
        name: 'Photo Printing',
        slug: 'photo-printing',
        category: 'Photography',
        retailPrice: 50,
        dealerPrice: 35,
        icon: Image,
    },
];
