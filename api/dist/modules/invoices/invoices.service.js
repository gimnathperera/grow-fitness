"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invoice_schema_1 = require("../../schemas/invoice.schema");
let InvoicesService = class InvoicesService {
    invoiceModel;
    constructor(invoiceModel) {
        this.invoiceModel = invoiceModel;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.status) {
            query.status = filters.status;
        }
        if (filters?.parentId) {
            query.parentId = new mongoose_2.Types.ObjectId(filters.parentId);
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
    async findOne(id) {
        return this.invoiceModel
            .findById(id)
            .populate('parentId', 'name email')
            .exec();
    }
    async create(createInvoiceDto) {
        const invoice = new this.invoiceModel({
            ...createInvoiceDto,
            parentId: new mongoose_2.Types.ObjectId(createInvoiceDto.parentId),
            status: createInvoiceDto.status || invoice_schema_1.InvoiceStatus.UNPAID,
        });
        return invoice.save();
    }
    async update(id, updateInvoiceDto) {
        return this.invoiceModel
            .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
            .populate('parentId', 'name email')
            .exec();
    }
    async markAsPaid(id, paidMethod, paidDate) {
        return this.invoiceModel
            .findByIdAndUpdate(id, {
            status: invoice_schema_1.InvoiceStatus.PAID,
            paidDate: paidDate || new Date(),
            paidMethod,
        }, { new: true })
            .populate('parentId', 'name email')
            .exec();
    }
    async remove(id) {
        return this.invoiceModel.findByIdAndDelete(id).exec();
    }
    async getSummary() {
        const [paidResult, unpaidResult, totalResult] = await Promise.all([
            this.invoiceModel.aggregate([
                { $match: { status: invoice_schema_1.InvoiceStatus.PAID } },
                { $group: { _id: null, total: { $sum: '$amountLKR' } } },
            ]),
            this.invoiceModel.aggregate([
                { $match: { status: invoice_schema_1.InvoiceStatus.UNPAID } },
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
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map