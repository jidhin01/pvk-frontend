import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  TrendingUp,
  AlertOctagon,
  CheckCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data as per requirements:
// Completed: 12 (₹60 earnings), Mistakes: 1 (-₹50), Net: ₹10
const EARNINGS_DATA = {
  completed: 12,
  mistakes: 1,
  ratePerDesign: 5,
  finePerMistake: 50,
};

const TRANSACTIONS = [
  { id: 'TXN-012', date: '2025-12-24', type: 'Design', amount: 5, ref: 'JOB-199' },
  { id: 'TXN-011', date: '2025-12-24', type: 'Design', amount: 5, ref: 'JOB-198' },
  { id: 'TXN-010', date: '2025-12-24', type: 'Fine', amount: -50, ref: 'Error in JOB-185' },
  { id: 'TXN-009', date: '2025-12-24', type: 'Design', amount: 5, ref: 'JOB-197' },
  { id: 'TXN-008', date: '2025-12-24', type: 'Design', amount: 5, ref: 'JOB-196' },
  { id: 'TXN-007', date: '2025-12-24', type: 'Design', amount: 5, ref: 'JOB-195' },
];

const DesignerEarnings = () => {
  const totalEarned = EARNINGS_DATA.completed * EARNINGS_DATA.ratePerDesign;
  const totalFines = EARNINGS_DATA.mistakes * EARNINGS_DATA.finePerMistake;
  const netBalance = totalEarned - totalFines;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Earnings</h2>
        <p className="text-sm text-muted-foreground">Track your design revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Completed */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{EARNINGS_DATA.completed}</div>
            <p className="text-xs text-muted-foreground">designs</p>
          </CardContent>
        </Card>

        {/* Earnings */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalEarned}</div>
            <p className="text-xs text-muted-foreground">@ ₹{EARNINGS_DATA.ratePerDesign}/design</p>
          </CardContent>
        </Card>

        {/* Fines */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Deductions</CardTitle>
            <AlertOctagon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-₹{totalFines}</div>
            <p className="text-xs text-muted-foreground">{EARNINGS_DATA.mistakes} mistake</p>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-primary-foreground/90">
              Net Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{netBalance}</div>
            <p className="text-xs text-primary-foreground/70">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Reference</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACTIONS.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="text-xs py-2">{txn.date}</TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant={txn.amount > 0 ? 'secondary' : 'destructive'}
                      className="text-[10px] px-1.5"
                    >
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-2">{txn.ref}</TableCell>
                  <TableCell className={`text-xs text-right font-medium py-2 ${txn.amount > 0 ? 'text-green-600' : 'text-destructive'
                    }`}>
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
