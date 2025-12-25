
import { useState } from 'react';
import { InventoryItem, StockMovement, PurchaseRequest, StockAudit, ScrapReport, StockTransaction, MOCK_INVENTORY, MOCK_STOCK_MOVEMENTS, MOCK_PURCHASE_REQUESTS, MOCK_AUDIT_LOGS, MOCK_SCRAP_REPORTS, LocationType } from '@/data/mockInventoryData';
import { toast } from 'sonner';

export interface StockOperationResult {
    success: boolean;
    message?: string;
}

export function useInventoryLogic() {
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [movements, setMovements] = useState<StockMovement[]>(MOCK_STOCK_MOVEMENTS);
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(MOCK_PURCHASE_REQUESTS);
    const [auditLogs, setAuditLogs] = useState<StockAudit[]>(MOCK_AUDIT_LOGS);
    const [scrapReports, setScrapReports] = useState<ScrapReport[]>(MOCK_SCRAP_REPORTS);


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

    const handleAddStock = (itemId: string, qty: number, location: string, cost: number, vendor?: string, batch?: string) => {
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const currentTotal = getTotalQty(item);
                const currentTotalValue = (currentTotal / item.conversionRatio) * item.purchasePrice;
                // purchasePrice is per Purchase Unit. 

                const addedPurchaseUnits = qty / item.conversionRatio;
                const newStockValue = addedPurchaseUnits * cost; // cost should be per Purchase Unit

                const totalBaseQty = currentTotal + qty;
                const totalPurchaseUnits = totalBaseQty / item.conversionRatio;

                const newAvgCostPerPurchaseUnit = totalPurchaseUnits > 0 ? (currentTotalValue + newStockValue) / totalPurchaseUnits : cost;

                const updatedItem: InventoryItem = {
                    ...item,
                    stockLevels: {
                        ...item.stockLevels,
                        godown: item.stockLevels.godown + qty // Legacy Add -> Godown
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

    // New: Internal Shifting
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
                location: toArg, // Context?
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

                // Determine which level to adjust. Default Godown if not specified.
                // We map 'location' string to LocationType if possible, else default Godown.
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

        // Logging...
        if (adjustmentSuccess && currentItem) {
            const movementType = type === 'ADD' ? 'INWARD' : 'DAMAGE_LOSS';
            logMovement(currentItem, movementType, qty, targetLoc, `Adjustment: ${reason} (${type} ${qty} in ${targetLoc})`);

            if (type === 'REMOVE') {
                const cost = (qty / currentItem.conversionRatio) * currentItem.purchasePrice;
                const report: ScrapReport = {
                    id: `SCRAP-${Date.now()}`,
                    itemId: itemId,
                    quantity: qty,
                    reason: 'OTHER', // Defaulting, ideally passed from modal
                    costOfWaste: cost,
                    reportedBy: 'Stock Keeper',
                    date: new Date().toISOString().split('T')[0]
                };
                // Mapp reason if it matches specific types or just keep string in note
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
                godown: raw.quantity || 0, // Assume bulk import goes to godown
                shop: 0
            },
            baseUnit: raw.baseUnit || 'Sheet',
            purchaseUnit: raw.purchaseUnit || 'Ream',
            conversionRatio: raw.conversionRatio || 1,
            minLevel: raw.minLevel || 0,
            location: raw.location || 'Godown', // Display field
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

                const currentTotalValue = (currentTotal / item.conversionRatio) * item.purchasePrice; // Approximate
                const addedPurchaseUnits = qty / item.conversionRatio;
                const newStockValue = addedPurchaseUnits * cost;

                const totalBaseQty = currentTotal + qty;
                const totalPurchaseUnits = totalBaseQty > 0 ? totalBaseQty / item.conversionRatio : 1;

                // only update average if we actually have stock
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

    return {
        inventory,
        movements,
        transactions,
        auditLogs,
        scrapReports,
        handleAddStock,
        handleTransfer,
        handleStockTransfer,
        handleAdjustment,
        handleBulkImport,
        handleSwap,
        handleAuditLog,
        // New
        handleReceiveGoods,
        handleIssueMaterial,
        handleReturnMaterial,
        purchaseRequests,
        setPurchaseRequests
    };
}
