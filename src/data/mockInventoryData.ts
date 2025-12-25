export type LocationType = 'GODOWN' | 'SHOP';

export interface InventoryItem {
    id: string;
    name: string;
    category: 'PAPER' | 'INK' | 'HARDWARE' | 'SPARES';
    stockLevels: {
        godown: number;
        shop: number;
    };
    baseUnit: 'Sheet' | 'ML' | 'Gram' | 'Nos' | 'Meter'; // Consumption Unit
    purchaseUnit: 'Ream' | 'Bottle' | 'Kg' | 'Pkt' | 'Roll' | 'Box' | 'Nos'; // Buying Unit
    conversionRatio: number; // How many Base Units in 1 Purchase Unit
    unitType?: 'Sheet' | 'Ream' | 'Pkt' | 'Ltr' | 'Nos'; // For UI consistency
    minLevel: number; // In Base Units
    location: string; // e.g., "Shelf A2" (Keep for Main text, or maybe detailed)
    binLocation?: string;
    lastSupplier?: string;
    lastSupplierId?: string;
    lastMovedDate: string;
    deadStockDuration: number;
    purchasePrice: number; // Cost per PURCHASE Unit
    lastCost?: number; // Last Inward Cost
    sellingPrice?: number;
}

export interface StockTransaction {
    id: string;
    itemId: string;
    itemName?: string; // Optional redundancy
    type: 'INWARD' | 'ISSUE' | 'RETURN' | 'ADJUSTMENT' | 'TRANSFER'; // Added TRANSFER
    quantity: number;
    location?: LocationType; // New: Context of transaction
    date: string;
    refId?: string; // Invoice No or Job ID
    cost?: number; // For Inward
    reason?: string; // For Wastage/Adjustment
    performedBy: string;
}

export interface PurchaseRequest {
    id: string;
    itemId: string;
    itemName: string;
    currentStock: number;
    requestedQty: number;
    status: 'PENDING' | 'ORDERED' | 'RECEIVED';
    supplier: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    date: string;
}

export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [
    {
        id: "PR-001",
        itemId: "INV-002",
        itemName: "Eco-Solvent Ink (Cyan)",
        currentStock: 5,
        requestedQty: 20,
        status: 'PENDING',
        supplier: "Techno Colors",
        urgency: 'HIGH',
        date: "2025-12-24"
    }
];

export interface ScrapReport {
    id: string;
    itemId: string;
    quantity: number; // In Base Units
    reason: 'PRODUCTION_ERROR' | 'MATERIAL_DEFECT' | 'EXPIRED' | 'MOUNTING_BREAKAGE' | 'OTHER';
    costOfWaste: number; // Calculated
    reportedBy: string;
    date: string;
}

export interface StockAudit {
    id: string;
    date: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    itemsToCheck: string[]; // List of Item IDs
    findings: {
        itemId: string;
        systemQty: number;
        physicalQty: number;
        variance: number;
    }[];
}

export const MOCK_SCRAP_REPORTS: ScrapReport[] = [
    {
        id: "SCRAP-001",
        itemId: "ITEM-003", // Yellow Ink
        quantity: 50, // ml
        reason: "EXPIRED",
        costOfWaste: 120,
        reportedBy: "Saju",
        date: "2024-01-15"
    }
];

export const MOCK_AUDIT_LOGS: StockAudit[] = [
    {
        id: "AUDIT-2024-01-01",
        date: "2024-01-01",
        status: "COMPLETED",
        itemsToCheck: ["ITEM-001", "ITEM-002"],
        findings: [
            { itemId: "ITEM-001", systemQty: 5000, physicalQty: 4980, variance: -20 },
            { itemId: "ITEM-002", systemQty: 10, physicalQty: 10, variance: 0 }
        ]
    }
];

export type StockMovementType = 'INWARD' | 'TRANSFER' | 'DAMAGE_LOSS' | 'OUTWARD' | 'AUDIT_ADJUSTMENT';

export interface StockMovement {
    id: string;
    itemId: string;
    itemName: string; // Denormalized for simpler display
    type: StockMovementType;
    quantity: number; // In Base Units
    location: string; // Updated to generic string
    date: string;
    performedBy: string;
    notes?: string;
}

