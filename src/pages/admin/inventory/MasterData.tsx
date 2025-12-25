import React, { useState } from 'react';
import { useInventoryContext } from '@/contexts/InventoryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, User, Truck, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function MasterData() {
    const { movements, suppliers, addSupplier, deleteSupplier } = useInventoryContext();
    const [activeTab, setActiveTab] = useState('suppliers');

    const handleDelete = (id: number) => {
        deleteSupplier(id);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Master Data Management</h2>
                <p className="text-muted-foreground">Configure system entities and view audit logs.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="suppliers"><Truck className="mr-2 h-4 w-4" /> Suppliers</TabsTrigger>
                    <TabsTrigger value="personnel"><User className="mr-2 h-4 w-4" /> Personnel Log</TabsTrigger>
                    <TabsTrigger value="locations"><MapPin className="mr-2 h-4 w-4" /> Locations</TabsTrigger>
                </TabsList>

                {/* Suppliers Tab */}
                <TabsContent value="suppliers">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Approved Suppliers</CardTitle>
                                <CardDescription>Manage vendor details and categories.</CardDescription>
                            </div>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Supplier Name</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell className="font-medium">{supplier.name}</TableCell>
                                            <TableCell>{supplier.contact}</TableCell>
                                            <TableCell>{supplier.phone}</TableCell>
                                            <TableCell>{supplier.category}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(supplier.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Personnel Log Tab */}
                <TabsContent value="personnel">
                    <Card>
                        <CardHeader>
                            <CardTitle>Staff Activity Log</CardTitle>
                            <CardDescription>Audit trail of actions performed by Stock Keepers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movements.slice(0, 10).map((move) => (
                                        <TableRow key={move.id}>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {new Date(move.date).toLocaleString()}
                                            </TableCell>
                                            <TableCell>{move.performedBy}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${move.type === 'INWARD' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    move.type === 'DAMAGE_LOSS' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                        'bg-blue-50 text-blue-700 ring-blue-600/20'
                                                    }`}>
                                                    {move.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {move.quantity} {move.itemName} ({move.location})
                                                {move.notes && <span className="block text-xs text-muted-foreground italic">{move.notes}</span>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Locations Tab (Read Only Mock) */}
                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Storage Config</CardTitle>
                            <CardDescription>Current Location hierarchy.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600" /> Main Godown</h3>
                                    <p className="text-sm text-muted-foreground">Central storage facility for bulk items.</p>
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded border">Shelf A (Paper)</div>
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded border">Shelf B (Inks)</div>
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded border">Cabinet C (Spares)</div>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Truck className="h-5 w-5 text-purple-600" /> Retail Shop</h3>
                                    <p className="text-sm text-muted-foreground">Front-end inventory for immediate consumption.</p>
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded border">Counter Stock</div>
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded border">Display Units</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
