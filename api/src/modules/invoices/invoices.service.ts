import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Invoice,
  InvoiceDocument,
  InvoiceStatus,
  PaymentMethod,
} from '../../schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async findAll(filters?: {
    status?: InvoiceStatus;
    parentId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Invoice[]> {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.parentId) {
      query.parentId = new Types.ObjectId(filters.parentId);
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    return this.invoiceModel
      .find(query)
      .populate('parentId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Invoice | null> {
    return this.invoiceModel
      .findById(id)
      .populate('parentId', 'name email')
      .exec();
  }

  async create(createInvoiceDto: {
    parentId: string;
    amountLKR: number;
    status?: InvoiceStatus;
  }): Promise<Invoice> {
    const invoice = new this.invoiceModel({
      ...createInvoiceDto,
      parentId: new Types.ObjectId(createInvoiceDto.parentId),
      status: createInvoiceDto.status || InvoiceStatus.UNPAID,
    });

    return invoice.save();
  }

  async update(
    id: string,
    updateInvoiceDto: Partial<Invoice>,
  ): Promise<Invoice | null> {
    return this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .populate('parentId', 'name email')
      .exec();
  }

  async markAsPaid(
    id: string,
    paidMethod: PaymentMethod,
    paidDate?: Date,
  ): Promise<Invoice | null> {
    return this.invoiceModel
      .findByIdAndUpdate(
        id,
        {
          status: InvoiceStatus.PAID,
          paidDate: paidDate || new Date(),
          paidMethod,
        },
        { new: true },
      )
      .populate('parentId', 'name email')
      .exec();
  }

  async remove(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }

  async getSummary(): Promise<{
    totalPaid: number;
    totalUnpaid: number;
    totalInvoices: number;
  }> {
    const [paidResult, unpaidResult, totalResult] = await Promise.all([
      this.invoiceModel.aggregate([
        { $match: { status: InvoiceStatus.PAID } },
        { $group: { _id: null, total: { $sum: '$amountLKR' } } },
      ]),
      this.invoiceModel.aggregate([
        { $match: { status: InvoiceStatus.UNPAID } },
        { $group: { _id: null, total: { $sum: '$amountLKR' } } },
      ]),
      this.invoiceModel.countDocuments(),
    ]);

    return {
      totalPaid: paidResult[0]?.total || 0,
      totalUnpaid: unpaidResult[0]?.total || 0,
      totalInvoices: totalResult,
    };
  }
}
