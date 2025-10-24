import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('reports')
@UseGuards(AdminGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('weekly')
  async getWeeklyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportsService.getWeeklyReport(start, end);
  }

  @Get('monthly')
  async getMonthlyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportsService.getMonthlyReport(start, end);
  }

  @Get('export/csv')
  async exportCSV(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('type') type: 'weekly' | 'monthly',
    @Res() res: Response,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const reportData =
      type === 'weekly'
        ? await this.reportsService.getWeeklyReport(start, end)
        : await this.reportsService.getMonthlyReport(start, end);

    const csv = await this.reportsService.exportToCSV(reportData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${type}-report-${startDate}-${endDate}.csv"`,
    );
    res.send(csv);
  }

  @Get('export/pdf')
  async exportPDF(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('type') type: 'weekly' | 'monthly',
    @Res() res: Response,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const reportData =
      type === 'weekly'
        ? await this.reportsService.getWeeklyReport(start, end)
        : await this.reportsService.getMonthlyReport(start, end);

    const pdfBuffer = await this.reportsService.exportToPDF(reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${type}-report-${startDate}-${endDate}.pdf"`,
    );
    res.send(pdfBuffer);
  }
}
