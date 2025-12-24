import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardList, PackageCheck, Undo2, Plus } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
    MOCK_DELIVERIES,
    MOCK_TODAY_FINANCIALS,
    MOCK_EXPENSES,
    Expense,
} from '@/data/mockSalesData';

type ExpenseType = 'salary' | 'fuel' | 'food' | 'travel' | 'other';

const DailyOperations = () => {
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [expenseType, setExpenseType] = useState<ExpenseType | ''>('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');

    const financials = MOCK_TODAY_FINANCIALS;
    const totalSalary = expenses.filter(e => e.type === 'salary').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.filter(e => e.type !== 'salary').reduce((sum, e) => sum + e.amount, 0);
    const cashToDeposit = financials.cashCollected - totalSalary - totalExpenses;

    const itemsTaken = MOCK_DELIVERIES.length;
    const delivered = MOCK_DELIVERIES.filter(d => d.status === 'delivered').length;
    const returned = MOCK_DELIVERIES.filter(d => d.status === 'returned').length;

    const handleAddExpense = () => {
        const amount = parseFloat(expenseAmount);
        if (!expenseType || isNaN(amount) || amount <= 0) {
            toast.error('Please select type and enter valid amount');
            return;
        }
        const newExpense: Expense = {
            id: `EXP-${Date.now()}`,
            type: expenseType,
            amount,
            description: expenseDescription || expenseType,
            createdAt: new Date().toISOString(),
        };
        setExpenses(prev => [newExpense, ...prev]);
        setExpenseType('');
        setExpenseAmount('');
        setExpenseDescription('');
        toast.success(`Added ₹${amount}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Daily Operations</h1>
                <p className="text-muted-foreground">Manage items, salary, and expenses.</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Taken</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{itemsTaken}</div>
                        <p className="text-xs text-muted-foreground">For today's delivery</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <PackageCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{delivered}</div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales Return</CardTitle>
                        <Undo2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{returned}</div>
                        <p className="text-xs text-muted-foreground">Items returned</p>
                    </CardContent>
                </Card>
            </div>

            {/* Add Expense Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Add Expense</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Select value={expenseType} onValueChange={(v) => setExpenseType(v as ExpenseType)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="salary">Salary</SelectItem>
                                    <SelectItem value="fuel">Fuel</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="travel">Travel</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Description (optional)</Label>
                        <Input
                            placeholder="e.g., Petrol"
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <Button className="w-full" onClick={handleAddExpense}>
                        <Plus className="h-4 w-4 mr-2" /> Add Expense
                    </Button>
                </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                            <span>Cash Collected</span>
                            <span className="font-medium">₹{financials.cashCollected.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span>Salary Taken</span>
                            <span className="font-medium">- ₹{totalSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span>Expenses</span>
                            <span className="font-medium">- ₹{totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 font-semibold text-base">
                            <span>Cash to Deposit</span>
                            <span className="text-primary">₹{cashToDeposit.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses List */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    {expenses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No expenses recorded</div>
                    ) : (
                        <div className="space-y-2">
                            {expenses.map((exp) => (
                                <div key={exp.id} className="flex items-center justify-between p-3 rounded border">
                                    <div>
                                        <p className="font-medium capitalize">{exp.description}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{exp.type}</p>
                                    </div>
                                    <span className="font-semibold">₹{exp.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyOperations;
