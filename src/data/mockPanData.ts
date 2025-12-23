export interface PanApplication {
    id: string;
    applicantName: string;
    fatherName: string; // Critical for PAN
    dob: string;
    phone: string;
    aadhaarNumber: string;
    type: 'NORMAL' | 'EMERGENCY';
    // Expanded status to include soft rejection and completion
    status: 'pending_verification' | 'sent_to_printer' | 'rejected' | 'printed' | 'completed' | 'reupload_requested';
    documents: {
        aadhaarFront: string; // Proof (Aadhaar)
        photo: string;        // Card Photo
    };
    isPrintRequired: boolean; // New field for Digital Only vs Print
    rejectionReason?: string; // Reason logic
    dealerName: string;
    submittedAt: string;
}

export const MOCK_PAN_APPLICATIONS: PanApplication[] = [
    {
        id: "PAN-2024-001",
        applicantName: "Rajesh Kumar",
        fatherName: "Suresh Kumar",
        dob: "1985-05-12",
        phone: "9876543210",
        aadhaarNumber: "1234 5678 9012",
        type: "EMERGENCY",
        status: "pending_verification",
        documents: {
            aadhaarFront: "https://placehold.co/600x400/png?text=Aadhaar+Proof",
            photo: "https://placehold.co/400x400/png?text=Passport+Photo",
        },
        isPrintRequired: true,
        dealerName: "Kerala Digital House",
        submittedAt: "2024-03-10T09:30:00Z"
    },
    {
        id: "PAN-2024-002",
        applicantName: "Priya Sharma",
        fatherName: "Mohan Sharma",
        dob: "1992-08-22",
        phone: "9876543211",
        aadhaarNumber: "9876 5432 1098",
        type: "NORMAL",
        status: "pending_verification",
        documents: {
            aadhaarFront: "https://placehold.co/600x400/png?text=Aadhaar+Proof",
            photo: "https://placehold.co/400x400/png?text=Passport+Photo",
        },
        isPrintRequired: true,
        dealerName: "City Printers",
        submittedAt: "2024-03-10T10:15:00Z"
    },
    {
        id: "PAN-2024-003",
        applicantName: "Amit Patel",
        fatherName: "Ramesh Patel",
        dob: "1978-12-01",
        phone: "9876543212",
        aadhaarNumber: "4567 8901 2345",
        type: "EMERGENCY",
        status: "pending_verification", // Changed to pending to test workflow
        documents: {
            aadhaarFront: "https://placehold.co/600x400/png?text=Blurry+Aadhaar",
            photo: "https://placehold.co/400x400/png?text=Photo",
        },
        isPrintRequired: false, // Digital Only
        dealerName: "Fast Track Services",
        submittedAt: "2024-03-09T14:20:00Z"
    },
    {
        id: "PAN-2024-004",
        applicantName: "Sneha Gupta",
        fatherName: "Vikram Gupta",
        dob: "1995-03-15",
        phone: "9876543213",
        aadhaarNumber: "2345 6789 0123",
        type: "NORMAL",
        status: "rejected",
        rejectionReason: "Name Mismatch",
        documents: {
            aadhaarFront: "https://placehold.co/600x400/png?text=Aadhaar+Proof",
            photo: "https://placehold.co/400x400/png?text=Photo",
        },
        isPrintRequired: true,
        dealerName: "Kerala Digital House",
        submittedAt: "2024-03-08T11:00:00Z"
    },
    {
        id: "PAN-2024-005",
        applicantName: "Re-upload Test",
        fatherName: "Test Father",
        dob: "1990-06-30",
        phone: "9876543214",
        aadhaarNumber: "3456 7890 1234",
        type: "NORMAL",
        status: "reupload_requested",
        rejectionReason: "Photo Blurry",
        documents: {
            aadhaarFront: "https://placehold.co/600x400/png?text=Aadhaar+Proof",
            photo: "https://placehold.co/400x400/png?text=Bad+Photo",
        },
        isPrintRequired: true,
        dealerName: "Tech Solutions",
        submittedAt: "2024-03-10T11:45:00Z"
    }
];
