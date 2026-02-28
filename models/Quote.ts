import mongoose, { Model, Schema } from "mongoose";
import { IQuote } from "@/components/interfaces/IQuotes";

const QuoteSchema: Schema = new Schema(
    {
        clientName: {
            type: String,
            require: [true, 'Client name is required'],
        },
        projectName: {
            type: String,
            require: [true, 'Project name is required'],
        },
        issueDate: {
            type: String,
            default: Date.now,
        },
        validUntil: {
            type: String,
            require: [true, "You must provide an end date"],
        },
        lineItems: {
            type: Array,
            require: [true, 'Line items are required'],
        },
        notesForClient: {
            type: String,
        },
        subTotal: {
            type: Number,
            require: [true, "There's a problem saving subtotal"],
        },
        taxRatePercentage: {
            type: Number,
            require: [true, "There's a problem saving tax rate percentage"],
        },
        taxAmount: {
            type: Number,
            require: [true, "There's a problem saving tax amount"],
        },
        discount: {
            type: Number,
            default: 0,
        },
        grandTotal: {
            type: Number,
            require: [true, "There's a problem saving grand total"],
        },
        status: {
            type: String,
            enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
            default: 'Draft',
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;