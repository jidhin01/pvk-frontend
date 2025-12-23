import {
    CreditCard,
    Stamp,
    FileText,
    BookOpen,
    Printer,
    IdCard,
    Award,
    FileCheck,
    type LucideIcon
} from 'lucide-react';

export interface Product {
    id: string;
    name: string;
    category: string;
    slug: string;
    icon: LucideIcon;
    dealerPrice: number;
    retailPrice: number;
    offerBadge?: string;
}

export const MARKETPLACE_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'PAN Card',
        category: 'Identity Documents',
        slug: 'pan-card',
        icon: CreditCard,
        dealerPrice: 85,
        retailPrice: 150,
        offerBadge: 'Best Seller',
    },
    {
        id: '2',
        name: 'Rubber Stamps',
        category: 'Seals & Stamps',
        slug: 'rubber-stamps',
        icon: Stamp,
        dealerPrice: 120,
        retailPrice: 250,
    },
    {
        id: '3',
        name: 'Visiting Cards',
        category: 'Printing',
        slug: 'visiting-cards',
        icon: IdCard,
        dealerPrice: 200,
        retailPrice: 350,
        offerBadge: 'Hot',
    },
    {
        id: '4',
        name: 'Letterheads',
        category: 'Printing',
        slug: 'letterheads',
        icon: FileText,
        dealerPrice: 450,
        retailPrice: 700,
    },
    {
        id: '5',
        name: 'Brochures',
        category: 'Marketing',
        slug: 'brochures',
        icon: BookOpen,
        dealerPrice: 800,
        retailPrice: 1200,
    },
    {
        id: '6',
        name: 'Flex Banners',
        category: 'Marketing',
        slug: 'flex-banners',
        icon: Printer,
        dealerPrice: 25,
        retailPrice: 45,
        offerBadge: 'Per Sq.Ft',
    },
    {
        id: '7',
        name: 'Certificates',
        category: 'Documents',
        slug: 'certificates',
        icon: Award,
        dealerPrice: 150,
        retailPrice: 300,
    },
    {
        id: '8',
        name: 'ID Cards',
        category: 'Identity Documents',
        slug: 'id-cards',
        icon: FileCheck,
        dealerPrice: 50,
        retailPrice: 100,
    },
];
