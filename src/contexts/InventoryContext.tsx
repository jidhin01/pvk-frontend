import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem, StockMovement, PurchaseRequest, StockAudit, ScrapReport, StockTransaction, MOCK_INVENTORY, MOCK_STOCK_MOVEMENTS, MOCK_PURCHASE_REQUESTS, MOCK_AUDIT_LOGS, MOCK_SCRAP_REPORTS, LocationType } from '@/data/mockInventoryData';
import { toast } from 'sonner';

export interface StockOperationResult {
    success: boolean;
    message?: string;
}

// Define Supplier Interface locally for now
export interface Supplier {
    id: number;
    name: string;
    contact: string;
    phone: string;
    category: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'Paper Mart Ltd', contact: 'Ramesh', phone: '9876543210', category: 'Paper' },
    { id: 2, name: 'Techno Colors', contact: 'Suresh', phone: '9876543211', category: 'Ink' },
    { id: 3, name: 'Flex World', contact: 'Mahesh', phone: '9876543212', category: 'Hardware' },
];

export interface PendingAdjustment {
    id: string;
    itemId: string;
    itemName: string;
    qty: number;
    type: 'ADD' | 'REMOVE';
    reason: string;
    cost: number;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestedBy: string;
    location: string;
    unit: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    date: string;
    role: 'ADMIN' | 'STOCK_KEEPER' | 'ALL';
}

interface InventoryContextType {
    inventory: InventoryItem[];
    movements: StockMovement[];
    transactions: StockTransaction[];
    auditLogs: StockAudit[];
    scrapReports: ScrapReport[];
    pendingAdjustments: PendingAdjustment[];
    notifications: Notification[];
    purchaseRequests: PurchaseRequest[];
    setPurchaseRequests: React.Dispatch<React.SetStateAction<PurchaseRequest[]>>;

    // Suppliers State
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (id: number, updates: Partial<Supplier>) => void;
    deleteSupplier: (id: number) => void;

    // Approval Workflow
    requestAdjustment: (itemId: string, qty: number, type: 'ADD' | 'REMOVE', reason: string, location: string) => void;
    approveAdjustment: (id: string) => void;
    rejectAdjustment: (id: string) => void;

    // Notifications
    addNotification: (title: string, message: string, type: Notification['type'], role: Notification['role']) => void;
    markNotificationRead: (id: string) => void;
    clearNotifications: () => void;

    // Actions
    handleAddStock: (itemId: string, qty: number, location: string, cost: number, vendor?: string, batch?: string) => StockOperationResult;
    handleTransfer: (itemId: string, from: string, to: string, qty: number, notes?: string) => StockOperationResult;
    handleStockTransfer: (itemId: string, fromArg: LocationType, toArg: LocationType, qty: number) => StockOperationResult;
    handleAdjustment: (itemId: string, location: string, type: 'ADD' | 'REMOVE', qty: number, reason: string, targetLoc?: LocationType) => StockOperationResult;
    handleBulkImport: (items: any[]) => StockOperationResult;
    handleSwap: (itemId: string, qty: number) => StockOperationResult;
    handleAuditLog: (audit: StockAudit) => void;
    handleReceiveGoods: (itemId: string, qty: number, supplier: string, invoiceNo: string, cost: number, targetLoc?: LocationType) => StockOperationResult;
    handleIssueMaterial: (itemId: string, qty: number, to: string, type: 'PRODUCTION' | 'WASTAGE', reason?: string, sourceLoc?: LocationType) => StockOperationResult;
    handleReturnMaterial: (itemId: string, qty: number, from: string, targetLoc?: LocationType) => StockOperationResult;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [movements, setMovements] = useState<StockMovement[]>(MOCK_STOCK_MOVEMENTS);
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(MOCK_PURCHASE_REQUESTS);
    const [auditLogs, setAuditLogs] = useState<StockAudit[]>(MOCK_AUDIT_LOGS);
    const [scrapReports, setScrapReports] = useState<ScrapReport[]>(MOCK_SCRAP_REPORTS);
    const [pendingAdjustments, setPendingAdjustments] = useState<PendingAdjustment[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

    const logMovement = (
        item: InventoryItem,
        type: StockMovement['type'],
        qty: number,
        location: string,
        notes?: string
    ) => {
        const newMovement: StockMovement = {
            id: `MOV-${Date.now()}`,
            itemId: item.id,
            itemName: item.name,
            type,
            quantity: qty,
            location,
            date: new Date().toISOString(),
            performedBy: 'Stock Keeper',
            notes
        };
        setMovements(prev => [newMovement, ...prev]);
    };

    const getTotalQty = (item: InventoryItem) => item.stockLevels.godown + item.stockLevels.shop;

    // --- Supplier Logic ---
    const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
        const newId = Math.max(...suppliers.map(s => s.id), 0) + 1;
        setSuppliers(prev => [...prev, { ...supplier, id: newId }]);
        toast.success("Supplier Added");
    };

