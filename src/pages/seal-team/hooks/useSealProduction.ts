import { useState } from 'react';
import { MOCK_SEAL_ORDERS, SealOrder } from '@/data/mockSealData';
import { MOCK_INVENTORY, InventoryItem } from '@/data/mockInventoryData';
import { toast } from 'sonner';

export const useSealProduction = () => {
    const [orders, setOrders] = useState<SealOrder[]>(MOCK_SEAL_ORDERS);
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);

    // --- Inventory Helpers ---
    const getInventoryItem = (machineModel: string | undefined, type: SealOrder['type']) => {
        if (type === 'SELF_INK' && machineModel) {
            // Try exact match first, then partial match on the Model Number (e.g. S-842)
            const exact = inventory.find(i => i.name.includes(machineModel));
            if (exact) return exact;

            // Extract model number (e.g. S-842 from "Shiny S-842")
            const parts = machineModel.split(' ');
            const modelNum = parts.find(p => p.includes('-'));
            if (modelNum) {
                return inventory.find(i => i.name.includes(modelNum));
            }
            return null;
        } else if (type === 'WOODEN') {
            return inventory.find(i => i.name.includes('Wooden Handle'));
        } else if (type === 'POCKET') {
            // Assuming pockets also need stock, matching by name or falling back (generic)
            return inventory.find(i => i.name.includes('Pocket') || (machineModel && i.name.includes(machineModel)));
        }
        return null;
    };

    const checkStock = (order: SealOrder): { hasStock: boolean; item: InventoryItem | null; qty: number } => {
        const item = getInventoryItem(order.machineModel, order.type);
        if (!item) return { hasStock: true, item: null, qty: 999 }; // No tracked item implied
        return { hasStock: item.shopQty > 0, item, qty: item.shopQty };
    };

    const deductStock = (order: SealOrder) => {
        const item = getInventoryItem(order.machineModel, order.type);
        if (item) {
            setInventory(prev => prev.map(inv =>
                inv.id === item.id
                    ? { ...inv, shopQty: Math.max(0, inv.shopQty - 1) }
                    : inv
            ));
            return item.name;
        }
        return null;
    };

    // --- Order Actions ---

    const updateStatus = (orderId: string, newStatus: SealOrder['status']) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));

        // Stock Deduction Logic on Completion
        if (newStatus === 'completed') {
            const order = orders.find(o => o.id === orderId);
            if (order) {
                const deductedItemName = deductStock(order);
                if (deductedItemName) {
                    toast.success(`Stock Updated: -1 ${deductedItemName}`);
                }
            }
        }
    };

    const createBatch = (batchOrders: SealOrder[]) => {
        // Move all to 'exposure_done' (simulating printing and exposure)
        const ids = new Set(batchOrders.map(o => o.id));
        setOrders(prev => prev.map(o =>
            ids.has(o.id) ? { ...o, status: 'exposure_done' } : o
        ));
        toast.success(`Batch Created with ${batchOrders.length} orders`, {
            description: "Orders moved to Assembly Station"
        });
    };

    return {
        orders,
        inventory, // exposed for debug/UI if needed
        getPendingBatchInfo: () => orders.filter(o => o.status === 'pending_batch'),
        getAssemblyQueue: () => orders.filter(o => ['exposure_done', 'mounting'].includes(o.status)),
        getCompleted: () => orders.filter(o => o.status === 'completed'),
        updateStatus,
        createBatch,
        checkStock
    };
};
