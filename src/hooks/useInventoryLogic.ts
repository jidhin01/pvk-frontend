import { useInventoryContext } from "@/contexts/InventoryContext";

export function useInventoryLogic() {
    return useInventoryContext();
}
