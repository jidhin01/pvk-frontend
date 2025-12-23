import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Eye, Truck, Package } from 'lucide-react';

const DeliveryList = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Delivery List</h1>
                <p className="text-muted-foreground">Manage today's and pending deliveries.</p>
            </div>

            <Tabs defaultValue="today" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="route">Route-wise</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Today's Deliveries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                No deliveries scheduled for today.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Pending Deliveries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                No pending deliveries found.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="route" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Route-wise Deliveries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                No route-wise deliveries configured.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DeliveryList;
