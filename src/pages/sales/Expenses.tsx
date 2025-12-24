import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Coins, Receipt, Plus, Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { MOCK_TODAY_FINANCIALS, MOCK_EXPENSES, Expense } from '@/data/mockSalesData';

type ExpenseType = 'salary' | 'fuel' | 'food' | 'travel' | 'other';

const Expenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [expenseType, setExpenseType] = useState<ExpenseType | ''>('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');

    const financials = MOCK_TODAY_FINANCIALS;
    const salaryTaken = expenses.filter(e => e.type === 'salary').reduce((sum, e) => sum + e.amount, 0);
    const otherExpenses = expenses.filter(e => e.type !== 'salary').reduce((sum, e) => sum + e.amount, 0);
    const netCash = financials.cashCollected - salaryTaken - otherExpenses;

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

    const handleDelete = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast.success('Removed');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <p className="text-muted-foreground">Track salary and other expenses.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Salary Taken</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{salaryTaken.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From cash collected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Other Expenses</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{otherExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Fuel, food, etc.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Cash</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{netCash.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">To be deposited</p>
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

            {/* Expense History */}
            <Card>
                <CardHeader>
                    <CardTitle>Expense History</CardTitle>
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">₹{exp.amount.toLocaleString()}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(exp.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Expenses;
