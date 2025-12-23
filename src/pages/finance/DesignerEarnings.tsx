import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for designer earnings
const designerData = [
    { id: 1, name: 'Rahul Kumar', designsCompleted: 145, fines: 2, grossEarnings: 725, deductions: 100, netEarnings: 625 },
    { id: 2, name: 'Priya Sharma', designsCompleted: 198, fines: 0, grossEarnings: 990, deductions: 0, netEarnings: 990 },
    { id: 3, name: 'Amit Patel', designsCompleted: 87, fines: 1, grossEarnings: 435, deductions: 50, netEarnings: 385 },
    { id: 4, name: 'Sneha Nair', designsCompleted: 234, fines: 3, grossEarnings: 1170, deductions: 150, netEarnings: 1020 },
    { id: 5, name: 'Vikram Singh', designsCompleted: 156, fines: 0, grossEarnings: 780, deductions: 0, netEarnings: 780 },
];

const DesignerEarnings = () => {
    const totalDesigns = designerData.reduce((sum, d) => sum + d.designsCompleted, 0);
    const totalFines = designerData.reduce((sum, d) => sum + d.fines, 0);
    const totalGross = designerData.reduce((sum, d) => sum + d.grossEarnings, 0);
    const totalNet = designerData.reduce((sum, d) => sum + d.netEarnings, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Designer Earnings</h1>
                <p className="text-muted-foreground">Track designer payments: ₹5 per design, ₹50 fine per mistake.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Designs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDesigns}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{totalFines}</div>
                        <p className="text-xs text-muted-foreground">₹{totalFines * 50} deducted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Gross Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalGross}</div>
                        <p className="text-xs text-muted-foreground">Before deductions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalNet}</div>
                        <p className="text-xs text-muted-foreground">After fines</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Designer Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Designer</TableHead>
                                <TableHead className="text-right">Designs</TableHead>
                                <TableHead className="text-right">Fines</TableHead>
                                <TableHead className="text-right">Gross (₹)</TableHead>
                                <TableHead className="text-right">Deductions (₹)</TableHead>
                                <TableHead className="text-right">Net Earnings (₹)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {designerData.map((designer) => (
                                <TableRow key={designer.id}>
                                    <TableCell className="font-medium">{designer.name}</TableCell>
                                    <TableCell className="text-right">{designer.designsCompleted}</TableCell>
                                    <TableCell className="text-right">
                                        {designer.fines > 0 ? (
                                            <span className="text-red-600">{designer.fines}</span>
                                        ) : (
                                            <span className="text-green-600">0</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">{designer.grossEarnings}</TableCell>
                                    <TableCell className="text-right text-red-600">
                                        {designer.deductions > 0 ? `-${designer.deductions}` : '0'}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{designer.netEarnings}</TableCell>
                                    <TableCell>
                                        <Badge variant={designer.fines === 0 ? 'default' : 'destructive'}>
                                            {designer.fines === 0 ? 'Clean' : 'Has Fines'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default DesignerEarnings;
