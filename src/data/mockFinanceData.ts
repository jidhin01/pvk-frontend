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
