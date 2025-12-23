import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Warehouse, AlertTriangle, ArrowRightLeft } from 'lucide-react';

const DashboardOverview = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Stock Dashboard</h1>
                <p className="text-muted-foreground">Overview of inventory across Godown and Shop locations.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Godown Stock</CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">Total items in godown</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shop Stock</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">385</div>
                        <p className="text-xs text-muted-foreground">Total items in shop</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">12</div>
                        <p className="text-xs text-muted-foreground">Below minimum threshold</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dead Stock</CardTitle>
                        <ArrowRightLeft className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">5</div>
                        <p className="text-xs text-muted-foreground">Needs attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Stock Movements */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Stock Movements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">PVC Cards - 500 pcs</p>
                                    <p className="text-xs text-muted-foreground">Added to Godown</p>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Business Cards - 200 pcs</p>
                                    <p className="text-xs text-muted-foreground">Transferred: Godown → Shop</p>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">5 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Seal Ink - 5 units</p>
                                    <p className="text-xs text-muted-foreground">Low stock alert triggered</p>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">Yesterday</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardOverview;