    const updateSupplier = (id: number, updates: Partial<Supplier>) => {
        setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        toast.success("Supplier Updated");
    };

    const deleteSupplier = (id: number) => {
        setSuppliers(prev => prev.filter(s => s.id !== id));
        toast.success("Supplier Deleted");
    };

    // --- Notification System ---
    const addNotification = (title: string, message: string, type: Notification['type'], role: Notification['role']) => {
        const newNotif: Notification = {
            id: `NOTIF-${Date.now()}-${Math.random()}`,
            title,
            message,
            type,
            role,
            read: false,
            date: new Date().toISOString()
        };
        setNotifications(prev => [newNotif, ...prev]);
        toast(title, { description: message });
    };

    const markNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    // --- Approval Workflows ---
    const requestAdjustment = (itemId: string, qty: number, type: 'ADD' | 'REMOVE', reason: string, location: string) => {
        const item = inventory.find(i => i.id === itemId);
        if (!item) return;

        const cost = (qty / item.conversionRatio) * item.purchasePrice;

        const request: PendingAdjustment = {
            id: `ADJ-REQ-${Date.now()}`,
            itemId,
            itemName: item.name,
            qty,
            type,
            reason,
            cost,
            date: new Date().toISOString().split('T')[0],
            status: 'PENDING',
            requestedBy: 'Stock Keeper',
            location,
            unit: item.baseUnit
        };

        setPendingAdjustments(prev => [request, ...prev]);
        addNotification(
            "New Adjustment Request",
            `${type === 'ADD' ? 'Add' : 'Remove'} ${qty} ${item.baseUnit} of ${item.name}`,
            'WARNING',
            'ADMIN'
        );
        toast.success("Adjustment Requested for Approval");
    };

    const approveAdjustment = (id: string) => {
        const request = pendingAdjustments.find(a => a.id === id);
        if (!request) return;

        // Execute the adjustment
        const result = handleAdjustment(request.itemId, request.location, request.type, request.qty, request.reason);

        if (result.success) {
            setPendingAdjustments(prev => prev.filter(p => p.id !== id));
            addNotification("Request Approved", `Adjustment for ${request.itemName} has been approved.`, 'SUCCESS', 'STOCK_KEEPER');
        }
    };

    const rejectAdjustment = (id: string) => {
        const request = pendingAdjustments.find(a => a.id === id);
        if (request) {
            setPendingAdjustments(prev => prev.filter(p => p.id !== id));
            addNotification("Request Rejected", `Adjustment for ${request.itemName} was rejected.`, 'ERROR', 'STOCK_KEEPER');
            toast.info("Request Rejected");
        }
    };

