import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, Warehouse, Store, Filter } from 'lucide-react';

type LocationFilter = 'all' | 'godown' | 'shop';

interface StockItem {
    id: string;
    name: string;
    category: string;
    location: 'godown' | 'shop';
    quantity: number;
    minStock: number;
    lastUpdated: string;
}

const mockStockItems: StockItem[] = [
    { id: '1', name: 'PVC Cards - White', category: 'PVC Printing', location: 'godown', quantity: 500, minStock: 100, lastUpdated: '2024-12-23' },
    { id: '2', name: 'PVC Cards - Gold', category: 'PVC Printing', location: 'shop', quantity: 150, minStock: 50, lastUpdated: '2024-12-23' },
    { id: '3', name: 'Business Card Paper', category: 'Offset Printing', location: 'godown', quantity: 1000, minStock: 200, lastUpdated: '2024-12-22' },
    { id: '4', name: 'Seal Ink - Black', category: 'Seal Items', location: 'shop', quantity: 25, minStock: 30, lastUpdated: '2024-12-21' },
    { id: '5', name: 'Self-Ink Stamps', category: 'Seal Items', location: 'godown', quantity: 80, minStock: 20, lastUpdated: '2024-12-20' },
    { id: '6', name: 'Lamination Film', category: 'Finishing', location: 'shop', quantity: 45, minStock: 50, lastUpdated: '2024-12-22' },
];

const Inventory = () => {
    const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = mockStockItems.filter(item => {
        const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLocation && matchesSearch;
    });

    const getStockStatus = (item: StockItem) => {
        if (item.quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
        if (item.quantity < item.minStock) return { label: 'Low Stock', variant: 'warning' as const };
        return { label: 'In Stock', variant: 'default' as const };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Manage stock across Godown and Shop locations.</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stock Entry
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={locationFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLocationFilter('all')}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                All
                            </Button>
                            <Button
                                variant={locationFilter === 'godown' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLocationFilter('godown')}
                            >
                                <Warehouse className="h-4 w-4 mr-2" />
                                Godown
                            </Button>
                            <Button
                                variant={locationFilter === 'shop' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLocationFilter('shop')}
                            >
                                <Store className="h-4 w-4 mr-2" />
                                Shop
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Stock Items ({filteredItems.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-3 font-medium text-muted-foreground">Product</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Category</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Location</th>
                                    <th className="pb-3 font-medium text-muted-foreground text-right">Quantity</th>
                                    <th className="pb-3 font-medium text-muted-foreground text-right">Min Stock</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const status = getStockStatus(item);
                                    return (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="py-3 font-medium">{item.name}</td>
                                            <td className="py-3 text-muted-foreground">{item.category}</td>
                                            <td className="py-3">
                                                <Badge variant="outline" className="capitalize">
                                                    {item.location === 'godown' ? (
                                                        <><Warehouse className="h-3 w-3 mr-1" /> Godown</>
                                                    ) : (
                                                        <><Store className="h-3 w-3 mr-1" /> Shop</>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-right font-medium">{item.quantity}</td>
                                            <td className="py-3 text-right text-muted-foreground">{item.minStock}</td>
                                            <td className="py-3">
                                                <Badge variant={status.variant === 'warning' ? 'secondary' : status.variant}>
                                                    {status.label}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-muted-foreground text-sm">{item.lastUpdated}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredItems.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                No items found matching your criteria.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Inventory;
