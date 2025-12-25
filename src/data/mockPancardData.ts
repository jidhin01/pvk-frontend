import { User } from '@/contexts/AuthContext';

export type PancardStatus = 'PENDING' | 'SENT_TO_PRINTER' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export interface PancardOrder {
    id: string;
    dealerId: string;
    dealerName: string; // Denormalized for easier display
    applicantName: string;
    fatherName: string;
    dob: string; // ISO Date string
    aadharNumber: string;
    aadharProofUrl?: string; // URL to the uploaded file
    generatedPanUrl?: string; // URL to the e-copy uploaded by Pan Team
    status: PancardStatus;
    type?: 'NORMAL' | 'EMERGENCY'; // Added type
    rejectionReason?: string; // Added rejection reason
    submittedAt: string;
    updatedAt: string;
    printerJobId?: string; // Link to the printer job when sent to printer
}

// Initial Mock Data
export const MOCK_PANCARD_ORDERS: PancardOrder[] = [
    {
        id: 'PAN-1001',
        dealerId: '4', // Matches MOCK_USERS 'dealer@pvk.com'
        dealerName: 'Dealer',
        applicantName: 'Rahul Kumar',
        fatherName: 'Rajesh Kumar',
        dob: '1990-05-15',
        aadharNumber: '1234 5678 9012',
        status: 'PENDING',
        type: 'NORMAL',
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'PAN-1002',
        dealerId: '4',
        dealerName: 'Dealer',
        applicantName: 'Priya Singh',
        fatherName: 'Vikram Singh',
        dob: '1995-08-22',
        aadharNumber: '9876 5432 1098',
        status: 'SENT_TO_PRINTER',
        type: 'EMERGENCY',
        printerJobId: 'JOB-2024-001',
        submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 80000000).toISOString(),
    },
    {
        id: 'PAN-1003',
        dealerId: '4',
        dealerName: 'Dealer',
        applicantName: 'Amit Verma',
        fatherName: 'Suresh Verma',
        dob: '1988-12-10',
        aadharNumber: '5555 6666 7777',
        status: 'PENDING',
        type: 'EMERGENCY',
        submittedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'PAN-1004',
        dealerId: '5',
        dealerName: 'Customer',
        applicantName: 'Sneha Gupta',
        fatherName: 'Mohit Gupta',
        dob: '2000-01-01',
        aadharNumber: '1111 2222 3333',
        status: 'COMPLETED',
        type: 'NORMAL',
        submittedAt: new Date(Date.now() - 400000000).toISOString(),
        updatedAt: new Date(Date.now() - 100000000).toISOString(),
    },
    {
        id: 'PAN-1005',
        dealerId: '4',
        dealerName: 'Dealer',
        applicantName: 'Rohan Das',
        fatherName: 'Kishore Das',
        dob: '1992-06-15',
        aadharNumber: '9999 8888 7777',
        status: 'REJECTED',
        type: 'NORMAL',
        rejectionReason: 'Blurry Photo',
        submittedAt: new Date(Date.now() - 500000000).toISOString(),
        updatedAt: new Date(Date.now() - 450000000).toISOString(),
    }
];

export const addPancardOrder = (order: Omit<PancardOrder, 'id' | 'status' | 'submittedAt' | 'updatedAt'>) => {
    const newOrder: PancardOrder = {
        id: `PAN-${1000 + MOCK_PANCARD_ORDERS.length + 1}`,
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...order
    };
    MOCK_PANCARD_ORDERS.unshift(newOrder); // Add to top
    return newOrder;
};