    const handleAddStock = (itemId: string, qty: number, location: string, cost: number, vendor?: string, batch?: string) => {
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const currentTotal = getTotalQty(item);
                const currentTotalValue = (currentTotal / item.conversionRatio) * item.purchasePrice;
                const addedPurchaseUnits = qty / item.conversionRatio;
                const newStockValue = addedPurchaseUnits * cost;
                const totalBaseQty = currentTotal + qty;
                const totalPurchaseUnits = totalBaseQty / item.conversionRatio;
                const newAvgCostPerPurchaseUnit = totalPurchaseUnits > 0 ? (currentTotalValue + newStockValue) / totalPurchaseUnits : cost;

                const updatedItem: InventoryItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        godown: item.stockLevels.godown + qty
                    },
                    purchasePrice: Math.round(newAvgCostPerPurchaseUnit),
                    lastMovedDate: new Date().toISOString(),
                    lastSupplier: vendor || item.lastSupplier,
                    location: location || item.location
                };

                const note = `Vendor: ${vendor || 'N/A'}, Batch: ${batch || 'N/A'}`;
                logMovement(updatedItem, 'INWARD', qty, location, note);
                return updatedItem;
            }
            return item;
        }));
        return { success: true };
    };

    const handleTransfer = (itemId: string, from: string, to: string, qty: number, notes?: string) => {
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const updated = {
                    ...item,
                    location: to,
                    lastMovedDate: new Date().toISOString()
                };
                logMovement(updated, 'TRANSFER', qty, `${from} -> ${to}`, notes);
                return updated;
            }
            return item;
        }));
        return { success: true };
    };

    const handleStockTransfer = (itemId: string, fromArg: LocationType, toArg: LocationType, qty: number) => {
        let success = false;
        let currentItem: InventoryItem | undefined;
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const fromKey = fromArg.toLowerCase() as 'godown' | 'shop';
                const toKey = toArg.toLowerCase() as 'godown' | 'shop';

                if (item.stockLevels[fromKey] < qty) {
                    toast.error(`Insufficient stock in ${fromArg}`);
                    return item;
                }

                success = true;
                currentItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        [fromKey]: item.stockLevels[fromKey] - qty,
                        [toKey]: item.stockLevels[toKey] + qty
                    },
                    lastMovedDate: new Date().toISOString()
                };
                return currentItem;
            }
            return item;
        }));

        if (success && currentItem) {
            const tx: StockTransaction = {
                id: `TX-${Date.now()}`,
                itemId,
                type: 'TRANSFER',
                quantity: qty,
                location: toArg,
                date: new Date().toISOString(),
                performedBy: 'Stock Keeper',
                reason: `Shifted: ${fromArg} -> ${toArg}`
            };
            setTransactions(p => [tx, ...p]);
            logMovement(currentItem, 'TRANSFER', qty, `${fromArg} -> ${toArg}`, `Internal transfer from ${fromArg} to ${toArg}`);
        }
        return { success };
    };

    const handleAdjustment = (itemId: string, location: string, type: 'ADD' | 'REMOVE', qty: number, reason: string, targetLoc: LocationType = 'GODOWN') => {
        let currentItem: InventoryItem | undefined;
        let adjustmentSuccess = false;

        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const locKey = targetLoc.toLowerCase() as 'godown' | 'shop';
                const newQty = (type === 'ADD')
                    ? item.stockLevels[locKey] + qty
                    : item.stockLevels[locKey] - qty;

                if (newQty < 0) {
                    toast.error("Adjusted quantity cannot be negative");
                    return item;
                }
                adjustmentSuccess = true;
                currentItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        [locKey]: newQty
                    },
                    lastMovedDate: new Date().toISOString()
                };
                return currentItem;
            }
            return item;
        }));

        if (adjustmentSuccess && currentItem) {
            const movementType = type === 'ADD' ? 'INWARD' : 'DAMAGE_LOSS';
            logMovement(currentItem, movementType, qty, targetLoc, `Adjustment: ${reason} (${type} ${qty} in ${targetLoc})`);

            if (type === 'REMOVE') {
                const cost = (qty / currentItem.conversionRatio) * currentItem.purchasePrice;
                const report: ScrapReport = {
                    id: `SCRAP-${Date.now()}`,
                    itemId: itemId,
                    quantity: qty,
                    reason: 'OTHER',
                    costOfWaste: cost,
                    reportedBy: 'Stock Keeper',
                    date: new Date().toISOString().split('T')[0]
                };
                if (['PRODUCTION_ERROR', 'MATERIAL_DEFECT', 'EXPIRED', 'MOUNTING_BREAKAGE'].includes(reason)) {
                    report.reason = reason as any;
                }
                setScrapReports(prev => [report, ...prev]);
            }
        }
        return { success: adjustmentSuccess };
    };

    const handleBulkImport = (items: any[]) => {
        const newInventoryItems: InventoryItem[] = items.map((raw, idx) => ({
            id: `IMP-${Date.now()}-${idx}`,
            name: raw.name,
            category: raw.category || 'PAPER',
            stockLevels: {
                godown: raw.quantity || 0,
                shop: 0
            },
            baseUnit: raw.baseUnit || 'Sheet',
            purchaseUnit: raw.purchaseUnit || 'Ream',
            conversionRatio: raw.conversionRatio || 1,
            minLevel: raw.minLevel || 0,
            location: raw.location || 'Godown',
            lastSupplier: raw.supplier || '',
            lastMovedDate: new Date().toISOString(),
            deadStockDuration: 90,
            purchasePrice: raw.purchasePrice || 0
        }));

        setInventory(prev => [...prev, ...newInventoryItems]);
        newInventoryItems.forEach(item => {
            logMovement(item, 'INWARD', item.stockLevels.godown, item.location, 'Bulk Import');
        });
        toast.info("Bulk import processed");
        return { success: true };
    };

    const handleReceiveGoods = (itemId: string, qty: number, supplier: string, invoiceNo: string, cost: number, targetLoc: LocationType = 'GODOWN') => {
        let updatedItem: InventoryItem | undefined;
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const currentTotal = getTotalQty(item);
                const currentTotalValue = (currentTotal / item.conversionRatio) * item.purchasePrice;
                const addedPurchaseUnits = qty / item.conversionRatio;
                const newStockValue = addedPurchaseUnits * cost;
                const totalBaseQty = currentTotal + qty;
                const totalPurchaseUnits = totalBaseQty > 0 ? totalBaseQty / item.conversionRatio : 1;
                const newAvgCost = totalPurchaseUnits > 0 ? (currentTotalValue + newStockValue) / totalPurchaseUnits : cost;
                const locKey = targetLoc.toLowerCase() as 'godown' | 'shop';

                updatedItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        [locKey]: item.stockLevels[locKey] + qty
                    },
                    lastSupplier: supplier,
                    purchasePrice: Math.round(newAvgCost),
                    lastCost: cost,
                    lastMovedDate: new Date().toISOString()
                };
                return updatedItem;
            }
            return item;
        }));

        if (updatedItem) {
            const transaction: StockTransaction = {
                id: `TX-${Date.now()}`,
                itemId,
                type: 'INWARD',
                quantity: qty,
                location: targetLoc,
                date: new Date().toISOString(),
                refId: invoiceNo,
                cost: cost,
                performedBy: 'Stock Keeper'
            };
            setTransactions(prev => [transaction, ...prev]);
            logMovement(updatedItem, 'INWARD', qty, targetLoc, `Invoice: ${invoiceNo}`);
        }
        return { success: true };
    };

    const handleIssueMaterial = (itemId: string, qty: number, to: string, type: 'PRODUCTION' | 'WASTAGE', reason?: string, sourceLoc: LocationType = 'SHOP') => {
        let success = false;
        let currentItem: InventoryItem | undefined;
        const locKey = sourceLoc.toLowerCase() as 'godown' | 'shop';

        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                if (item.stockLevels[locKey] < qty) {
                    toast.error(`Insufficient stock in ${sourceLoc}! Available: ${item.stockLevels[locKey]}`);
                    return item;
                }
                currentItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        [locKey]: item.stockLevels[locKey] - qty
                    },
                    lastMovedDate: new Date().toISOString()
                };
                success = true;
                return currentItem;
            }
            return item;
        }));

        if (success && currentItem) {
            const transaction: StockTransaction = {
                id: `TX-${Date.now()}`,
                itemId,
                type: 'ISSUE',
                quantity: qty,
                location: sourceLoc,
                date: new Date().toISOString(),
                refId: to,
                reason: type === 'WASTAGE' ? reason : undefined,
                performedBy: 'Stock Keeper'
            };
            setTransactions(prev => [transaction, ...prev]);
            logMovement(currentItem, type === 'WASTAGE' ? 'DAMAGE_LOSS' : 'OUTWARD', qty, to, reason || `To: ${to} (from ${sourceLoc})`);
        }
        return { success };
    };

    const handleReturnMaterial = (itemId: string, qty: number, from: string, targetLoc: LocationType = 'GODOWN') => {
        let currentItem: InventoryItem | undefined;
        const locKey = targetLoc.toLowerCase() as 'godown' | 'shop';

        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                currentItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        [locKey]: item.stockLevels[locKey] + qty
                    },
                    lastMovedDate: new Date().toISOString()
                };
                return currentItem;
            }
            return item;
        }));

        if (currentItem) {
            const transaction: StockTransaction = {
                id: `TX-${Date.now()}`,
                itemId,
                type: 'RETURN',
                quantity: qty,
                location: targetLoc,
                date: new Date().toISOString(),
                refId: from,
                performedBy: 'Stock Keeper'
            };
            setTransactions(prev => [transaction, ...prev]);
            logMovement(currentItem, 'INWARD', qty, targetLoc, `Return from ${from}`);
        }
        return { success: true };
    };

    const handleSwap = (itemId: string, qty: number) => {
        toast.error("Exchange feature deprecated.");
        return { success: false };
    };

    const handleAuditLog = (audit: StockAudit) => {
        setAuditLogs(prev => [audit, ...prev]);
    };

    return (
        <InventoryContext.Provider value={{
            inventory, movements, transactions, auditLogs, scrapReports, purchaseRequests, setPurchaseRequests,
            suppliers, addSupplier, updateSupplier, deleteSupplier,
            pendingAdjustments, notifications, requestAdjustment, approveAdjustment, rejectAdjustment,
            addNotification, markNotificationRead, clearNotifications,
            handleAddStock, handleTransfer, handleStockTransfer, handleAdjustment, handleBulkImport, handleSwap, handleAuditLog,
            handleReceiveGoods, handleIssueMaterial, handleReturnMaterial
        }}>
            {children}
        </InventoryContext.Provider>
    );
}

export const useInventoryContext = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventoryContext must be used within an InventoryProvider");
    }
    return context;
};
