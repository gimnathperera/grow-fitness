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
exports.RequestsController = exports.RejectRequestDto = exports.ApproveRequestDto = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const admin_guard_1 = require("../auth/admin.guard");
const request_schema_1 = require("../../schemas/request.schema");
class ApproveRequestDto {
    newSlot;
    adminNote;
}
exports.ApproveRequestDto = ApproveRequestDto;
class RejectRequestDto {
    reason;
}
exports.RejectRequestDto = RejectRequestDto;
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    findAll(status) {
        return this.requestsService.findAll(status);
    }
    findOne(id) {
        return this.requestsService.findOne(id);
    }
    approve(id, approveRequestDto, req) {
        return this.requestsService.approve(id, req.user.id, approveRequestDto.newSlot, approveRequestDto.adminNote);
    }
    reject(id, rejectRequestDto, req) {
        return this.requestsService.reject(id, req.user.id, rejectRequestDto.reason);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApproveRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RejectRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "reject", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map