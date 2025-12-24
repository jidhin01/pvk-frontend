import { useState } from 'react';
import { InventoryItem, StockMovement, MOCK_INVENTORY, MOCK_STOCK_MOVEMENTS } from '@/data/mockInventoryData';
import { toast } from 'sonner';

export interface StockOperationResult {
    success: boolean;
    message?: string;
}

export function useInventoryLogic() {
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [movements, setMovements] = useState<StockMovement[]>(MOCK_STOCK_MOVEMENTS);

    const logMovement = (
        item: InventoryItem,
        type: StockMovement['type'],
        qty: number,
        location: StockMovement['location'],
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

    const handleAddStock = (itemId: string, qty: number, location: 'shop' | 'godown', cost: number, vendor?: string, batch?: string) => {
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                // Weighted Average Cost Logic (Simplified)
                const currentTotalValue = (item.shopQty + item.godownQty) * item.purchasePrice;
                const newStockValue = qty * cost;
                const totalQty = item.shopQty + item.godownQty + qty;
                const newAvgCost = totalQty > 0 ? (currentTotalValue + newStockValue) / totalQty : cost;

                const updatedItem = {
                    ...item,
                    shopQty: location === 'shop' ? item.shopQty + qty : item.shopQty,
                    godownQty: location === 'godown' ? item.godownQty + qty : item.godownQty,
                    purchasePrice: Math.round(newAvgCost),
                    lastMovedDate: new Date().toISOString()
                };

                const locLabel = location === 'shop' ? 'Shop' : 'Godown';
                const note = `Vendor: ${vendor || 'N/A'}, Batch: ${batch || 'N/A'}`;
                logMovement(updatedItem, 'INWARD', qty, locLabel as any, note);

                return updatedItem;
            }
            return item;
        }));
        return { success: true };
    };

    const handleTransfer = (itemId: string, from: 'shop' | 'godown', to: 'shop' | 'godown', qty: number, notes?: string) => {
        let error = '';
        setInventory(prev => {
            const item = prev.find(i => i.id === itemId);
            if (!item) return prev;

            const sourceQty = from === 'shop' ? item.shopQty : item.godownQty;
            if (sourceQty < qty) {
                error = `Insufficient stock in ${from}. Available: ${sourceQty}`;
                return prev;
            }

            return prev.map(i => {
                if (i.id === itemId) {
                    const updated = {
                        ...i,
                        shopQty: from === 'shop' ? i.shopQty - qty : i.shopQty + qty,
                        godownQty: from === 'godown' ? i.godownQty - qty : i.godownQty + qty,
                        lastMovedDate: new Date().toISOString()
                    };

                    const locLabel = `${from === 'shop' ? 'Shop' : 'Godown'} -> ${to === 'shop' ? 'Shop' : 'Godown'}`;
                    logMovement(updated, 'TRANSFER', qty, locLabel as any, notes);
                    return updated;
                }
                return i;
            });
        });

        if (error) {
            toast.error(error);
            return { success: false, message: error };
        }
        return { success: true };
    };

    const handleAdjustment = (itemId: string, location: 'shop' | 'godown', type: 'ADD' | 'REMOVE', qty: number, reason: string) => {
        setInventory(prev => prev.map(item => {
            if (item.id === itemId) {
                const isAdd = type === 'ADD';
                const updated = {
                    ...item,
                    shopQty: location === 'shop'
                        ? (isAdd ? item.shopQty + qty : Math.max(0, item.shopQty - qty))
                        : item.shopQty,
                    godownQty: location === 'godown'
                        ? (isAdd ? item.godownQty + qty : Math.max(0, item.godownQty - qty))
                        : item.godownQty,
                };

                const movementType = isAdd ? 'INWARD' : 'DAMAGE_LOSS';
                const locLabel = location === 'shop' ? 'Shop' : 'Godown';
                logMovement(updated, movementType, qty, locLabel as any, `Adjustment: ${reason}`);

                return updated;
            }
            return item;
        }));
        return { success: true };
    };

    const handleBulkImport = (newItems: any[]) => {
        // Logic to simulate merging items
        const newInventoryItems = newItems.map((raw, idx) => ({
            id: `IMP-${Date.now()}-${idx}`,
            name: raw.name,
            category: raw.category,
            shopQty: raw.shopQty || 0,
            godownQty: raw.godownQty || 0,
            minStockLimit: 10,
            lastMovedDate: new Date().toISOString(),
            deadStockDuration: 90,
            unit: 'Units',
            purchasePrice: raw.cost || 0
        } as InventoryItem));

        setInventory(prev => [...prev, ...newInventoryItems]);

        // Log bulk inward
        newInventoryItems.forEach(item => {
            logMovement(item, 'INWARD', item.shopQty + item.godownQty, 'Godown', 'Bulk Import');
        });

        return { success: true };
    };

    const handleSwap = (itemId: string, qty: number) => {
        // Swap logic: Dead Stock (Shop) -> Godown, Fresh Stock (Godown) -> Shop
        // Effectively 2 transfers.
        const res1 = handleTransfer(itemId, 'shop', 'godown', qty, 'Swap Out (Dead Stock)');
        if (!res1.success) return res1;

        const res2 = handleTransfer(itemId, 'godown', 'shop', qty, 'Swap In (Fresh Stock)');
        return res2;
    };

    return {
        inventory,
        movements,
        handleAddStock,
        handleTransfer,
        handleAdjustment,
        handleBulkImport,
        handleSwap
    };
}
