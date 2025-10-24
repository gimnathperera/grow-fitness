import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Session,
  SessionDocument,
  SessionStatus,
} from '../../schemas/session.schema';
import {
  Invoice,
  InvoiceDocument,
  InvoiceStatus,
} from '../../schemas/invoice.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Child, ChildDocument } from '../../schemas/child.schema';
import {
  MilestoneAward,
  MilestoneAwardDocument,
} from '../../schemas/milestone-award.schema';
import { PDFDocument } from 'pdf-lib';
import * as Papa from 'papaparse';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
    @InjectModel(MilestoneAward.name)
    private milestoneAwardModel: Model<MilestoneAwardDocument>,
  ) {}

  async getWeeklyReport(startDate: Date, endDate: Date) {
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

    return this.generateReportData(
      sessions,
      invoices,
      milestoneAwards,
      'weekly',
    );
  }

  async getMonthlyReport(startDate: Date, endDate: Date) {
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

    return this.generateReportData(
      sessions,
      invoices,
      milestoneAwards,
      'monthly',
    );
  }

  private generateReportData(
    sessions: any[],
    invoices: any[],
    milestoneAwards: any[],
    period: string,
  ) {
    // Attendance Summary
    const attendance = {
      scheduled: sessions.length,
      completed: sessions.filter((s) => s.status === SessionStatus.COMPLETED)
        .length,
      canceled: sessions.filter((s) => s.status === SessionStatus.CANCELED)
        .length,
      late: sessions.filter((s) => s.isLate).length,
    };

    // Coach Performance
    const coachPerformance = sessions.reduce((acc, session) => {
      const coachName = session.coachId?.name || 'Unknown';
      if (!acc[coachName]) {
        acc[coachName] = { sessions: 0, earnings: 0 };
      }
      acc[coachName].sessions++;
      if (session.status === SessionStatus.COMPLETED) {
        acc[coachName].earnings += 1000; // Mock earnings calculation
      }
      return acc;
    }, {});

    // Child Activity
    const childActivity = sessions.reduce((acc, session) => {
      session.childIds.forEach((child: any) => {
        const childName = child.name;
        if (!acc[childName]) {
          acc[childName] = { sessions: 0, milestones: 0 };
        }
        acc[childName].sessions++;
      });
      return acc;
    }, {});

    // Add milestone counts
    milestoneAwards.forEach((award: any) => {
      const childName = award.childId?.name;
      if (childName && childActivity[childName]) {
        childActivity[childName].milestones++;
      }
    });

    // Finance Summary
    const finance = {
      totalPaid: invoices
        .filter((i) => i.status === InvoiceStatus.PAID)
        .reduce((sum, i) => sum + i.amountLKR, 0),
      totalUnpaid: invoices
        .filter((i) => i.status === InvoiceStatus.UNPAID)
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
      coachPerformance: Object.entries(coachPerformance).map(
        ([name, data]: [string, any]) => ({
          name,
          sessions: data.sessions,
          earnings: data.earnings,
        }),
      ),
      childActivity: Object.entries(childActivity).map(
        ([name, data]: [string, any]) => ({
          name,
          sessions: data.sessions,
          milestones: data.milestones,
        }),
      ),
      finance,
      milestoneAwards: milestoneAwards.map((award) => ({
        childName: award.childId?.name,
        awardedAt: award.awardedAt,
      })),
    };
  }

  async exportToCSV(reportData: any): Promise<string> {
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
      ...reportData.coachPerformance.map((coach: any) => [
        coach.name,
        coach.sessions,
        coach.earnings,
      ]),
      [''],
      ['Child Activity'],
      ['Name', 'Sessions', 'Milestones'],
      ...reportData.childActivity.map((child: any) => [
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

  async exportToPDF(reportData: any): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    let yPosition = height - 50;
    const fontSize = 12;
    const lineHeight = 20;

    // Helper function to add text
    const addText = (
      text: string,
      x: number,
      y: number,
      size: number = fontSize,
    ) => {
      page.drawText(text, {
        x,
        y,
        size,
      });
    };

    // Title
    addText(`${reportData.period.toUpperCase()} REPORT`, 50, yPosition, 16);
    yPosition -= 30;

    // Date Range
    addText(
      `Date Range: ${reportData.dateRange.start} to ${reportData.dateRange.end}`,
      50,
      yPosition,
    );
    yPosition -= lineHeight * 2;

    // Attendance Summary
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

    // Coach Performance
    addText('COACH PERFORMANCE', 50, yPosition, 14);
    yPosition -= lineHeight;
    reportData.coachPerformance.forEach((coach: any) => {
      addText(
        `${coach.name}: ${coach.sessions} sessions, LKR ${coach.earnings}`,
        50,
        yPosition,
      );
      yPosition -= lineHeight;
    });
    yPosition -= lineHeight;

    // Finance Summary
    addText('FINANCE SUMMARY', 50, yPosition, 14);
    yPosition -= lineHeight;
    addText(`Total Paid: LKR ${reportData.finance.totalPaid}`, 50, yPosition);
    yPosition -= lineHeight;
    addText(
      `Total Unpaid: LKR ${reportData.finance.totalUnpaid}`,
      50,
      yPosition,
    );
    yPosition -= lineHeight;
    addText(
      `Total Invoices: ${reportData.finance.totalInvoices}`,
      50,
      yPosition,
    );

    return Buffer.from(await pdfDoc.save());
  }
}
