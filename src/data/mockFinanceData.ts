export interface DesignerStat {
    id: string;
    name: string;
    completedDesigns: number;
    mistakes: number;
    baseRate: number; // 5
    penaltyRate: number; // 50
    totalEarnings: number;
}

export interface CollectionLog {
    id: string;
    staffName: string;
    date: string;
    totalCollected: number;
    cashHandover: number;
    expensesDeducted: number; // Salary/Fuel taken from cash
    incentiveAmount: number;
    status: 'Pending' | 'Verified' | 'Discrepancy';
}

export interface ExpenseEntry {
    id: string;
    category: 'Rent' | 'Electricity' | 'Machine Maintenance' | 'Raw Materials' | 'Tea/Snacks' | 'Salary' | 'Other';
    amount: number;
    date: string;
    description: string;
    paidBy: string; // e.g., "Cash Box", "Bank Transfer"
}

export interface SalesRecord {
    id: string;
    orderId: string;
    amount: number; // Total amount including GST if applicable
    type: 'B2B_GST' | 'B2C_RETAIL';
    date: string;
    gstAmount?: number; // Only for B2B
}

export const MOCK_DESIGNER_STATS: DesignerStat[] = [
    { id: 'DES-001', name: 'Rahul (Designer)', completedDesigns: 120, mistakes: 2, baseRate: 5, penaltyRate: 50, totalEarnings: 0 },
    { id: 'DES-002', name: 'Priya (Designer)', completedDesigns: 145, mistakes: 0, baseRate: 5, penaltyRate: 50, totalEarnings: 0 },
    { id: 'DES-003', name: 'Amit (Senior)', completedDesigns: 200, mistakes: 1, baseRate: 8, penaltyRate: 50, totalEarnings: 0 },
];

// Helper to calc earnings: (Completed * Rate) - (Mistakes * Penalty)
MOCK_DESIGNER_STATS.forEach(s => {
    s.totalEarnings = Math.max(0, (s.completedDesigns * s.baseRate) - (s.mistakes * s.penaltyRate));
});

export const MOCK_EXPENSES: ExpenseEntry[] = [
    { id: 'EXP-001', category: 'Raw Materials', amount: 15000, date: '2025-12-20', description: 'Paper Stock Inward (Bulk)', paidBy: 'Bank Transfer' },
    { id: 'EXP-002', category: 'Tea/Snacks', amount: 450, date: '2025-12-21', description: 'Evening Snacks for Team', paidBy: 'Cash Box' },
    { id: 'EXP-003', category: 'Machine Maintenance', amount: 2000, date: '2025-12-18', description: 'Printer Head Cleaning Service', paidBy: 'Cash Box' },
    { id: 'EXP-004', category: 'Electricity', amount: 3500, date: '2025-12-05', description: 'November Bill', paidBy: 'Bank Transfer' },
    { id: 'EXP-005', category: 'Rent', amount: 12000, date: '2025-12-01', description: 'Shop Rent - Dec', paidBy: 'Bank Transfer' },
    { id: 'EXP-006', category: 'Raw Materials', amount: 5000, date: '2025-12-22', description: 'Ink Refill', paidBy: 'Cash Box' },
    { id: 'EXP-007', category: 'Salary', amount: 500, date: '2025-12-23', description: 'Daily Wage Advance', paidBy: 'Cash Box' },
];

export const MOCK_SALES_REVENUE: SalesRecord[] = [
    { id: 'SAL-001', orderId: 'ORD-1001', amount: 5900, type: 'B2B_GST', date: '2025-12-23', gstAmount: 900 }, // 5000 + 18%
    { id: 'SAL-002', orderId: 'ORD-1002', amount: 250, type: 'B2C_RETAIL', date: '2025-12-23' },
    { id: 'SAL-003', orderId: 'ORD-1003', amount: 11800, type: 'B2B_GST', date: '2025-12-22', gstAmount: 1800 },
    { id: 'SAL-004', orderId: 'ORD-1004', amount: 150, type: 'B2C_RETAIL', date: '2025-12-22' },
    { id: 'SAL-005', orderId: 'ORD-1005', amount: 800, type: 'B2C_RETAIL', date: '2025-12-21' },
];

export const MOCK_COLLECTIONS: CollectionLog[] = [
    { id: 'COL-001', staffName: 'Suresh (Delivery)', date: '2025-12-23', totalCollected: 4500, expensesDeducted: 500, cashHandover: 3900, incentiveAmount: 100, status: 'Verified' },
    { id: 'COL-002', staffName: 'Ramesh (Sales)', date: '2025-12-23', totalCollected: 2200, expensesDeducted: 0, cashHandover: 2150, incentiveAmount: 50, status: 'Pending' },
    { id: 'COL-003', staffName: 'Suresh (Delivery)', date: '2025-12-22', totalCollected: 3000, expensesDeducted: 200, cashHandover: 2800, incentiveAmount: 0, status: 'Verified' },
];

