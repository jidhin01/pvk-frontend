
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, TrendingUp, AlertOctagon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DesignerEarnings = () => {
  // Mock data
  const earnings = {
    completed: 145,
    mistakes: 2,
    ratePerDesign: 5,
    finePerMistake: 50
  };

  const totalEarned = earnings.completed * earnings.ratePerDesign;
  const totalFines = earnings.mistakes * earnings.finePerMistake;
  const netPayout = totalEarned - totalFines;

  const transactions = [
    { id: 'TXN-001', date: '2025-12-23', type: 'Design Fee', amount: 5, ref: 'JOB-101' },
    { id: 'TXN-002', date: '2025-12-23', type: 'Design Fee', amount: 5, ref: 'JOB-103' },
    { id: 'TXN-003', date: '2025-12-22', type: 'Fine', amount: -50, ref: 'Mistake in JOB-055' },
    { id: 'TXN-004', date: '2025-12-22', type: 'Design Fee', amount: 5, ref: 'JOB-092' },
    { id: 'TXN-005', date: '2025-12-22', type: 'Design Fee', amount: 5, ref: 'JOB-091' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Earnings & Performance</h2>
        <p className="text-muted-foreground">Track your design revenue and quality metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarned}</div>
            <p className="text-xs text-muted-foreground">For {earnings.completed} designs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductions</CardTitle>
            <AlertOctagon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-₹{totalFines}</div>
            <p className="text-xs text-muted-foreground">{earnings.mistakes} reported mistakes</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/90">Net Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-foreground/90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{netPayout}</div>
            <p className="text-xs text-primary-foreground/80">Available for withdrawal</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>
                    <Badge variant={txn.amount > 0 ? 'secondary' : 'destructive'} className="font-normal">
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{txn.ref}</TableCell>
                  <TableCell className={`text-right font-medium ${txn.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
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
