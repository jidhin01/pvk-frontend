import React, { useState } from 'react';
import {
    Search,
    Save,
    IndianRupee,
    Percent,
    Calculator,
    RefreshCw,
    ChevronDown,
    Store,
    User,
    Package,
    Printer as PrinterIcon,
    IdCard,
    Stamp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

interface PartnersPricingTabProps {
    partnerType: 'dealer' | 'customer';
}

// Mock product categories and pricing
const PRODUCT_CATEGORIES = [
    {
        id: 'pvc-printing',
        name: 'PVC Card Printing',
        icon: PrinterIcon,
        products: [
            { id: 'pvc-single', name: 'PVC Card (Single Side)', basePrice: 15, dealerPrice: 12, customerPrice: 18 },
            { id: 'pvc-both', name: 'PVC Card (Both Side)', basePrice: 25, dealerPrice: 20, customerPrice: 30 },
            { id: 'pvc-premium', name: 'Premium PVC Card', basePrice: 40, dealerPrice: 32, customerPrice: 50 },
            { id: 'pvc-hologram', name: 'Hologram PVC Card', basePrice: 60, dealerPrice: 48, customerPrice: 75 },
        ]
    },
    {
        id: 'offset-printing',
        name: 'Offset Printing',
        icon: PrinterIcon,
        products: [
            { id: 'offset-visiting', name: 'Visiting Cards (100 pcs)', basePrice: 250, dealerPrice: 200, customerPrice: 300 },
            { id: 'offset-brochure', name: 'Brochure A4 (100 pcs)', basePrice: 800, dealerPrice: 650, customerPrice: 950 },
            { id: 'offset-flyer', name: 'Flyer A5 (500 pcs)', basePrice: 1500, dealerPrice: 1200, customerPrice: 1800 },
            { id: 'offset-poster', name: 'Poster A2 (10 pcs)', basePrice: 500, dealerPrice: 400, customerPrice: 600 },
        ]
    },
    {
        id: 'digital-printing',
        name: 'Digital Printing',
        icon: PrinterIcon,
        products: [
            { id: 'digital-a4', name: 'A4 Color Print', basePrice: 10, dealerPrice: 8, customerPrice: 12 },
            { id: 'digital-a3', name: 'A3 Color Print', basePrice: 20, dealerPrice: 16, customerPrice: 25 },
            { id: 'digital-large', name: 'Large Format (per sqft)', basePrice: 50, dealerPrice: 40, customerPrice: 60 },
        ]
    },
    {
        id: 'pan-services',
        name: 'PAN Card Services',
        icon: IdCard,
        products: [
            { id: 'pan-normal', name: 'Normal PAN', basePrice: 107, dealerPrice: 90, customerPrice: 120 },
            { id: 'pan-emergency', name: 'Emergency PAN', basePrice: 250, dealerPrice: 200, customerPrice: 300 },
            { id: 'pan-correction', name: 'PAN Correction', basePrice: 107, dealerPrice: 90, customerPrice: 120 },
        ]
    },
    {
        id: 'seal-services',
        name: 'Rubber Seal & Stamps',
        icon: Stamp,
        products: [
            { id: 'seal-self-ink', name: 'Self Ink Seal', basePrice: 350, dealerPrice: 280, customerPrice: 450 },
            { id: 'seal-normal', name: 'Normal Rubber Seal', basePrice: 200, dealerPrice: 160, customerPrice: 250 },
            { id: 'seal-pre-ink', name: 'Pre-Ink Stamp', basePrice: 500, dealerPrice: 400, customerPrice: 600 },
        ]
    },
];

const PartnersPricingTab: React.FC<PartnersPricingTabProps> = ({ partnerType }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['pvc-printing']);
    const [bulkDiscount, setBulkDiscount] = useState(15);
    const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handlePriceChange = (productId: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditingPrices(prev => ({ ...prev, [productId]: numValue }));
    };

    const handleSaveAll = () => {
        console.log('Saving prices:', editingPrices);
        toast.success('Pricing updated successfully');
        setEditingPrices({});
    };

    const handleResetAll = () => {
        setEditingPrices({});
        toast.info('Prices reset to original values');
    };

    const getMargin = (basePrice: number, sellingPrice: number) => {
        return ((sellingPrice - basePrice) / basePrice * 100).toFixed(1);
    };

    const filteredCategories = PRODUCT_CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Calculate totals
    const totalProducts = PRODUCT_CATEGORIES.reduce((acc, cat) => acc + cat.products.length, 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{PRODUCT_CATEGORIES.length}</div>
                                <p className="text-xs text-muted-foreground">Product Categories</p>
                            </div>
                            <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{totalProducts}</div>
                                <p className="text-xs text-muted-foreground">Total Products</p>
                            </div>
                            <PrinterIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-primary/30">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-primary">{bulkDiscount}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {partnerType === 'dealer' ? 'Dealer Discount' : 'Customer Margin'}
                                </p>
                            </div>
                            <Percent className="h-8 w-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Global Settings */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Quick Price Adjustment
                    </CardTitle>
                    <CardDescription>Apply bulk changes across all products</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Apply Category</Label>
                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {PRODUCT_CATEGORIES.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Discount / Margin (%)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={bulkDiscount}
                                    onChange={(e) => setBulkDiscount(parseInt(e.target.value) || 0)}
                                    className="flex-1"
                                />
                                <Button size="icon" variant="outline">
                                    <Calculator className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>&nbsp;</Label>
                            <Button className="w-full" variant="secondary">
                                Apply to All
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Product Categories */}
            <div className="space-y-4">
                {filteredCategories.map((category) => (
                    <Collapsible
                        key={category.id}
                        open={expandedCategories.includes(category.id)}
                        onOpenChange={() => toggleCategory(category.id)}
                    >
                        <Card>
                            <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
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
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-3 text-sm font-medium">Product</th>
                                                    <th className="text-right p-3 text-sm font-medium">Base Price</th>
                                                    <th className="text-right p-3 text-sm font-medium">
                                                        {partnerType === 'dealer' ? (
                                                            <span className="flex items-center justify-end gap-1">
                                                                <Store className="h-4 w-4" /> Dealer Price
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-end gap-1">
                                                                <User className="h-4 w-4" /> Customer Price
                                                            </span>
                                                        )}
                                                    </th>
                                                    <th className="text-right p-3 text-sm font-medium hidden sm:table-cell">Margin</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {category.products.map((product, idx) => {
                                                    const currentPrice = partnerType === 'dealer' ? product.dealerPrice : product.customerPrice;
                                                    const editedPrice = editingPrices[product.id];
                                                    const displayPrice = editedPrice !== undefined ? editedPrice : currentPrice;
                                                    const margin = getMargin(product.basePrice, displayPrice);

                                                    return (
                                                        <tr key={product.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                                                            <td className="p-3 text-sm">{product.name}</td>
                                                            <td className="p-3 text-sm text-right text-muted-foreground">
                                                                <span className="flex items-center justify-end gap-1">
                                                                    <IndianRupee className="h-3 w-3" />
                                                                    {product.basePrice}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                                                    <Input
                                                                        type="number"
                                                                        value={displayPrice}
                                                                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                                        className="w-20 h-8 text-right"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-right hidden sm:table-cell">
                                                                <Badge variant={parseFloat(margin) >= 0 ? 'outline' : 'destructive'} className={parseFloat(margin) >= 0 ? 'text-green-600 border-green-200' : ''}>
                                                                    {parseFloat(margin) >= 0 ? '+' : ''}{margin}%
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                <Button variant="outline" onClick={handleResetAll}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Changes
                </Button>
                <Button onClick={handleSaveAll}>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Prices
                </Button>
            </div>
        </div>
    );
};

export default PartnersPricingTab;
