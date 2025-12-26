import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PackageCheck, Undo2, Plus, Truck, MapPin, Trash2, Wallet, Coins, Receipt, Fuel, UtensilsCrossed, Car } from 'lucide-react';
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
    MOCK_LINE_STAFF,
    Expense,
    getStatusColor,
    getRouteLabel,
    getRouteColor,
} from '@/data/mockSalesData';

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

const DailyOperations = () => {
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [expenseType, setExpenseType] = useState<ExpenseType | ''>('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');

    const staffInfo = MOCK_LINE_STAFF;
    const financials = MOCK_TODAY_FINANCIALS;

    // Only show deliveries from assigned route
    const myDeliveries = MOCK_DELIVERIES.filter(d => d.route === staffInfo.assignedRoute);
    const itemsTaken = myDeliveries.filter(d => d.takenForDelivery);
    const delivered = myDeliveries.filter(d => d.status === 'delivered');
    const returned = myDeliveries.filter(d => d.status === 'returned');

    const totalSalary = expenses.filter(e => e.type === 'salary').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.filter(e => e.type !== 'salary').reduce((sum, e) => sum + e.amount, 0);
    const cashToDeposit = financials.cashCollected - totalSalary - totalExpenses;

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

    const handleDeleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast.success('Removed');
    };

    return (
        <div className="space-y-5 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Operations & Expenses</h1>
                    <p className="text-sm text-muted-foreground">Today's summary & expense tracking</p>
                </div>
                <Badge className={`${getRouteColor(staffInfo.assignedRoute)}`}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {getRouteLabel(staffInfo.assignedRoute)}
                </Badge>
            </div>

            {/* Delivery Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold">{itemsTaken.length}</p>
                        <p className="text-xs text-muted-foreground">Taken</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                            <PackageCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold">{delivered.length}</p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                            <Undo2 className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold">{returned.length}</p>
                        <p className="text-xs text-muted-foreground">Returns</p>
                    </CardContent>
                </Card>
            </div>

            {/* Items List */}
            {itemsTaken.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Items Taken</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {itemsTaken.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'delivered' ? 'bg-green-500' :
                                        item.status === 'in-transit' ? 'bg-blue-500' : 'bg-amber-500'
                                        }`} />
                                    <div>
                                        <p className="font-medium">{item.customerName}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.itemDescription}</p>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(item.status)}>
                                    {item.status === 'in-transit' ? 'On way' : item.status}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Expense Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <Coins className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-xl font-bold">₹{totalSalary.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Salary</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <Receipt className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                        <p className="text-xl font-bold">₹{totalExpenses.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Expenses</p>
                    </CardContent>
                </Card>
                <Card className="text-center bg-primary/5">
                    <CardContent className="pt-4 pb-3">
                        <Wallet className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-xl font-bold text-primary">₹{cashToDeposit.toLocaleString()}</p>
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

            {/* Expense History */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Expense History</CardTitle>
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteExpense(exp.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            {/* Cash Summary */}
            <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cash Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Collected</span>
                        <span className="font-semibold text-green-600">₹{financials.cashCollected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Salary Taken</span>
                        <span className="font-semibold text-purple-600">-₹{totalSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Other Expenses</span>
                        <span className="font-semibold text-orange-600">-₹{totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-semibold">To Deposit</span>
                        <span className="font-bold text-lg text-primary">₹{cashToDeposit.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyOperations;
