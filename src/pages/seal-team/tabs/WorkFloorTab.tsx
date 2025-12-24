import React, { useState } from 'react';
import { useSealProduction } from '../hooks/useSealProduction';
import { BatchingStation } from '../stations/BatchingStation';
import { AssemblyStation } from '../stations/AssemblyStation';
import { JobDetailsPanel } from '../components/JobDetailsPanel';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Hammer, CheckCircle2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SealOrder } from '@/data/mockSealData';
import { toast } from 'sonner';

export const WorkFloorTab = () => {
    const {
        orders,
        getPendingBatchInfo,
        getAssemblyQueue,
        getCompleted,
        createBatch,
        updateStatus,
        checkStock
    } = useSealProduction();

    const [activeTab, setActiveTab] = useState<string>('batching');
    const [selectedOrder, setSelectedOrder] = useState<SealOrder | null>(null);

    const pendingCount = getPendingBatchInfo().length;
    const assemblyCount = getAssemblyQueue().length;
    const completedList = getCompleted();

    const handlePanelAction = (action: string) => {
        if (!selectedOrder) return;

        if (action === 'add_to_batch') {
            createBatch([selectedOrder]);
            toast.success(`Job ${selectedOrder.id} added to next batch`);
            setSelectedOrder(null);
        } else if (action === 'mark_complete') {
            updateStatus(selectedOrder.id, 'completed');
            setSelectedOrder(null);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            {/* SUB-NAVIGATION (Tabs) */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-slate-700 dark:text-slate-300">Station Control</h2>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                    <TabsList className="grid w-full grid-cols-3 h-10 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <TabsTrigger value="batching" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 text-xs">
                            <Layers className="w-3.5 h-3.5 mr-2" />
                            Darkroom
                            {pendingCount > 0 && <Badge variant="secondary" className="ml-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[10px] h-4 px-1">{pendingCount}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="assembly" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 text-xs">
                            <Hammer className="w-3.5 h-3.5 mr-2" />
                            Mounting
                            {assemblyCount > 0 && <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] h-4 px-1">{assemblyCount}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                            Log
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-h-0">
                {activeTab === 'batching' && (
                    <BatchingStation
                        orders={getPendingBatchInfo()}
                        onCreateBatch={createBatch}
                        onViewDetails={setSelectedOrder}
                    />
                )}

                {activeTab === 'assembly' && (
                    <AssemblyStation
                        orders={getAssemblyQueue()}
                        onComplete={(id) => updateStatus(id, 'completed')}
                        checkStock={checkStock}
                        onViewDetails={setSelectedOrder}
                    />
                )}

                {activeTab === 'completed' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex items-center gap-2 max-w-sm mb-6">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search logs..." className="h-9" />
                        </div>

                        {completedList.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10">No completed orders today.</div>
                        ) : (
                            <div className="grid gap-3">
                                {completedList.map(order => (
                                    <Card
                                        key={order.id}
                                        className="bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{order.content}</div>
                                                    <div className="text-xs text-muted-foreground">ID: {order.id} • {new Date().toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Delivered</Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <JobDetailsPanel
                open={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onAction={handlePanelAction}
            />
        </div>
    );
};
