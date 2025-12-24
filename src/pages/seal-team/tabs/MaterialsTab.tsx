import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { Beaker, AlertTriangle, ShoppingCart, Info } from 'lucide-react';
import { toast } from 'sonner';

export const MaterialsTab = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Material Inventory</h2>
                    <p className="text-sm text-muted-foreground">Manage consumables and machine stock for the Seal Team.</p>
                </div>
                <Button className="bg-slate-900 text-white" onClick={() => toast.success("Refill Request Sent to Store Keeper")}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Request Restock
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* 1. CONSUMABLES TRACKER (Chemicals/Film) */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Beaker className="h-5 w-5 text-purple-600" />
                            Consumables Level
                        </CardTitle>
                        <CardDescription>Estimated remaining levels based on usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">

                        {/* Polymer Liquid */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Polymer Liquid (Red)</span>
                                <span className="text-muted-foreground">1.2 Liters left</span>
                            </div>
                            <Progress value={30} className="h-2 bg-slate-100" indicatorClassName="bg-red-500" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Critical Level</span>
                                <span className="text-red-600 font-semibold flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Low Stock
                                </span>
                            </div>
                        </div>

                        {/* Negative Film */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Negative Film A4</span>
                                <span className="text-muted-foreground">45 Sheets</span>
                            </div>
                            <Progress value={75} className="h-2 bg-slate-100" indicatorClassName="bg-slate-900" />
                        </div>

                        {/* Tracing Paper */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Tracing Paper (Vellum)</span>
                                <span className="text-muted-foreground">80 Sheets</span>
                            </div>
                            <Progress value={90} className="h-2 bg-slate-100" indicatorClassName="bg-slate-400" />
                        </div>

                    </CardContent>
                </Card>

                {/* 2. MACHINE STOCK (Handles) */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-600" />
                            Machine Handles
                        </CardTitle>
                        <CardDescription>Top used handles in the shop floor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "Shiny S-842", stock: 3, alert: true },
                                { name: "Shiny S-843", stock: 12, alert: false },
                                { name: "Colop C-20", stock: 8, alert: false },
                                { name: "Pocket 20", stock: 0, alert: true },
                                { name: "Mouse R-30", stock: 15, alert: false },
                                { name: "Wooden 2inch", stock: 45, alert: false },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg border flex flex-col justify-between ${item.alert ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'bg-slate-50 dark:bg-slate-900/50'}`}
                                >
                                    <span className="text-sm font-semibold">{item.name}</span>
                                    <div className="flex items-end justify-between mt-2">
                                        <span className="text-xs text-muted-foreground">Qty</span>
                                        <span className={`text-xl font-bold ${item.alert ? 'text-red-600' : 'text-slate-700'}`}>
                                            {item.stock}
                                        </span>
                                    </div>
                                    {item.alert && <div className="text-[10px] text-red-600 font-medium mt-1">Re-order Recommended</div>}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
