
export interface SealOrder {
    id: string;
    content: string; // e.g., "Director, PVK Ent"
    type: 'WOODEN' | 'SELF_INK' | 'POCKET';
    machineModel?: string; // e.g., "Shiny S-842" (Only for Self-Ink)
    size: string; // "2x1 inch"
    status: 'pending_batch' | 'exposure_done' | 'mounting' | 'completed';
    isUrgent: boolean;
    orderDate: string;
}

export const MOCK_SEAL_ORDERS: SealOrder[] = [
    {
        id: 'SEAL-001',
        content: 'For PVK Enterprises, Partner',
        type: 'SELF_INK',
        machineModel: 'Shiny S-842',
        size: '38x14 mm',
        status: 'pending_batch',
        isUrgent: true,
        orderDate: '2025-12-24T10:00:00'
    },
    {
        id: 'SEAL-002',
        content: 'Round Seal: Govt. High School',
        type: 'WOODEN',
        size: '2 inch Round',
        status: 'pending_batch',
        isUrgent: false,
        orderDate: '2025-12-24T10:15:00'
    },
    {
        id: 'SEAL-003',
        content: 'Dr. Ananya Sharma, MBBS',
        type: 'POCKET',
        machineModel: 'Colop Pocket 20',
        size: '38x14 mm',
        status: 'exposure_done',
        isUrgent: false,
        orderDate: '2025-12-23T16:00:00'
    },
    {
        id: 'SEAL-004',
        content: 'PAID & CANCELLED',
        type: 'SELF_INK',
        machineModel: 'Shiny S-843',
        size: '47x18 mm',
        status: 'mounting',
        isUrgent: false,
        orderDate: '2025-12-23T14:30:00'
    },
    {
        id: 'SEAL-005',
        content: 'Checked by Officer',
        type: 'WOODEN',
        size: '2x1 inch',
        status: 'pending_batch',
        isUrgent: false,
        orderDate: '2025-12-24T10:45:00'
    },
    {
        id: 'SEAL-006',
        content: 'True Copy Attested',
        type: 'SELF_INK',
        machineModel: 'Shiny S-844',
        size: '58x22 mm',
        status: 'completed',
        isUrgent: true,
        orderDate: '2025-12-22T09:00:00'
    }
];
