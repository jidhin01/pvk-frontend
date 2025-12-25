import React, { useState } from 'react';
import { useSealProduction } from '../hooks/useSealProduction';
import { BatchingStation } from '../stations/BatchingStation';
import { AssemblyStation } from '../stations/AssemblyStation';
import { JobDetailsPanel } from '../components/JobDetailsPanel';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Layers,
    Hammer,
    CheckCircle2,
    Search,
    Clock,
    User2,
    Languages,
    Zap,
    ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SealOrder, TimelineStep } from '@/data/mockSealData';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// Timeline Component
const OrderTimeline = ({ timeline }: { timeline: TimelineStep[] }) => {
    const completedSteps = timeline.filter(s => s.completed).length;
    const progress = (completedSteps / timeline.length) * 100;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{completedSteps}/{timeline.length} steps</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-3">
                {timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${step.completed
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                }`}>
                                {step.completed ? '✓' : idx + 1}
                            </div>
                            {idx < timeline.length - 1 && (
                                <div className={`w-0.5 h-6 mt-1 ${step.completed ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-slate-200 dark:bg-slate-700'
                                    }`} />
                            )}
                        </div>
                        <div className="flex-1 pb-2">
                            <div className={`text-sm font-medium ${step.completed ? 'text-slate-900 dark:text-slate-100' : 'text-muted-foreground'}`}>
                                {step.stage}
                            </div>
                            {step.date && (
                                <div className="text-xs text-muted-foreground">
                                    {new Date(step.date).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            )}
                            {step.description && (
                                <div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Enhanced Job Card Component
const EnhancedJobCard = ({
    order,
    onViewDetails,
    onAction,
    actionLabel
}: {
    order: SealOrder;
    onViewDetails: (order: SealOrder) => void;
    onAction?: () => void;
    actionLabel?: string;
}) => {
    return (
        <Card
            className={`shadow-sm hover:shadow-md transition-all cursor-pointer ${order.priority === 'rush'
                    ? 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-white dark:from-red-950/10 dark:to-slate-950'
                    : order.status === 'mounting'
                        ? 'border-l-4 border-l-orange-500'
                        : 'border-l-4 border-l-slate-200 dark:border-l-slate-700'
                }`}
            onClick={() => onViewDetails(order)}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{order.id}</span>
                            {order.priority === 'rush' && (
                                <Badge variant="destructive" className="text-[10px] h-5 gap-1">
                                    <Zap className="h-3 w-3" /> RUSH
                                </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] h-5">
                                {order.type.replace('_', '-')}
                            </Badge>
                        </div>
                        <div className="text-sm line-clamp-1 text-slate-700 dark:text-slate-300">{order.content}</div>
                    </div>
                </div>

                <div className="space-y-2 text-xs">
                    {/* Dealer & Language */}
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User2 className="h-3 w-3" />
                            {order.dealerName}
                        </span>
                        <span className="flex items-center gap-1">
                            <Languages className="h-3 w-3" />
                            {order.language}
                        </span>
                    </div>

                    {/* Timeline Progress */}
                    <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div
                                className="bg-purple-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${(order.timeline.filter(t => t.completed).length / order.timeline.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-muted-foreground">
                            {order.timeline.filter(t => t.completed).length}/{order.timeline.length}
                        </span>
                    </div>

                    {/* Assigned & Deadline */}
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-muted-foreground">
                            {order.assignedTo ? `Assigned: ${order.assignedTo}` : 'Unassigned'}
                        </span>
                        {order.estimatedCompletion && (
                            <span className="text-muted-foreground">
                                ETA: {new Date(order.estimatedCompletion).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                        )}
                    </div>
                </div>

                {onAction && actionLabel && (
                    <Button
                        size="sm"
                        className="w-full mt-3 h-8 text-xs gap-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction();
                        }}
                    >
                        {actionLabel} <ArrowRight className="h-3 w-3" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

// Enhanced Details Panel
const EnhancedJobDetailsPanel = ({
    open,
    order,
    onClose,
    onAction
}: {
    open: boolean;
    order: SealOrder | null;
    onClose: () => void;
    onAction: (action: string) => void;
}) => {
    if (!open || !order) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-md bg-background h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">{order.type.replace('_', '-')} Seal</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
                    </div>

                    {/* Priority & Status */}
                    <div className="flex gap-2">
                        <Badge variant={order.priority === 'rush' ? 'destructive' : 'secondary'}>
                            {order.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{order.status.replace('_', ' ').toUpperCase()}</Badge>
                    </div>

                    {/* Seal Content */}
                    <Card className="bg-slate-50 dark:bg-slate-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Seal Matter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-sm whitespace-pre-wrap font-mono bg-white dark:bg-slate-950 p-3 rounded-lg border">
                                {order.sealMatter}
                            </pre>
                        </CardContent>
                    </Card>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Dealer</span>
                            <div className="font-medium">{order.dealerName}</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Language</span>
                            <div className="font-medium">{order.language}</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Size</span>
                            <div className="font-medium">{order.size}</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Machine</span>
                            <div className="font-medium">{order.machineModel || 'N/A'}</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Price</span>
                            <div className="font-medium text-emerald-600">₹{order.price}</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Cost</span>
                            <div className="font-medium">₹{order.cost}</div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h4 className="font-semibold mb-3">Order Timeline</h4>
                        <OrderTimeline timeline={order.timeline} />
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                        {order.status === 'pending_batch' && (
                            <Button className="w-full" onClick={() => onAction('add_to_batch')}>
                                Add to Batch
                            </Button>
                        )}
                        {(order.status === 'exposure_done' || order.status === 'mounting') && (
                            <Button className="w-full" onClick={() => onAction('mark_complete')}>
                                Mark as Completed
                            </Button>
                        )}
                        <Button variant="outline" className="w-full" onClick={() => toast.info('Opening design editor...')}>
                            Edit Design
                        </Button>
                        {order.priority !== 'rush' && (
                            <Button variant="secondary" className="w-full" onClick={() => toast.success('Marked as Rush!')}>
                                Mark as Rush
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

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
    const [searchTerm, setSearchTerm] = useState('');

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
            toast.success(`Order ${selectedOrder.id} completed!`);
            setSelectedOrder(null);
        }
    };

    // Filter completed orders by search
    const filteredCompleted = completedList.filter(order =>
        order.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.dealerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Work Floor</h2>
                    <p className="text-sm text-muted-foreground">Manage seal production workflow</p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                    <TabsList className="grid w-full grid-cols-3 h-10 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <TabsTrigger value="batching" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 text-xs gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            Darkroom
                            {pendingCount > 0 && <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] h-4 px-1">{pendingCount}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="assembly" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 text-xs gap-1">
                            <Hammer className="w-3.5 h-3.5" />
                            Mounting
                            {assemblyCount > 0 && <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] h-4 px-1">{assemblyCount}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 text-xs gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-h-0">
                {activeTab === 'batching' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {pendingCount} orders waiting for batch exposure
                            </p>
                            <Button
                                size="sm"
                                disabled={pendingCount === 0}
                                onClick={() => {
                                    createBatch(getPendingBatchInfo());
                                    toast.success('Batch exposure started!');
                                }}
                            >
                                Run Batch ({pendingCount})
                            </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {getPendingBatchInfo().map(order => (
                                <EnhancedJobCard
                                    key={order.id}
                                    order={order}
                                    onViewDetails={setSelectedOrder}
                                />
                            ))}
                        </div>
                        {pendingCount === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>No orders pending for batch</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'assembly' && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {assemblyCount} seals ready for mounting
                        </p>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {getAssemblyQueue().map(order => (
                                <EnhancedJobCard
                                    key={order.id}
                                    order={order}
                                    onViewDetails={setSelectedOrder}
                                    actionLabel="Complete Assembly"
                                    onAction={() => {
                                        updateStatus(order.id, 'completed');
                                        toast.success(`${order.id} completed!`);
                                    }}
                                />
                            ))}
                        </div>
                        {assemblyCount === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Hammer className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>Assembly line clear</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'completed' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex items-center gap-2 max-w-sm">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by ID, content, dealer..."
                                className="h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {filteredCompleted.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>{searchTerm ? 'No matching orders found' : 'No completed orders today'}</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {filteredCompleted.map(order => (
                                    <Card
                                        key={order.id}
                                        className="bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{order.content}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                        <span>{order.id}</span>
                                                        <span>•</span>
                                                        <span>{order.dealerName}</span>
                                                        <span>•</span>
                                                        <span className="text-emerald-600 font-medium">₹{order.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
                                                Delivered
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <EnhancedJobDetailsPanel
                open={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onAction={handlePanelAction}
            />
        </div>
    );
};
