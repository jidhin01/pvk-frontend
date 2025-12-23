import {
    Trophy,
    Stamp,
    Printer,
    FileText,
    Smartphone,
    Image,
    CreditCard,
    Book,
    Contact,
    Megaphone,
    Palette,
    Briefcase
} from 'lucide-react';

export interface Product {
    id: string;
    name: string;
    retailPrice: number;
    dealerPrice: number;
    category: string;
    slug: string;
    icon: any; // Using any for Lucide component reference in mock data
    offerBadge?: string;
}

export const MARKETPLACE_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Trophies & Awards',
        slug: 'trophies-awards',
        retailPrice: 850,
        dealerPrice: 450,
        category: 'Awards',
        icon: Trophy,
        offerBadge: 'Flat 47% OFF'
    },
    {
        id: '2',
        name: 'Custom Rubber Stamps',
        slug: 'rubber-stamps',
        retailPrice: 350,
        dealerPrice: 180,
        category: 'Office',
        icon: Stamp,
        offerBadge: 'Best Seller'
    },
    {
        id: '3',
        name: 'Custom Printing',
        slug: 'custom-printing',
        retailPrice: 15,
        dealerPrice: 8,
        category: 'Printing',
        icon: Printer,
        offerBadge: 'Per Sq.Ft'
    },
    {
        id: '4',
        name: 'Office Stationery',
        slug: 'office-stationery',
        retailPrice: 1200,
        dealerPrice: 899,
        category: 'Stationery',
        icon: Briefcase
    },
    {
        id: '5',
        name: 'Printer Supplies',
        slug: 'printer-supplies',
        retailPrice: 500,
        dealerPrice: 420,
        category: 'Supplies',
        icon: Palette
    },
    {
        id: '6',
        name: 'Mobile Accessories',
        slug: 'mobile-accessories',
        retailPrice: 299,
        dealerPrice: 149,
        category: 'Accessories',
        icon: Smartphone
    },
    {
        id: '7',
        name: 'Offset Printing',
        slug: 'offset-printing',
        retailPrice: 2500,
        dealerPrice: 1800,
        category: 'Printing',
        icon: FileText
    },
    {
        id: '8',
        name: 'Frame Studio',
        slug: 'frame-studio',
        retailPrice: 750,
        dealerPrice: 450,
        category: 'Decor',
        icon: Image
    },
    {
        id: '9',
        name: 'Wedding Cards',
        slug: 'wedding-cards',
        retailPrice: 60,
        dealerPrice: 35,
        category: 'Events',
        icon: Megaphone, // Closest available metaphor for invitation/announcement
        offerBadge: 'Bulk Only'
    },
    {
        id: '10',
        name: 'Customized Notebook',
        slug: 'custom-notebook',
        retailPrice: 200,
        dealerPrice: 120,
        category: 'Stationery',
        icon: Book
    },
    {
        id: '11',
        name: 'Student ID Cards',
        slug: 'student-id',
        retailPrice: 150,
        dealerPrice: 65,
        category: 'Identity',
        icon: Contact,
        offerBadge: 'High Margin'
    },
    {
        id: '12',
        name: 'Visiting Cards',
        slug: 'visiting-cards',
        retailPrice: 350,
        dealerPrice: 120,
        category: 'Identity',
        icon: CreditCard,
        offerBadge: 'Hot Deal'
    },
    {
        id: '13',
        name: 'Notice Printing',
        slug: 'notice-printing',
        retailPrice: 500,
        dealerPrice: 300,
        category: 'Printing',
        icon: Megaphone
    }
];
