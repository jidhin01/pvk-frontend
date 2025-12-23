import React from 'react';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-12345', customer: 'Dealer ABC', product: 'PAN Card', amount: 2500, status: 'completed', date: '2024-01-15' },
  { id: 'ORD-12346', customer: 'Dealer XYZ', product: 'Rubber Stamp', amount: 1800, status: 'processing', date: '2024-01-15' },
  { id: 'ORD-12347', customer: 'Dealer LMN', product: 'ID Card', amount: 3200, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-12348', customer: 'Dealer PQR', product: 'Visiting Card', amount: 1200, status: 'completed', date: '2024-01-14' },
  { id: 'ORD-12349', customer: 'Dealer STU', product: 'Letterhead', amount: 4500, status: 'cancelled', date: '2024-01-13' },
];

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-info/10 text-info border-info/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function DataTable() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of latest transactions</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-medium">Order ID</TableHead>
            <TableHead className="font-medium">Customer</TableHead>
            <TableHead className="font-medium">Product</TableHead>
            <TableHead className="font-medium text-right">Amount</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_ORDERS.map((order) => (
            <TableRow key={order.id} className="cursor-pointer">
              <TableCell className="font-medium text-primary">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell className="text-muted-foreground">{order.product}</TableCell>
              <TableCell className="text-right font-medium">₹{order.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("capitalize font-medium", statusStyles[order.status])}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.date}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
