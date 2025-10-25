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
exports.ChildrenController = exports.UpdateChildDto = exports.CreateChildDto = void 0;
const admin_guard_1 = require("../auth/admin.guard");
const common_1 = require("@nestjs/common");
const children_service_1 = require("./children.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_decorator_1 = require("../../decorators/user.decorator");
const user_schema_1 = require("../../schemas/user.schema");
class CreateChildDto {
    name;
    parentId;
    birthDate;
    goals;
    medicalCondition;
    gender;
}
exports.CreateChildDto = CreateChildDto;
class UpdateChildDto {
    name;
    birthDate;
    goals;
    medicalCondition;
    gender;
}
exports.UpdateChildDto = UpdateChildDto;
let ChildrenController = class ChildrenController {
    childrenService;
    constructor(childrenService) {
        this.childrenService = childrenService;
    }
    async findAll(parentId, user) {
        if (user.role === user_schema_1.UserRole.ADMIN) {
            return this.childrenService.findAll(parentId);
        }
        return this.childrenService.findByParentId(user.userId);
    }
    async update(id, updateChildDto, user) {
        const child = await this.childrenService.findOne(id);
        if (!child) {
            return null;
        }
        if (user.role !== 'admin' && child.parentId.toString() !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own children');
        }
        return this.childrenService.update(id, updateChildDto);
    }
    remove(id) {
        return this.childrenService.remove(id);
    }
};
exports.ChildrenController = ChildrenController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('parentId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateChildDto, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChildrenController.prototype, "remove", null);
exports.ChildrenController = ChildrenController = __decorate([
    (0, common_1.Controller)('children'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [children_service_1.ChildrenService])
], ChildrenController);
//# sourceMappingURL=children.controller.js.map