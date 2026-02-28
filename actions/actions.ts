'use server';

import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { revalidatePath } from "next/cache";

/*
    Create a new quote
    @param formData: FormData
    @returns Promise<{
        success: boolean;
        data?: IQuote;
        error?: string;
    }>
*/
export async function createQuote(formData: FormData) {
    try {
        await connectDB();

        const data = {
            clientName: formData.get('clientName') as string,
            projectName: formData.get('projectName') as string,
            issueDate: formData.get('issueDate') as string,
            validUntil: formData.get('validUntil') as string,
            notesForClient: formData.get('notesForClient') as string,
            lineItems: JSON.parse(formData.get('lineItems') as string || '[]'),
            subTotal: Number(formData.get('subTotal')),
            taxRatePercentage: Number(formData.get('taxRatePercentage')),
            taxAmount: Number(formData.get('taxAmount')),
            discount: Number(formData.get('discount')) || 0,
            grandTotal: Number(formData.get('grandTotal')),
            status: (formData.get('status') as string) || 'Draft',
        };

        const quote = await Quote.create(data);

        revalidatePath('/quotes');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(quote)),
        };
    } catch (error) {
        console.error('Failed to create quote:', error);
        return {
            success: false,
            error: 'Failed to create quote',
        };
    }
}

/*
    Get all quotes
    @returns Promise<IQuote[]>
*/
export async function getQuotes() {
    try {
        await connectDB();

        const quotes = await Quote.find().sort({ createdAt: -1 }).lean();

        if (!quotes) {
            return [];
        }

        return quotes.map((quote: any) => ({
            ...quote,
            _id: quote._id.toString(),
        }));
    } catch (error) {
        console.error('Failed to get quotes:', error);
        return [];
    }
}

export async function getQuoteById(id: string) {
    try {
        await connectDB();

        const quote = await Quote.findById(id).lean();

        if (!quote) {
            return null;
        }

        return {
            ...quote,
            _id: quote._id.toString(),
        } as any;
    } catch (error) {
        console.error('Failed to get quote:', error);
        return null;
    }
}

/*
    Update a quote
    @param id: string
    @param formData: FormData
    @returns Promise<{
        success: boolean;
        data?: IQuote;
        error?: string;
    }>
*/
export async function updateQuote(id: string, formData: FormData) {
    try {
        await connectDB();

        const data = {
            clientName: formData.get('clientName') as string,
            projectName: formData.get('projectName') as string,
            issueDate: formData.get('issueDate') as string,
            validUntil: formData.get('validUntil') as string,
            notesForClient: formData.get('notesForClient') as string,
            lineItems: JSON.parse(formData.get('lineItems') as string || '[]'),
            subTotal: Number(formData.get('subTotal')),
            taxRatePercentage: Number(formData.get('taxRatePercentage')),
            taxAmount: Number(formData.get('taxAmount')),
            discount: Number(formData.get('discount')) || 0,
            grandTotal: Number(formData.get('grandTotal')),
            status: (formData.get('status') as string) || 'Draft',
        };

        const quote = await Quote.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        revalidatePath('/quotes');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(quote)),
        };
    } catch (error) {
        console.error('Failed to update quote:', error);
        return {
            success: false,
            error: 'Failed to update quote',
        };
    }
}

/*
    Delete a quote
    @param id: string
    @returns Promise<{
        success: boolean;
        error?: string;
    }>
*/
export async function deleteQuote(id: string) {
    try {
        await connectDB();

        await Quote.findByIdAndDelete(id);

        revalidatePath('/quotes');

        return {
            success: true,
        };
    } catch (error) {
        console.error('Failed to delete quote:', error);
        return {
            success: false,
            error: 'Failed to delete quote',
        };
    }
}