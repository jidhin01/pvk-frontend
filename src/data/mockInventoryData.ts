export interface InventoryItem {
    id: string;
    name: string;
    category: 'Paper' | 'Ink' | 'Vinyl' | 'Stationery' | 'Electronics';
    shopQty: number;   // Location 1 (Retail)
    godownQty: number; // Location 2 (Warehouse)
    minStockLimit: number; // Low stock threshold for Shop
    lastMovedDate: string; // ISO Date
    deadStockDuration: number; // Days allowed before it becomes "Dead"
    unit: string;
    purchasePrice: number; // Cost tracking
    sellingPrice?: number;
}

export type StockMovementType = 'INWARD' | 'TRANSFER' | 'DAMAGE_LOSS' | 'OUTWARD';

export interface StockMovement {
    id: string;
    itemId: string;
    itemName: string; // Denormalized for simpler display
    type: StockMovementType;
    quantity: number;
    location: 'Shop' | 'Godown' | 'Shop -> Godown' | 'Godown -> Shop';
    date: string;
    performedBy: string;
    notes?: string;
}

export const MOCK_INVENTORY: InventoryItem[] = [
    {
        id: "INV-001",
        name: "A4 Bond Paper (80gsm)",
        category: "Paper",
        shopQty: 45,
        godownQty: 500,
        minStockLimit: 50, // Alert: Low in Shop
        // Last moved: Very recently (Active)
        lastMovedDate: "2025-12-20",
        deadStockDuration: 30,
        unit: "Reams",
        purchasePrice: 180,
        sellingPrice: 240
    },
    {
        id: "INV-002",
        name: "Eco-Solvent Ink (Cyan)",
        category: "Ink",
        shopQty: 12,
        godownQty: 25,
        minStockLimit: 5,
        // Last moved: Recently (Active)
        lastMovedDate: "2025-12-15",
        deadStockDuration: 60,
        unit: "Liters",
        purchasePrice: 1100,
        sellingPrice: 1500
    },
    {
        id: "INV-003",
        name: "Matte Vinyl Roll (3ft)",
        category: "Vinyl",
        shopQty: 2,
        godownQty: 50,
        minStockLimit: 3, // Alert
        // Last moved: Recently (Active)
        lastMovedDate: "2025-12-18",
        deadStockDuration: 45,
        unit: "Rolls",
        purchasePrice: 1800,
        sellingPrice: 2200
    },
    {
        id: "INV-004",
        name: "Premium Glossy Photo Paper",
        category: "Paper",
        shopQty: 100,
        godownQty: 200,
        minStockLimit: 20,
        // Last moved: > 60 days ago (DEAD STOCK CANDIDATE, last moved in Oct 2025)
        lastMovedDate: "2025-10-01",
        deadStockDuration: 60,
        unit: "Pack",
        purchasePrice: 320,
        sellingPrice: 450
    },
    {
        id: "INV-005",
        name: "Receipt Books (Duplicate)",
        category: "Stationery",
        shopQty: 8,
        godownQty: 100,
        minStockLimit: 10, // Alert
        // Last moved: Recently
        lastMovedDate: "2025-12-05",
        deadStockDuration: 90,
        unit: "Books",
        purchasePrice: 55,
        sellingPrice: 85
    },
    {
        id: "INV-006",
        name: "Legacy Printer Cables",
        category: "Electronics",
        shopQty: 5,
        godownQty: 45,
        minStockLimit: 2,
        // Last moved: Very Old (> 180 days ago, last moved in early 2024)
        lastMovedDate: "2024-06-15",
        deadStockDuration: 180, // Dead Stock
        unit: "Pieces",
        purchasePrice: 80,
        sellingPrice: 120
    }
];

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
    {
        id: "MOV-001",
        itemId: "INV-001",
        itemName: "A4 Bond Paper (80gsm)",
        type: "INWARD",
        quantity: 50,
        location: "Godown",
        date: "2025-12-20T09:00:00Z",
        performedBy: "Stock Keeper",
        notes: "Vendor: Paper Grid Ltd."
    },
    {
        id: "MOV-002",
        itemId: "INV-002",
        itemName: "Eco-Solvent Ink (Cyan)",
        type: "TRANSFER",
        quantity: 5,
        location: "Godown -> Shop",
        date: "2025-12-15T14:30:00Z",
        performedBy: "Stock Keeper"
    },
    {
        id: "MOV-003",
        itemId: "INV-003",
        itemName: "Matte Vinyl Roll (3ft)",
        type: "TRANSFER",
        quantity: 2,
        location: "Godown -> Shop",
        date: "2025-12-18T15:00:00Z",
        performedBy: "Stock Keeper",
        notes: "Urgent request from Sales"
    },
    {
        id: "MOV-004",
        itemId: "INV-004",
        itemName: "Premium Glossy Photo Paper",
        type: "DAMAGE_LOSS",
        quantity: 2,
        location: "Shop",
        date: "2025-10-01T11:00:00Z",
        performedBy: "Stock Keeper",
        notes: "Water damage during cleaning"
    },
    {
        id: "MOV-005",
        itemId: "INV-005",
        itemName: "Receipt Books (Duplicate)",
        type: "INWARD",
        quantity: 100,
        location: "Godown",
        date: "2025-12-05T10:00:00Z",
        performedBy: "Stock Keeper"
    }
];
