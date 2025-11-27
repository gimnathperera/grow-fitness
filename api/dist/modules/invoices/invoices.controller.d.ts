import { InvoicesService } from './invoices.service';
import { InvoiceStatus, PaymentMethod } from '../../schemas/invoice.schema';
export declare class CreateInvoiceDto {
    parentId: string;
    amountLKR: number;
    status?: InvoiceStatus;
}
export declare class UpdateInvoiceDto {
    amountLKR?: number;
    status?: InvoiceStatus;
}
export declare class MarkPaidDto {
    paidMethod: PaymentMethod;
    paidDate?: Date;
}
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    findAll(status?: InvoiceStatus, parentId?: string, startDate?: string, endDate?: string): Promise<import("../../schemas/invoice.schema").Invoice[]>;
    getSummary(): Promise<{
        totalPaid: number;
        totalUnpaid: number;
        totalInvoices: number;
    }>;
    findOne(id: string): Promise<import("../../schemas/invoice.schema").Invoice | null>;
    create(createInvoiceDto: CreateInvoiceDto): Promise<import("../../schemas/invoice.schema").Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<import("../../schemas/invoice.schema").Invoice | null>;
    markAsPaid(id: string, markPaidDto: MarkPaidDto): Promise<import("../../schemas/invoice.schema").Invoice | null>;
    remove(id: string): Promise<import("../../schemas/invoice.schema").Invoice | null>;
}
