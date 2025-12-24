
export type PrintTechnology = 'PVC' | 'DIGITAL' | 'OFFSET';
export type JobStatus = 'ready_for_print' | 'printing' | 'completed' | 'rejected';

export interface BaseJob {
    id: string;
    technology: PrintTechnology;
    status: JobStatus;
    jobName: string; // or Batch ID
    fileUrl: string;
    createdAt: string;
    notes?: string;
    rejectionReason?: string;
}

export interface PvcBatchJob extends BaseJob {
    technology: 'PVC';
    type: 'BATCH';
    capacity: string; // e.g. "10/10"
    sheetSize: 'A4';
    material: string;
    items: string[];
}

export interface DigitalJob extends BaseJob {
    technology: 'DIGITAL';
    type: 'SINGLE';
    paperType: string; // e.g., 'Matte 300gsm'
    quantity: number;
}

export interface OffsetJob extends BaseJob {
    technology: 'OFFSET';
    type: 'SINGLE';
    paperType: string; // e.g., '70gsm Maplitho'
    quantity: number;
    finishing: string[]; // e.g., ['Center Fold', 'Lamination']
    dueDate: string;
}

export type PrinterJob = PvcBatchJob | DigitalJob | OffsetJob;

// Log Entry Interface for History/Rejections
export interface LogEntry {
    id: string;
    jobName: string;
    type: PrintTechnology;
    timestamp: string; // ISO Date String ideally, or "2023-10-27 10:30 AM"
    status: 'completed' | 'rejected';
    material?: string;
    qty?: number | string; // Number for single, "10/10" for batch
    rejectionReason?: string;
    operator?: string;
}

export const MOCK_PRINTER_JOBS: PrinterJob[] = [
    // PVC Batches
    {
        id: 'B-505',
        technology: 'PVC',
        type: 'BATCH',
        jobName: 'Batch #505 - PAN Cards',
        status: 'ready_for_print',
        capacity: '10/10',
        sheetSize: 'A4',
        material: 'PVC Sheet',
        fileUrl: '#',
        createdAt: '2023-10-27 10:00 AM',
        items: ['PAN-101', 'PAN-102', 'PAN-103', 'PAN-104', 'PAN-105', 'PAN-106', 'PAN-107', 'PAN-108', 'PAN-109', 'PAN-110']
    },
    {
        id: 'B-506',
        technology: 'PVC',
        type: 'BATCH',
        jobName: 'Batch #506 - ID Cards',
        status: 'printing',
        capacity: '10/10',
        sheetSize: 'A4',
        material: 'Matte PVC',
        fileUrl: '#',
        createdAt: '2023-10-27 11:30 AM',
        items: ['ID-201', 'ID-202', 'ID-203', 'ID-204', 'ID-205', 'ID-206', 'ID-207', 'ID-208', 'ID-209', 'ID-210']
    },
    // Digital Jobs
    {
        id: 'J-101',
        technology: 'DIGITAL',
        type: 'SINGLE',
        jobName: 'StartUp Inc. Biz Cards',
        status: 'ready_for_print',
        paperType: 'Matte 300gsm',
        quantity: 100,
        fileUrl: '#',
        createdAt: '2023-10-27 09:00 AM'
    },
    {
        id: 'J-102',
        technology: 'DIGITAL',
        type: 'SINGLE',
        jobName: 'Urgent Flyers',
        status: 'ready_for_print',
        paperType: 'Glossy 170gsm',
        quantity: 50,
        fileUrl: '#',
        createdAt: '2023-10-27 12:45 PM'
    },
    // Offset Jobs
    {
        id: 'O-301',
        technology: 'OFFSET',
        type: 'SINGLE',
        jobName: 'Annual Sale Notices',
        status: 'ready_for_print',
        paperType: '70gsm Maplitho',
        quantity: 5000,
        finishing: ['Center Fold', 'Bundle Packing'],
        dueDate: '2023-11-01',
        fileUrl: '#',
        createdAt: '2023-10-25 10:00 AM'
    },
    {
        id: 'O-302',
        technology: 'OFFSET',
        type: 'SINGLE',
        jobName: 'Product Catalogs',
        status: 'printing',
        paperType: '90gsm Art Paper',
        quantity: 2000,
        finishing: ['Perfect Binding', 'Matte Lamination'],
        dueDate: '2023-10-31',
        fileUrl: '#',
        createdAt: '2023-10-26 02:00 PM'
    }
];

export const MOCK_HISTORY_LOGS: LogEntry[] = [
    {
        id: 'B-501',
        jobName: 'Batch #501 - PAN Cards',
        type: 'PVC',
        timestamp: '2023-10-27T09:15:00',
        status: 'completed',
        material: 'PVC Sheet',
        qty: '10/10'
    },
    {
        id: 'J-099',
        jobName: 'Restaurant Menu - Laminate',
        type: 'DIGITAL',
        timestamp: '2023-10-27T10:00:00',
        status: 'completed',
        material: '300gsm Gloss',
        qty: 50
    },
    {
        id: 'O-299',
        jobName: 'Bulk Pamphlets Run',
        type: 'OFFSET',
        timestamp: '2023-10-27T11:45:00',
        status: 'completed',
        material: '90gsm Art',
        qty: 10000
    },
    {
        id: 'B-502',
        jobName: 'Batch #502 - Student IDs',
        type: 'PVC',
        timestamp: '2023-10-26T16:20:00',
        status: 'completed',
        material: 'Matte PVC',
        qty: '10/10'
    }
];

export const MOCK_REJECTED_LOGS: LogEntry[] = [
    {
        id: 'J-105',
        jobName: 'Business Cards - Misaligned',
        type: 'DIGITAL',
        timestamp: '2023-10-27T09:30:00',
        status: 'rejected',
        rejectionReason: 'Bleed area missing in original PDF. Text getting cut off.',
        operator: 'Machine V-200'
    },
    {
        id: 'B-504',
        jobName: 'Batch #504 - PAN Cards',
        type: 'PVC',
        timestamp: '2023-10-26T14:10:00',
        status: 'rejected',
        rejectionReason: 'Corrupted image file for Card #4 (PAN-404). Unable to rip.',
        operator: 'Machine V-200'
    }
];
