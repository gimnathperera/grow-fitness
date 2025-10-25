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
exports.SessionsController = exports.UpdateSessionDto = exports.CreateSessionDto = void 0;
const common_1 = require("@nestjs/common");
const sessions_service_1 = require("./sessions.service");
const admin_guard_1 = require("../auth/admin.guard");
const session_schema_1 = require("../../schemas/session.schema");
class CreateSessionDto {
    type;
    coachId;
    childIds;
    locationId;
    startAt;
    endAt;
}
exports.CreateSessionDto = CreateSessionDto;
class UpdateSessionDto {
    type;
    coachId;
    childIds;
    locationId;
    startAt;
    endAt;
    status;
}
exports.UpdateSessionDto = UpdateSessionDto;
let SessionsController = class SessionsController {
    sessionsService;
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    create(createSessionDto) {
        return this.sessionsService.create(createSessionDto);
    }
    findAll(coachId, childId, startDate, endDate, status) {
        const filters = {};
        if (coachId)
            filters.coachId = coachId;
        if (childId)
            filters.childId = childId;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (status)
            filters.status = status;
        return this.sessionsService.findAll(filters);
    }
    findOne(id) {
        return this.sessionsService.findOne(id);
    }
    update(id, updateSessionDto) {
        return this.sessionsService.update(id, updateSessionDto);
    }
    remove(id) {
        return this.sessionsService.remove(id);
    }
};
exports.SessionsController = SessionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSessionDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('coachId')),
    __param(1, (0, common_1.Query)('childId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSessionDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "remove", null);
exports.SessionsController = SessionsController = __decorate([
    (0, common_1.Controller)('sessions'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [sessions_service_1.SessionsService])
], SessionsController);
//# sourceMappingURL=sessions.controller.js.map