import React, { useState } from 'react';
import { useAdminInventoryLogic } from '@/hooks/useAdminInventoryLogic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function InventoryReports() {
    const { inventory, totalValue, deadStockValue } = useAdminInventoryLogic();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInventory = inventory.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadCSV = () => {
        const headers = ['Item Name', 'Category', 'Total Qty', 'Details', 'Cost/Unit', 'Total Value', 'Status'];
        const rows = filteredInventory.map(item => {
            const totalQty = item.stockLevels.godown + item.stockLevels.shop;
            // Value = (Qty / Conversion) * PurchasePrice
            const value = (totalQty / item.conversionRatio) * item.purchasePrice;

            // Status check
            const lastMoved = new Date(item.lastMovedDate);
            const today = new Date();
            const days = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
            const isDead = days > item.deadStockDuration;

            return [
                `"${item.name}"`,
                item.category,
                totalQty,
                `G: ${item.stockLevels.godown} | S: ${item.stockLevels.shop}`,
                item.purchasePrice,
                value.toFixed(2),
                isDead ? 'Dead Stock' : 'Active'
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Inventory_Valuation_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Advanced Reports</h2>
                    <p className="text-muted-foreground">Generate valuation and movement reports.</p>
                </div>
                <Button className="bg-slate-800 hover:bg-slate-900" onClick={handleDownloadCSV}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Asset Value</div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">₹{totalValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">Dead Stock Liability</div>
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">₹{deadStockValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Stock Valuation</CardTitle>
                    <div className="flex justify-between items-center">
                        <CardDescription>Live valuation based on current stock levels and purchase prices.</CardDescription>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                className="pl-8 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Total Quantity</TableHead>
                                <TableHead className="text-right">Unit Cost</TableHead>
                                <TableHead className="text-right">Total Value</TableHead>
                                <TableHead className="text-right">Last Moved</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item) => {
                                const totalQty = item.stockLevels.godown + item.stockLevels.shop;
                                const value = (totalQty / item.conversionRatio) * item.purchasePrice;

                                // Dead Stock Highlight
                                const lastMoved = new Date(item.lastMovedDate);
                                const today = new Date();
                                const days = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
                                const isDead = days > item.deadStockDuration;

                                return (
                                    <TableRow key={item.id} className={isDead ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                                        <TableCell className="font-medium">
                                            {item.name}
                                            {isDead && <span className="ml-2 text-[10px] text-red-600 font-bold border border-red-200 px-1 rounded bg-red-50">DEAD</span>}
                                        </TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-right">
                                            {totalQty} <span className="text-xs text-muted-foreground">{item.baseUnit}</span>
                                        </TableCell>
                                        <TableCell className="text-right">₹{item.purchasePrice}</TableCell>
                                        <TableCell className="text-right font-bold">₹{Math.round(value).toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">{item.lastMovedDate.split('T')[0]}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
