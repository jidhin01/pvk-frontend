import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wallet, Coins, Receipt, Plus, Trash2, CheckCircle, MapPin, Fuel, UtensilsCrossed, Car } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { MOCK_TODAY_FINANCIALS, MOCK_EXPENSES, MOCK_LINE_STAFF, Expense, getRouteLabel, getRouteColor } from '@/data/mockSalesData';

type ExpenseType = 'salary' | 'fuel' | 'food' | 'travel' | 'other';

const getExpenseIcon = (type: ExpenseType) => {
    switch (type) {
        case 'salary': return <Coins className="h-4 w-4" />;
        case 'fuel': return <Fuel className="h-4 w-4" />;
        case 'food': return <UtensilsCrossed className="h-4 w-4" />;
        case 'travel': return <Car className="h-4 w-4" />;
        default: return <Receipt className="h-4 w-4" />;
    }
};

const Expenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [expenseType, setExpenseType] = useState<ExpenseType | ''>('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');

    const staffInfo = MOCK_LINE_STAFF;
    const financials = MOCK_TODAY_FINANCIALS;
    const salaryTaken = expenses.filter(e => e.type === 'salary').reduce((sum, e) => sum + e.amount, 0);
    const otherExpenses = expenses.filter(e => e.type !== 'salary').reduce((sum, e) => sum + e.amount, 0);
    const netCash = financials.cashCollected - salaryTaken - otherExpenses;

    const handleAddExpense = () => {
        const amount = parseFloat(expenseAmount);
        if (!expenseType || isNaN(amount) || amount <= 0) {
            toast.error('Select type and enter amount');
            return;
        }
        const newExpense: Expense = {
            id: `EXP-${Date.now()}`,
            type: expenseType,
            amount,
            description: expenseDescription || expenseType,
            createdAt: new Date().toISOString(),
            verifiedByFinance: false,
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
        <div className="space-y-5 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Expenses</h1>
                    <p className="text-sm text-muted-foreground">Track salary & expenses</p>
                </div>
                <Badge className={`${getRouteColor(staffInfo.assignedRoute)}`}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {getRouteLabel(staffInfo.assignedRoute)}
                </Badge>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <Coins className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-xl font-bold">₹{salaryTaken.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Salary</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <Receipt className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                        <p className="text-xl font-bold">₹{otherExpenses.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Expenses</p>
                    </CardContent>
                </Card>
                <Card className="text-center bg-primary/5">
                    <CardContent className="pt-4 pb-3">
                        <Wallet className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-xl font-bold text-primary">₹{netCash.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Net</p>
                    </CardContent>
                </Card>
            </div>

            {/* Add Expense */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Add Expense</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Select value={expenseType} onValueChange={(v) => setExpenseType(v as ExpenseType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="fuel">Fuel</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Amount ₹"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                        />
                    </div>
                    <Input
                        placeholder="Description (optional)"
                        value={expenseDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleAddExpense}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </CardContent>
            </Card>

            {/* Expense List */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">History</CardTitle>
                        <Badge variant="secondary">{expenses.length}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {expenses.length === 0 ? (
                        <p className="text-center py-6 text-muted-foreground">No expenses</p>
                    ) : (
                        expenses.map((exp) => {
                            const time = new Date(exp.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${exp.type === 'salary' ? 'bg-purple-100' :
                                                exp.type === 'fuel' ? 'bg-amber-100' :
                                                    exp.type === 'food' ? 'bg-green-100' :
                                                        exp.type === 'travel' ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            {getExpenseIcon(exp.type as ExpenseType)}
                                        </div>
                                        <div>
                                            <p className="font-medium capitalize">{exp.description}</p>
                                            <p className="text-xs text-muted-foreground">{exp.type} • {time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">₹{exp.amount.toLocaleString()}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(exp.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Expenses;
