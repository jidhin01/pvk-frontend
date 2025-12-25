import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  CheckCircle,
  CreditCard,
  FileImage,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DesignerType } from '@/contexts/AuthContext';

// Extended mock data with comprehensive earnings history
const EARNINGS_DATA = {
  today: {
    completed: 12,
    mistakes: 1,
    earnings: 60,
    fines: 50,
    net: 10
  },
  week: {
    completed: 58,
    mistakes: 2,
    earnings: 290,
    fines: 100,
    net: 190
  },
  month: {
    completed: 245,
    mistakes: 5,
    earnings: 1225,
    fines: 250,
    net: 975
  },
  ratePerDesign: 5,
  finePerMistake: 50,
};

const TRANSACTIONS = [
  { id: 'TXN-020', date: '2025-12-25', time: '10:30 AM', type: 'Design', amount: 5, ref: 'JOB-301', dealer: 'Star Graphics' },
  { id: 'TXN-019', date: '2025-12-25', time: '10:15 AM', type: 'Design', amount: 5, ref: 'JOB-300', dealer: 'Fresh Prints' },
  { id: 'TXN-018', date: '2025-12-25', time: '09:45 AM', type: 'Design', amount: 5, ref: 'JOB-299', dealer: 'Metro Ads' },
  { id: 'TXN-017', date: '2025-12-25', time: '09:30 AM', type: 'Fine', amount: -50, ref: 'Error in JOB-285', dealer: 'Alpha Designs' },
  { id: 'TXN-016', date: '2025-12-24', time: '05:45 PM', type: 'Design', amount: 5, ref: 'JOB-298', dealer: 'Quick Print' },
  { id: 'TXN-015', date: '2025-12-24', time: '05:30 PM', type: 'Design', amount: 5, ref: 'JOB-297', dealer: 'Star Graphics' },
  { id: 'TXN-014', date: '2025-12-24', time: '04:15 PM', type: 'Design', amount: 5, ref: 'JOB-296', dealer: 'Beta Corp' },
  { id: 'TXN-013', date: '2025-12-24', time: '03:00 PM', type: 'Design', amount: 5, ref: 'JOB-295', dealer: 'Omega Trades' },
  { id: 'TXN-012', date: '2025-12-24', time: '02:30 PM', type: 'Design', amount: 5, ref: 'JOB-294', dealer: 'Metro Ads' },
  { id: 'TXN-011', date: '2025-12-24', time: '11:00 AM', type: 'Fine', amount: -50, ref: 'Error in JOB-280', dealer: 'Card Pro' },
];

interface DesignerEarningsProps {
  designerType?: DesignerType;
}

const DesignerEarnings = ({ designerType = 'normal' }: DesignerEarningsProps) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const data = EARNINGS_DATA[period];
  const isPVC = designerType === 'pvc';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Earnings</h1>
          <p className="text-muted-foreground">Track your design revenue and deductions</p>
        </div>
        <Badge
          variant="outline"
          className={`px-3 py-1.5 text-sm font-medium ${isPVC
              ? 'border-purple-300 bg-purple-50 text-purple-700'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}
        >
          {isPVC ? <CreditCard className="h-4 w-4 mr-2" /> : <FileImage className="h-4 w-4 mr-2" />}
          {isPVC ? 'PVC Card Designer' : 'Normal Designer'}
        </Badge>
      </div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList>
          <TabsTrigger value="today">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completed}</div>
            <p className="text-xs text-muted-foreground">designs</p>
          </CardContent>
        </Card>

        {/* Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+₹{data.earnings}</div>
            <p className="text-xs text-muted-foreground">@ ₹{EARNINGS_DATA.ratePerDesign}/design</p>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-₹{data.fines}</div>
            <p className="text-xs text-muted-foreground">{data.mistakes} fine(s)</p>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card className={isPVC ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.net}</div>
            <p className="text-xs text-white/70">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-muted-foreground text-sm">Today</p>
              <p className="text-xl font-bold">₹{EARNINGS_DATA.today.net}</p>
              <p className="text-xs text-muted-foreground">{EARNINGS_DATA.today.completed} jobs</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-muted-foreground text-sm">This Week</p>
              <p className="text-xl font-bold">₹{EARNINGS_DATA.week.net}</p>
              <p className="text-xs text-muted-foreground">{EARNINGS_DATA.week.completed} jobs</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-muted-foreground text-sm">This Month</p>
              <p className="text-xl font-bold">₹{EARNINGS_DATA.month.net}</p>
              <p className="text-xs text-muted-foreground">{EARNINGS_DATA.month.completed} jobs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Reference</TableHead>
                <TableHead className="text-xs">Dealer</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACTIONS.map((txn) => (
                <TableRow key={txn.id} className="hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="text-sm">{txn.date}</div>
                    <div className="text-xs text-muted-foreground">{txn.time}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant={txn.amount > 0 ? 'secondary' : 'destructive'}
                      className={`text-xs ${txn.amount > 0 ? 'bg-green-100 text-green-700' : ''}`}
                    >
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    {txn.ref}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {txn.dealer}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <span className={`text-sm font-semibold flex items-center justify-end gap-1 ${txn.amount > 0 ? 'text-green-600' : 'text-destructive'
                      }`}>
                      {txn.amount > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      ₹{Math.abs(txn.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fine Warning */}
      {data.mistakes > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertOctagon className="h-5 w-5 text-orange-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-orange-800">Quality Reminder</p>
              <p className="text-sm text-orange-600">
                You have {data.mistakes} fine(s) this {period}. Double-check your work to avoid deductions!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DesignerEarnings;
