import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Coins, Receipt, Plus } from 'lucide-react';

const Expenses = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-muted-foreground">Track salary and other expenses from collected cash.</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Salary Taken</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹2,000</div>
                        <p className="text-xs text-muted-foreground">From collected cash</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Other Expenses</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹350</div>
                        <p className="text-xs text-muted-foreground">Fuel, food, etc.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Cash</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹10,100</div>
                        <p className="text-xs text-muted-foreground">To be deposited</p>
                    </CardContent>
                </Card>
            </div>

            {/* Salary Entry */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        Salary Entry
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No salary entries for today.
                    </div>
                </CardContent>
            </Card>

            {/* Expense History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Expense History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No expense records found.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Expenses;
