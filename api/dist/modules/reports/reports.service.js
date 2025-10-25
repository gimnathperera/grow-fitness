"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../../schemas/session.schema");
const invoice_schema_1 = require("../../schemas/invoice.schema");
const user_schema_1 = require("../../schemas/user.schema");
const child_schema_1 = require("../../schemas/child.schema");
const milestone_award_schema_1 = require("../../schemas/milestone-award.schema");
const pdf_lib_1 = require("pdf-lib");
const Papa = __importStar(require("papaparse"));
let ReportsService = class ReportsService {
    sessionModel;
    invoiceModel;
    userModel;
    childModel;
    milestoneAwardModel;
    constructor(sessionModel, invoiceModel, userModel, childModel, milestoneAwardModel) {
        this.sessionModel = sessionModel;
        this.invoiceModel = invoiceModel;
        this.userModel = userModel;
        this.childModel = childModel;
        this.milestoneAwardModel = milestoneAwardModel;
    }
    async getWeeklyReport(startDate, endDate) {
        const sessions = await this.sessionModel
            .find({
            startAt: { $gte: startDate, $lte: endDate },
        })
            .populate('coachId', 'name')
            .populate('childIds', 'name')
            .exec();
        const invoices = await this.invoiceModel
            .find({
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .populate('parentId', 'name')
            .exec();
        const milestoneAwards = await this.milestoneAwardModel
            .find({
            awardedAt: { $gte: startDate, $lte: endDate },
        })
            .populate('childId', 'name')
            .exec();
        return this.generateReportData(sessions, invoices, milestoneAwards, 'weekly');
    }
    async getMonthlyReport(startDate, endDate) {
        const sessions = await this.sessionModel
            .find({
            startAt: { $gte: startDate, $lte: endDate },
        })
            .populate('coachId', 'name')
            .populate('childIds', 'name')
            .exec();
        const invoices = await this.invoiceModel
            .find({
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .populate('parentId', 'name')
            .exec();
        const milestoneAwards = await this.milestoneAwardModel
            .find({
            awardedAt: { $gte: startDate, $lte: endDate },
        })
            .populate('childId', 'name')
            .exec();
        return this.generateReportData(sessions, invoices, milestoneAwards, 'monthly');
    }
    generateReportData(sessions, invoices, milestoneAwards, period) {
        const attendance = {
            scheduled: sessions.length,
            completed: sessions.filter((s) => s.status === session_schema_1.SessionStatus.COMPLETED)
                .length,
            canceled: sessions.filter((s) => s.status === session_schema_1.SessionStatus.CANCELED)
                .length,
            late: sessions.filter((s) => s.isLate).length,
        };
        const coachPerformance = sessions.reduce((acc, session) => {
            const coachName = session.coachId?.name || 'Unknown';
            if (!acc[coachName]) {
                acc[coachName] = { sessions: 0, earnings: 0 };
            }
            acc[coachName].sessions++;
            if (session.status === session_schema_1.SessionStatus.COMPLETED) {
                acc[coachName].earnings += 1000;
            }
            return acc;
        }, {});
        const childActivity = sessions.reduce((acc, session) => {
            session.childIds.forEach((child) => {
                const childName = child.name;
                if (!acc[childName]) {
                    acc[childName] = { sessions: 0, milestones: 0 };
                }
                acc[childName].sessions++;
            });
            return acc;
        }, {});
        milestoneAwards.forEach((award) => {
            const childName = award.childId?.name;
            if (childName && childActivity[childName]) {
                childActivity[childName].milestones++;
            }
        });
        const finance = {
            totalPaid: invoices
                .filter((i) => i.status === invoice_schema_1.InvoiceStatus.PAID)
                .reduce((sum, i) => sum + i.amountLKR, 0),
            totalUnpaid: invoices
                .filter((i) => i.status === invoice_schema_1.InvoiceStatus.UNPAID)
                .reduce((sum, i) => sum + i.amountLKR, 0),
            totalInvoices: invoices.length,
        };
        return {
            period,
            dateRange: {
                start: sessions[0]?.startAt,
                end: sessions[sessions.length - 1]?.startAt,
            },
            attendance,
            coachPerformance: Object.entries(coachPerformance).map(([name, data]) => ({
                name,
                sessions: data.sessions,
                earnings: data.earnings,
            })),
            childActivity: Object.entries(childActivity).map(([name, data]) => ({
                name,
                sessions: data.sessions,
                milestones: data.milestones,
            })),
            finance,
            milestoneAwards: milestoneAwards.map((award) => ({
                childName: award.childId?.name,
                awardedAt: award.awardedAt,
            })),
        };
    }
    async exportToCSV(reportData) {
        const csvData = [
            ['Report Type', reportData.period],
            [
                'Date Range',
                `${reportData.dateRange.start} to ${reportData.dateRange.end}`,
            ],
            [''],
            ['Attendance Summary'],
            ['Scheduled', reportData.attendance.scheduled],
            ['Completed', reportData.attendance.completed],
            ['Canceled', reportData.attendance.canceled],
            ['Late', reportData.attendance.late],
            [''],
            ['Coach Performance'],
            ['Name', 'Sessions', 'Earnings (LKR)'],
            ...reportData.coachPerformance.map((coach) => [
                coach.name,
                coach.sessions,
                coach.earnings,
            ]),
            [''],
            ['Child Activity'],
            ['Name', 'Sessions', 'Milestones'],
            ...reportData.childActivity.map((child) => [
                child.name,
                child.sessions,
                child.milestones,
            ]),
            [''],
            ['Finance Summary'],
            ['Total Paid (LKR)', reportData.finance.totalPaid],
            ['Total Unpaid (LKR)', reportData.finance.totalUnpaid],
            ['Total Invoices', reportData.finance.totalInvoices],
        ];
        return Papa.unparse(csvData);
    }
    async exportToPDF(reportData) {
        const pdfDoc = await pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        let yPosition = height - 50;
        const fontSize = 12;
        const lineHeight = 20;
        const addText = (text, x, y, size = fontSize) => {
            page.drawText(text, {
                x,
                y,
                size,
            });
        };
        addText(`${reportData.period.toUpperCase()} REPORT`, 50, yPosition, 16);
        yPosition -= 30;
        addText(`Date Range: ${reportData.dateRange.start} to ${reportData.dateRange.end}`, 50, yPosition);
        yPosition -= lineHeight * 2;
        addText('ATTENDANCE SUMMARY', 50, yPosition, 14);
        yPosition -= lineHeight;
        addText(`Scheduled: ${reportData.attendance.scheduled}`, 50, yPosition);
        yPosition -= lineHeight;
        addText(`Completed: ${reportData.attendance.completed}`, 50, yPosition);
        yPosition -= lineHeight;
        addText(`Canceled: ${reportData.attendance.canceled}`, 50, yPosition);
        yPosition -= lineHeight;
        addText(`Late: ${reportData.attendance.late}`, 50, yPosition);
        yPosition -= lineHeight * 2;
        addText('COACH PERFORMANCE', 50, yPosition, 14);
        yPosition -= lineHeight;
        reportData.coachPerformance.forEach((coach) => {
            addText(`${coach.name}: ${coach.sessions} sessions, LKR ${coach.earnings}`, 50, yPosition);
            yPosition -= lineHeight;
        });
        yPosition -= lineHeight;
        addText('FINANCE SUMMARY', 50, yPosition, 14);
        yPosition -= lineHeight;
        addText(`Total Paid: LKR ${reportData.finance.totalPaid}`, 50, yPosition);
        yPosition -= lineHeight;
        addText(`Total Unpaid: LKR ${reportData.finance.totalUnpaid}`, 50, yPosition);
        yPosition -= lineHeight;
        addText(`Total Invoices: ${reportData.finance.totalInvoices}`, 50, yPosition);
        return Buffer.from(await pdfDoc.save());
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(1, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(child_schema_1.Child.name)),
    __param(4, (0, mongoose_1.InjectModel)(milestone_award_schema_1.MilestoneAward.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map