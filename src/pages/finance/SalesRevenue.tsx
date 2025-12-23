import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

// Mock data for sales
const salesData = [
    { id: 1, date: '2024-12-23', item: 'PVC Cards (500)', salePrice: 2500, purchaseCost: 1500, profit: 1000, staff: 'Arun' },
    { id: 2, date: '2024-12-23', item: 'Business Cards (1000)', salePrice: 1800, purchaseCost: 900, profit: 900, staff: 'Kiran' },
    { id: 3, date: '2024-12-22', item: 'ID Cards (200)', salePrice: 3000, purchaseCost: 1800, profit: 1200, staff: 'Arun' },
    { id: 4, date: '2024-12-22', item: 'Visiting Cards (500)', salePrice: 750, purchaseCost: 350, profit: 400, staff: 'Meera' },
    { id: 5, date: '2024-12-21', item: 'PAN Card Printing', salePrice: 150, purchaseCost: 50, profit: 100, staff: 'Kiran' },
    { id: 6, date: '2024-12-21', item: 'Rubber Stamps (10)', salePrice: 800, purchaseCost: 300, profit: 500, staff: 'Meera' },
];

const SalesRevenue = () => {
    const totalSales = salesData.reduce((sum, s) => sum + s.salePrice, 0);
    const totalCost = salesData.reduce((sum, s) => sum + s.purchaseCost, 0);
    const totalProfit = salesData.reduce((sum, s) => sum + s.profit, 0);
    const profitMargin = ((totalProfit / totalSales) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Revenue</h1>
                <p className="text-muted-foreground">Track sales with purchase cost visibility for margin analysis.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{salesData.length} transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Purchase Cost</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">₹{totalCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total cost of goods</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalProfit.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Sales - Cost</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profitMargin}%</div>
                        <p className="text-xs text-muted-foreground">Average margin</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Sales Staff</TableHead>
                                <TableHead className="text-right">Sale Price (₹)</TableHead>
                                <TableHead className="text-right">Purchase Cost (₹)</TableHead>
                                <TableHead className="text-right">Profit (₹)</TableHead>
                                <TableHead className="text-right">Margin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salesData.map((sale) => {
                                const margin = ((sale.profit / sale.salePrice) * 100).toFixed(0);
                                return (
                                    <TableRow key={sale.id}>
                                        <TableCell>{sale.date}</TableCell>
                                        <TableCell className="font-medium">{sale.item}</TableCell>
                                        <TableCell>{sale.staff}</TableCell>
                                        <TableCell className="text-right">{sale.salePrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-orange-600">{sale.purchaseCost.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-green-600">{sale.profit.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={parseInt(margin) >= 40 ? 'default' : 'secondary'}>
                                                {margin}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesRevenue;
