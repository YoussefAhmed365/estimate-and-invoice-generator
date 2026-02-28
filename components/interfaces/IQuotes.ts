import { Document } from "mongoose";

export interface IQuote extends Document {
    clientName: string;
    projectName: string;
    issueDate: string;
    validUntil: string;
    lineItems: {
        id: number;
        name: string;
        description: string;
        hours: number;
        rate: number;
    }[];
    notesForClient: string;
    subTotal: number;
    taxRatePercentage: number;
    taxAmount: number;
    discount: number;
    grandTotal: number;
    status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
    updatedAt: Date;
};