export const MOCK_INVENTORY: InventoryItem[] = [
    {
        id: "INV-001",
        name: "A4 Bond Paper (80gsm)",
        category: "PAPER",
        stockLevels: { godown: 270000, shop: 2500 }, // Bulk in godown, some in shop
        baseUnit: 'Sheet',
        purchaseUnit: 'Ream',
        conversionRatio: 500,
        minLevel: 25000, // 50 Reams
        location: "Shop Floor",
        binLocation: "Rack A-1",
        lastSupplier: "Paper Mart Ltd",
        lastMovedDate: "2025-12-20",
        deadStockDuration: 30,
        purchasePrice: 180, // Price per Ream
        sellingPrice: 240
    },
    {
        id: "INV-002",
        name: "Eco-Solvent Ink (Cyan)",
        category: "INK",
        stockLevels: { godown: 35000, shop: 2000 },
        baseUnit: 'ML',
        purchaseUnit: 'Bottle', // Bottle = 1 Liter
        conversionRatio: 1000,
        minLevel: 5000, // 5 Liters
        location: "Godown",
        binLocation: "Cabinet C-3",
        lastSupplier: "Techno Colors",
        lastMovedDate: "2025-12-15",
        deadStockDuration: 60,
        purchasePrice: 1100, // Per Bottle
        sellingPrice: 1500
    },
    {
        id: "INV-003",
        name: "Matte Vinyl Roll (3ft)",
        category: "HARDWARE",
        // Actually for Vinyl, usually bought in Rolls (50m).
        baseUnit: 'Meter',
        purchaseUnit: 'Roll',
        conversionRatio: 50, // 1 Roll = 50 Meters
        stockLevels: { godown: 2500, shop: 100 },
        minLevel: 150, // 3 Rolls
        location: "Rack R3",
        lastSupplier: "Flex World",
        lastMovedDate: "2025-12-18",
        deadStockDuration: 45,
        purchasePrice: 1800, // Per Roll
        sellingPrice: 2200
    },
    {
        id: "INV-004",
        name: "Premium Glossy Photo Paper",
        category: "PAPER",
        stockLevels: { godown: 5000, shop: 1000 },
        baseUnit: 'Sheet',
        purchaseUnit: 'Pkt',
        conversionRatio: 20,
        minLevel: 400, // 20 Pkts
        location: "Shelf B1",
        lastSupplier: "Kodak Dealers",
        lastMovedDate: "2025-10-01",
        deadStockDuration: 60,
        purchasePrice: 320, // Per Pkt
        sellingPrice: 450
    },
    {
        id: "INV-005",
        name: "Receipt Books (Duplicate)",
        category: "SPARES",
        stockLevels: { godown: 50, shop: 58 },
        baseUnit: 'Nos',
        purchaseUnit: 'Nos', // Maybe bought in boxes of 10? Or just Nos. Let's say Nos.
        conversionRatio: 1,
        minLevel: 10,
        location: "Drawer D1",
        lastSupplier: "Local Stationers",
        lastMovedDate: "2025-12-05",
        deadStockDuration: 90,
        purchasePrice: 55,
        sellingPrice: 85
    },
    {
        id: "INV-006",
        name: "Legacy Printer Cables",
        category: "HARDWARE",
        stockLevels: { godown: 48, shop: 2 },
        baseUnit: 'Nos',
        purchaseUnit: 'Nos',
        conversionRatio: 1,
        minLevel: 2,
        location: "Bin X9",
        lastSupplier: "Tech Fix",
        lastMovedDate: "2024-06-15",
        deadStockDuration: 180,
        purchasePrice: 80,
        sellingPrice: 120
    },
    {
        id: "INV-007",
        name: "Shiny Printer S-842 (Self-Inking)",
        category: "SPARES",
        stockLevels: { godown: 100, shop: 20 },
        baseUnit: 'Nos',
        purchaseUnit: 'Nos', // Box of 10
        conversionRatio: 1,
        minLevel: 10, // 1 Box
        location: "Shelf S1",
        lastSupplier: "Stamp Makers Inc",
        lastMovedDate: "2025-12-24",
        deadStockDuration: 365,
        purchasePrice: 200, // Price per Box (200*10)
        sellingPrice: 450
    },
    {
        id: "INV-008",
        name: "Wooden Handle (2 inch)",
        category: "SPARES",
        stockLevels: { godown: 150, shop: 50 },
        baseUnit: 'Nos',
        purchaseUnit: 'Nos', // Bag of 50
        conversionRatio: 1, // Let's keep it simple for this one, or maybe Bag of 100.
        // If conversion is 1, Purchase Price is per Unit.
        minLevel: 20,
        location: "Box Z1",
        lastSupplier: "Carpentry Works",
        lastMovedDate: "2025-12-20",
        deadStockDuration: 365,
        purchasePrice: 20,
        sellingPrice: 50
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
