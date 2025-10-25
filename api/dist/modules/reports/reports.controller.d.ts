import type { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getWeeklyReport(startDate: string, endDate: string): Promise<{
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
    getMonthlyReport(startDate: string, endDate: string): Promise<{
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
    exportCSV(startDate: string, endDate: string, type: 'weekly' | 'monthly', res: Response): Promise<void>;
    exportPDF(startDate: string, endDate: string, type: 'weekly' | 'monthly', res: Response): Promise<void>;
}