// Product Cost Analysis Data
export interface ProductCost {
    id: string;
    name: string;
    category: 'PVC Cards' | 'Printing' | 'PAN Cards' | 'Seals' | 'Design';
    purchaseCost: number;
    dealerPrice: number;
    customerPrice: number;
    stock: number;
    unit: string;
}

export const MOCK_PRODUCT_COSTS: ProductCost[] = [
    { id: 'PROD-001', name: 'Plain PVC Card (Golden)', category: 'PVC Cards', purchaseCost: 8, dealerPrice: 12, customerPrice: 18, stock: 450, unit: 'pc' },
    { id: 'PROD-002', name: 'Plain PVC Card (Silver)', category: 'PVC Cards', purchaseCost: 8, dealerPrice: 12, customerPrice: 18, stock: 380, unit: 'pc' },
    { id: 'PROD-003', name: 'PVC ID Card', category: 'PVC Cards', purchaseCost: 15, dealerPrice: 25, customerPrice: 35, stock: 200, unit: 'pc' },
    { id: 'PROD-004', name: 'A4 Photo Paper', category: 'Printing', purchaseCost: 3, dealerPrice: 8, customerPrice: 12, stock: 1200, unit: 'sheet' },
    { id: 'PROD-005', name: 'A3 Premium Paper', category: 'Printing', purchaseCost: 5, dealerPrice: 15, customerPrice: 25, stock: 600, unit: 'sheet' },
    { id: 'PROD-006', name: 'Visiting Card (1000 pcs)', category: 'Printing', purchaseCost: 250, dealerPrice: 450, customerPrice: 650, stock: 50, unit: 'box' },
    { id: 'PROD-007', name: 'PAN Card Application', category: 'PAN Cards', purchaseCost: 50, dealerPrice: 150, customerPrice: 250, stock: 999, unit: 'application' },
    { id: 'PROD-008', name: 'PAN Card (Emergency)', category: 'PAN Cards', purchaseCost: 100, dealerPrice: 400, customerPrice: 600, stock: 999, unit: 'application' },
    { id: 'PROD-009', name: 'Self-Ink Seal', category: 'Seals', purchaseCost: 80, dealerPrice: 180, customerPrice: 280, stock: 75, unit: 'pc' },
    { id: 'PROD-010', name: 'Normal Rubber Seal', category: 'Seals', purchaseCost: 40, dealerPrice: 100, customerPrice: 150, stock: 120, unit: 'pc' },
    { id: 'PROD-011', name: 'Design Service', category: 'Design', purchaseCost: 0, dealerPrice: 25, customerPrice: 50, stock: 999, unit: 'design' },
];

// Refund Data
export interface RefundEntry {
    id: string;
    dealer: string;
    orderId: string;
    amount: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Processed' | 'Rejected';
    date: string;
}

export const MOCK_REFUNDS: RefundEntry[] = [
    { id: 'REF-001', dealer: 'Kumar Cards', orderId: 'ORD-2345', amount: 1500, reason: 'Defective print', status: 'Pending', date: '2024-12-23' },
    { id: 'REF-002', dealer: 'Print Hub', orderId: 'ORD-2289', amount: 800, reason: 'Wrong design', status: 'Approved', date: '2024-12-22' },
    { id: 'REF-003', dealer: 'City Prints', orderId: 'ORD-2256', amount: 2500, reason: 'Order cancelled', status: 'Processed', date: '2024-12-21' },
    { id: 'REF-004', dealer: 'Nisha Graphics', orderId: 'ORD-2234', amount: 450, reason: 'Quantity mismatch', status: 'Rejected', date: '2024-12-20' },
    { id: 'REF-005', dealer: 'Rajan Traders', orderId: 'ORD-2198', amount: 3200, reason: 'Late delivery', status: 'Pending', date: '2024-12-23' },
];

// Credit and Cash Tracking Data
export interface PaymentEntry {
    id: string;
    dealer: string;
    amount: number;
    method: 'Cash' | 'GPay' | 'Bank Transfer' | 'Credit';
    status: 'Pending' | 'Received' | 'Overdue';
    date?: string;
    dueDate?: string;
}

export const MOCK_PAYMENTS: PaymentEntry[] = [
    { id: 'PAY-001', dealer: 'Rajan Traders', amount: 15000, method: 'Credit', status: 'Pending', dueDate: '2024-12-28' },
    { id: 'PAY-002', dealer: 'Kumar Cards', amount: 8500, method: 'Cash', status: 'Received', date: '2024-12-23' },
    { id: 'PAY-003', dealer: 'Nisha Graphics', amount: 12000, method: 'GPay', status: 'Received', date: '2024-12-23' },
    { id: 'PAY-004', dealer: 'City Prints', amount: 25000, method: 'Bank Transfer', status: 'Received', date: '2024-12-22' },
    { id: 'PAY-005', dealer: 'Print Hub', amount: 9500, method: 'Credit', status: 'Overdue', dueDate: '2024-12-20' },
    { id: 'PAY-006', dealer: 'Digital Zone', amount: 7200, method: 'Cash', status: 'Received', date: '2024-12-22' },
];
