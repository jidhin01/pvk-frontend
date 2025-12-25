import React, { useState } from 'react';
import {
    Search,
    Save,
    IndianRupee,
    RefreshCw,
    ChevronDown,
    Package,
    Printer as PrinterIcon,
    IdCard,
    Stamp,
    Store,
    User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

// Unified product pricing data with dealer and customer prices
const INITIAL_PRODUCTS = [
    {
        id: 'pvc-printing',
        name: 'PVC Card Printing',
        icon: PrinterIcon,
        products: [
            { id: 'pvc-single', name: 'PVC Card (Single Side)', dealerPrice: 12, customerPrice: 18 },
            { id: 'pvc-both', name: 'PVC Card (Both Side)', dealerPrice: 20, customerPrice: 30 },
            { id: 'pvc-premium', name: 'Premium PVC Card', dealerPrice: 32, customerPrice: 50 },
            { id: 'pvc-hologram', name: 'Hologram PVC Card', dealerPrice: 48, customerPrice: 75 },
        ]
    },
    {
        id: 'offset-printing',
        name: 'Offset Printing',
        icon: PrinterIcon,
        products: [
            { id: 'offset-visiting', name: 'Visiting Cards (100 pcs)', dealerPrice: 200, customerPrice: 300 },
            { id: 'offset-brochure', name: 'Brochure A4 (100 pcs)', dealerPrice: 650, customerPrice: 950 },
            { id: 'offset-flyer', name: 'Flyer A5 (500 pcs)', dealerPrice: 1200, customerPrice: 1800 },
            { id: 'offset-poster', name: 'Poster A2 (10 pcs)', dealerPrice: 400, customerPrice: 600 },
        ]
    },
    {
        id: 'digital-printing',
        name: 'Digital Printing',
        icon: PrinterIcon,
        products: [
            { id: 'digital-a4', name: 'A4 Color Print', dealerPrice: 8, customerPrice: 12 },
            { id: 'digital-a3', name: 'A3 Color Print', dealerPrice: 16, customerPrice: 25 },
            { id: 'digital-large', name: 'Large Format (per sqft)', dealerPrice: 40, customerPrice: 60 },
        ]
    },
    {
        id: 'pan-services',
        name: 'PAN Card Services',
        icon: IdCard,
        products: [
            { id: 'pan-normal', name: 'Normal PAN', dealerPrice: 90, customerPrice: 120 },
            { id: 'pan-emergency', name: 'Emergency PAN', dealerPrice: 200, customerPrice: 300 },
            { id: 'pan-correction', name: 'PAN Correction', dealerPrice: 90, customerPrice: 120 },
        ]
    },
    {
        id: 'seal-services',
        name: 'Rubber Seal & Stamps',
        icon: Stamp,
        products: [
            { id: 'seal-self-ink', name: 'Self Ink Seal', dealerPrice: 280, customerPrice: 450 },
            { id: 'seal-normal', name: 'Normal Rubber Seal', dealerPrice: 160, customerPrice: 250 },
            { id: 'seal-pre-ink', name: 'Pre-Ink Stamp', dealerPrice: 400, customerPrice: 600 },
        ]
    },
];

const UnifiedPricingTab: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['pvc-printing']);
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [hasChanges, setHasChanges] = useState(false);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const updateProductPrice = (categoryId: string, productId: string, field: 'dealerPrice' | 'customerPrice', value: number) => {
        setProducts(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    products: cat.products.map(p => {
                        if (p.id === productId) {
                            return { ...p, [field]: value };
                        }
                        return p;
                    })
                };
            }
            return cat;
        }));
        setHasChanges(true);
    };

    const handleSaveAll = () => {
        console.log('Saving prices:', products);
        toast.success('Pricing updated successfully!');
        setHasChanges(false);
    };

    const handleResetAll = () => {
        setProducts(INITIAL_PRODUCTS);
        setHasChanges(false);
        toast.info('Prices reset to original values');
    };

    const filteredCategories = products.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalProducts = products.reduce((acc, cat) => acc + cat.products.length, 0);

    return (
        <div className="space-y-4">
            {/* Search and Summary */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {products.length} categories
                    </span>
                    <span className="flex items-center gap-2">
                        <PrinterIcon className="h-4 w-4" />
                        {totalProducts} products
                    </span>
                </div>
            </div>

            {/* Price Legend */}
            <div className="flex gap-6 text-sm bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">Dealer Price</span>
                    <span className="text-muted-foreground">(B2B Partners)</span>
                </div>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">Customer Price</span>
                    <span className="text-muted-foreground">(Retail / Individual)</span>
                </div>
            </div>

            {/* Product Categories */}
            <div className="space-y-3">
                {filteredCategories.map((category) => (
                    <Collapsible
                        key={category.id}
                        open={expandedCategories.includes(category.id)}
                        onOpenChange={() => toggleCategory(category.id)}
                    >
                        <Card>
                            <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <category.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{category.name}</CardTitle>
                                                <CardDescription>{category.products.length} products</CardDescription>
                                            </div>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedCategories.includes(category.id) ? 'rotate-180' : ''}`} />
                                    </div>
                                </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b bg-muted/30">
                                                    <th className="text-left p-3 text-sm font-medium">Product Name</th>
                                                    <th className="text-right p-3 text-sm font-medium w-40">
                                                        <div className="flex items-center justify-end gap-2 text-green-600">
                                                            <Store className="h-4 w-4" />
                                                            Dealer ₹
                                                        </div>
                                                    </th>
                                                    <th className="text-right p-3 text-sm font-medium w-40">
                                                        <div className="flex items-center justify-end gap-2 text-blue-600">
                                                            <User className="h-4 w-4" />
                                                            Customer ₹
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {category.products.map((product, idx) => (
                                                    <tr key={product.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                                                        <td className="p-3 text-sm font-medium">{product.name}</td>
                                                        <td className="p-3 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <span className="text-green-600">₹</span>
                                                                <Input
                                                                    type="number"
                                                                    value={product.dealerPrice}
                                                                    onChange={(e) => updateProductPrice(category.id, product.id, 'dealerPrice', parseInt(e.target.value) || 0)}
                                                                    className="w-24 h-9 text-right font-semibold border-green-200 focus:border-green-400"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <span className="text-blue-600">₹</span>
                                                                <Input
                                                                    type="number"
                                                                    value={product.customerPrice}
                                                                    onChange={(e) => updateProductPrice(category.id, product.id, 'customerPrice', parseInt(e.target.value) || 0)}
                                                                    className="w-24 h-9 text-right font-semibold border-blue-200 focus:border-blue-400"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                ))}
            </div>

            {/* Sticky Save Bar */}
            {hasChanges && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                    <Card className="shadow-lg border-primary/20">
                        <CardContent className="py-3 px-4 flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Unsaved changes</span>
                            <Button variant="outline" size="sm" onClick={handleResetAll}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                            <Button size="sm" onClick={handleSaveAll}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UnifiedPricingTab;
