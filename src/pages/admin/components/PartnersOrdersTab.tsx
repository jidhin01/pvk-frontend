import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Filter, Eye, Download, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PartnersOrdersTabProps {
    partnerType: 'dealer' | 'customer';
}

const MOCK_ORDERS = [
    { id: 'ORD-001', partner: 'Star Graphics', date: '2023-12-26', status: 'completed', amount: 1540, items: 3 },
    { id: 'ORD-002', partner: 'Metro Ads', date: '2023-12-25', status: 'processing', amount: 850, items: 2 },
    { id: 'ORD-003', partner: 'Ramesh Kumar', date: '2023-12-25', status: 'pending', amount: 450, items: 1 },
    { id: 'ORD-004', partner: 'ABC Prints', date: '2023-12-24', status: 'completed', amount: 3200, items: 5 },
    { id: 'ORD-005', partner: 'Priya Nair', date: '2023-12-23', status: 'cancelled', amount: 0, items: 1 },
];

const PartnersOrdersTab: React.FC<PartnersOrdersTabProps> = ({ partnerType }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Completed</Badge>;
            case 'processing': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Processing</Badge>;
            case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pending</Badge>;
            case 'cancelled': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Cancelled</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredOrders = MOCK_ORDERS.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.partner.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{partnerType === 'dealer' ? 'Dealer' : 'Customer'} Orders</CardTitle>
                    <CardDescription>Recent orders placed by {partnerType}s</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <ShoppingCart className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{order.id}</span>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {order.partner} • {order.items} items • {order.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="font-bold">₹{order.amount}</div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">Action</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" /> Download Invoice
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No orders found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PartnersOrdersTab;
