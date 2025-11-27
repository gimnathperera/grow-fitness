import { Model } from 'mongoose';
import { Invoice, InvoiceDocument, InvoiceStatus, PaymentMethod } from '../../schemas/invoice.schema';
export declare class InvoicesService {
    private invoiceModel;
    constructor(invoiceModel: Model<InvoiceDocument>);
    findAll(filters?: {
        status?: InvoiceStatus;
        parentId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice | null>;
    create(createInvoiceDto: {
        parentId: string;
        amountLKR: number;
        status?: InvoiceStatus;
    }): Promise<Invoice>;
    update(id: string, updateInvoiceDto: Partial<Invoice>): Promise<Invoice | null>;
    markAsPaid(id: string, paidMethod: PaymentMethod, paidDate?: Date): Promise<Invoice | null>;
    remove(id: string): Promise<Invoice | null>;
    getSummary(): Promise<{
        totalPaid: number;
        totalUnpaid: number;
        totalInvoices: number;
    }>;
}
