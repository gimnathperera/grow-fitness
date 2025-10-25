import { Model } from 'mongoose';
import { SessionDocument } from '../../schemas/session.schema';
import { InvoiceDocument } from '../../schemas/invoice.schema';
import { UserDocument } from '../../schemas/user.schema';
import { ChildDocument } from '../../schemas/child.schema';
import { MilestoneAwardDocument } from '../../schemas/milestone-award.schema';
export declare class ReportsService {
    private sessionModel;
    private invoiceModel;
    private userModel;
    private childModel;
    private milestoneAwardModel;
    constructor(sessionModel: Model<SessionDocument>, invoiceModel: Model<InvoiceDocument>, userModel: Model<UserDocument>, childModel: Model<ChildDocument>, milestoneAwardModel: Model<MilestoneAwardDocument>);
    getWeeklyReport(startDate: Date, endDate: Date): Promise<{
        period: string;
        dateRange: {
            start: any;
            end: any;
        };
        attendance: {
            scheduled: number;
            completed: number;
            canceled: number;
            late: number;
        };
        coachPerformance: {
            name: string;
            sessions: any;
            earnings: any;
        }[];
        childActivity: {
            name: string;
            sessions: any;
            milestones: any;
        }[];
        finance: {
            totalPaid: any;
            totalUnpaid: any;
            totalInvoices: number;
        };
        milestoneAwards: {
            childName: any;
            awardedAt: any;
        }[];
    }>;
    getMonthlyReport(startDate: Date, endDate: Date): Promise<{
        period: string;
        dateRange: {
            start: any;
            end: any;
        };
        attendance: {
            scheduled: number;
            completed: number;
            canceled: number;
            late: number;
        };
        coachPerformance: {
            name: string;
            sessions: any;
            earnings: any;
        }[];
        childActivity: {
            name: string;
            sessions: any;
            milestones: any;
        }[];
        finance: {
            totalPaid: any;
            totalUnpaid: any;
            totalInvoices: number;
        };
        milestoneAwards: {
            childName: any;
            awardedAt: any;
        }[];
    }>;
    private generateReportData;
    exportToCSV(reportData: any): Promise<string>;
    exportToPDF(reportData: any): Promise<Buffer>;
}
