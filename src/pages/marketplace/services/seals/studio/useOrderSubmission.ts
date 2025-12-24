import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface SubmissionSpecs {
    size: string;
    mountType: string;
    inkColor: string;
    machineModelId: string;
    quantity: number;
    remarks: string;
}

export interface OrderPayload {
    designData: any;
    previewImage: string;
    specifications: SubmissionSpecs;
}

export const useOrderSubmission = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const generateOrderPayload = (blocks: any[], template: any, previewImage: string, specs: SubmissionSpecs): OrderPayload => {
        return {
            designData: { blocks, template },
            previewImage,
            specifications: specs
        };
    };

    const submitOrder = async (payload: OrderPayload) => {
        setIsSubmitting(true);

        // Validation
        if (payload.specifications.quantity < 1) {
            toast.error("Quantity must be at least 1");
            setIsSubmitting(false);
            return;
        }

        // Simulate API
        console.log("Submitting Order...", payload);
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Order Submitted Successfully:", payload);

        // Success
        toast.success("Order Placed Successfully!");

        // Ideally we would push to MOCK_DEALER_DATA here, but simpler to just navigate
        // In a real app, API handles persistence.

        // Navigate to Dealer Dashboard -> Orders Tab
        setIsSubmitting(false);
        navigate('/dealer', { state: { activeTab: 'orders' } });
    };

    return {
        isSubmitting,
        generateOrderPayload,
        submitOrder
    };
};
