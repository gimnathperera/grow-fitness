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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const admin_guard_1 = require("../auth/admin.guard");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getWeeklyReport(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.reportsService.getWeeklyReport(start, end);
    }
    async getMonthlyReport(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.reportsService.getMonthlyReport(start, end);
    }
    async exportCSV(startDate, endDate, type, res) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const reportData = type === 'weekly'
            ? await this.reportsService.getWeeklyReport(start, end)
            : await this.reportsService.getMonthlyReport(start, end);
        const csv = await this.reportsService.exportToCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${startDate}-${endDate}.csv"`);
        res.send(csv);
    }
    async exportPDF(startDate, endDate, type, res) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const reportData = type === 'weekly'
            ? await this.reportsService.getWeeklyReport(start, end)
            : await this.reportsService.getMonthlyReport(start, end);
        const pdfBuffer = await this.reportsService.exportToPDF(reportData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${startDate}-${endDate}.pdf"`);
        res.send(pdfBuffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('weekly'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getWeeklyReport", null);
__decorate([
    (0, common_1.Get)('monthly'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportPDF", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map