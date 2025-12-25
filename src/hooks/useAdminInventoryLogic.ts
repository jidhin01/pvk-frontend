import { useInventoryContext } from "@/contexts/InventoryContext";
import { useMemo } from "react";

export function useAdminInventoryLogic() {
    const context = useInventoryContext();
    const { inventory, purchaseRequests } = context;

    const stats = useMemo(() => {
        let totalValue = 0;
        let godownValue = 0;
        let shopValue = 0;
        let deadStockValue = 0;
        let lowStockCount = 0;

        inventory.forEach(item => {
            const godownQty = item.stockLevels.godown;
            const shopQty = item.stockLevels.shop;
            const totalQty = godownQty + shopQty;

            // Value = (Qty / Conversion) * PurchasePrice
            // PurchasePrice is per PurchaseUnit (e.g. Ream). BaseUnit is Sheet.
            // Conversion is Sheets per Ream.
            const itemValue = (totalQty / item.conversionRatio) * item.purchasePrice;
            totalValue += itemValue;

            godownValue += (godownQty / item.conversionRatio) * item.purchasePrice;
            shopValue += (shopQty / item.conversionRatio) * item.purchasePrice;

            if (totalQty < item.minLevel) {
                lowStockCount++;
            }

            // Dead Stock Check
            const lastMoved = new Date(item.lastMovedDate);
            const today = new Date();
            const days = Math.floor((today.getTime() - lastMoved.getTime()) / (1000 * 3600 * 24));
            if (days > item.deadStockDuration) {
                deadStockValue += itemValue;
            }
        });

        return {
            totalValue,
            godownValue,
            shopValue,
            deadStockValue,
            lowStockCount
        };
    }, [inventory]);

    const pendingApprovals = useMemo(() => {
        return purchaseRequests.filter(req => req.status === 'PENDING').length;
    }, [purchaseRequests]);

    const categorySplit = useMemo(() => {
        const split: Record<string, number> = {};
        inventory.forEach(item => {
            const godownQty = item.stockLevels.godown;
            const shopQty = item.stockLevels.shop;
            const itemValue = ((godownQty + shopQty) / item.conversionRatio) * item.purchasePrice;

            if (!split[item.category]) split[item.category] = 0;
            split[item.category] += itemValue;
        });
        return Object.entries(split).map(([name, value]) => ({ name, value }));
    }, [inventory]);

    return {
        ...context,
        ...stats,
        pendingApprovals,
        categorySplit
    };
}
