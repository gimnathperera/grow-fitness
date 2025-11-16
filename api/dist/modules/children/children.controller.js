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
var ChildrenController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildrenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const children_service_1 = require("./children.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_decorator_1 = require("../../decorators/user.decorator");
const user_schema_1 = require("../../schemas/user.schema");
const child_dto_1 = require("./dto/child.dto");
let ChildrenController = ChildrenController_1 = class ChildrenController {
    childrenService;
    logger = new common_1.Logger(ChildrenController_1.name);
    constructor(childrenService) {
        this.childrenService = childrenService;
    }
    async findAll(parentId, user) {
        this.logger.debug(`[ChildrenController] User ${user.id} (${user.role}) fetching children`);
        const currentUserId = user.id || user.userId;
        if (!currentUserId) {
            this.logger.warn(`[ChildrenController] User not authenticated trying to fetch children`);
            throw new common_1.ForbiddenException('User not authenticated');
        }
        if (user.role === user_schema_1.UserRole.ADMIN) {
            this.logger.debug(`[ChildrenController] Admin fetching children with filter parentId=${parentId}`);
            const result = await this.childrenService.findAll(parentId);
            this.logger.debug(`[ChildrenController] Admin fetched ${result.length} children`);
            return result;
        }
        const targetParentId = parentId || currentUserId;
        const targetParentIdStr = String(targetParentId);
        const currentUserIdStr = String(currentUserId);
        if (targetParentIdStr !== currentUserIdStr) {
            this.logger.warn(`[ChildrenController] Parent ${currentUserIdStr} tried to access children of parent ${targetParentIdStr}`);
            throw new common_1.ForbiddenException('You can only access your own children');
        }
        this.logger.debug(`[ChildrenController] Parent ${currentUserIdStr} fetching their own children`);
        const result = await this.childrenService.findByParentId(currentUserIdStr);
        this.logger.debug(`[ChildrenController] Parent fetched ${result.length} children`);
        return result;
    }
    async findOne(id, user) {
        this.logger.debug(`[ChildrenController] User ${user.id} fetching child ${id}`);
        const child = await this.childrenService.findOne(id);
        if (!child) {
            this.logger.warn(`[ChildrenController] Child ${id} not found`);
            throw new common_1.NotFoundException('Child not found');
        }
        const currentUserId = user.id || user.userId;
        const childParentIdStr = String(child.parentId);
        const currentUserIdStr = String(currentUserId);
        if (user.role !== user_schema_1.UserRole.ADMIN && childParentIdStr !== currentUserIdStr) {
            this.logger.warn(`[ChildrenController] User ${currentUserIdStr} unauthorized to access child ${id} (parent: ${childParentIdStr})`);
            throw new common_1.ForbiddenException('Not authorized to view this child');
        }
        this.logger.debug(`[ChildrenController] Child ${id} fetched successfully`);
        return child;
    }
    async create(createChildDtos, user) {
        this.logger.debug(`[ChildrenController] User object: ${JSON.stringify(user, null, 2)}`);
        const currentUserId = user.id ||
            user._id ||
            user.userId ||
            (user.user && (user.user.id || user.user._id || user.user.userId));
        if (!currentUserId) {
            this.logger.warn(`[ChildrenController] User not authenticated trying to create child`);
            throw new common_1.ForbiddenException('User not authenticated');
        }
        this.logger.debug(`[ChildrenController] User ${currentUserId} (${user.role}) creating children`);
        const childDtos = Array.isArray(createChildDtos) ? createChildDtos : [createChildDtos];
        const processedDtos = childDtos.map((dto) => {
            const childData = { ...dto };
            if (!childData.parentId) {
                childData.parentId = currentUserId;
            }
            else {
                const parentIdStr = String(childData.parentId);
                const currentUserIdStr = String(currentUserId);
                const isAdmin = user.role === user_schema_1.UserRole.ADMIN;
                const isParentCreatingForSelf = (user.role === 'parent' || user.role === 'client') && parentIdStr === currentUserIdStr;
                if (!isAdmin && !isParentCreatingForSelf) {
                    this.logger.warn(`[ChildrenController] User ${currentUserIdStr} (${user.role}) tried to create child for another parent ${parentIdStr}`);
                    throw new common_1.ForbiddenException('You do not have permission to create children for another parent');
                }
            }
            if (!childData.goals)
                childData.goals = [];
            if (childData.isInSports === undefined)
                childData.isInSports = false;
            if (childData.age !== undefined && !childData.birthDate) {
                const birthYear = new Date().getFullYear() - childData.age;
                childData.birthDate = new Date(birthYear, 0, 1);
            }
            if (childData.preferredTrainingStyle && !childData.trainingPreference) {
                childData.trainingPreference = childData.preferredTrainingStyle;
            }
            this.logger.debug(`[ChildrenController] Prepared child data for creation: ${JSON.stringify(childData)}`);
            return childData;
        });
        const result = await this.childrenService.create(processedDtos);
        this.logger.log(`[ChildrenController] Created ${Array.isArray(result) ? result.length : 1} children successfully`);
        return Array.isArray(createChildDtos) ? result : result[0];
    }
    async update(id, updateChildDto, user) {
        this.logger.debug(`[ChildrenController] User ${user.id} updating child ${id}`);
        const child = await this.childrenService.findOne(id);
        if (!child) {
            this.logger.warn(`[ChildrenController] Child ${id} not found for update`);
            throw new common_1.NotFoundException('Child not found');
        }
        const currentUserId = user.id || user.userId;
        const childParentIdStr = String(child.parentId);
        const currentUserIdStr = String(currentUserId);
        if (user.role !== user_schema_1.UserRole.ADMIN && childParentIdStr !== currentUserIdStr) {
            this.logger.warn(`[ChildrenController] User ${currentUserIdStr} unauthorized to update child ${id} (parent: ${childParentIdStr})`);
            throw new common_1.ForbiddenException('You can only update your own children');
        }
        const updatedChild = await this.childrenService.update(id, updateChildDto);
        this.logger.log(`[ChildrenController] Child ${id} updated successfully`);
        return updatedChild;
    }
    async remove(id, user) {
        this.logger.debug(`[ChildrenController] User ${user.id} (${user.role}) attempting to delete child ${id}`);
        const child = await this.childrenService.findOne(id);
        if (!child) {
            this.logger.warn(`[ChildrenController] Child ${id} not found for deletion`);
            throw new common_1.NotFoundException('Child not found');
        }
        const currentUserId = user.id || user.userId;
        const childParentIdStr = String(child.parentId);
        const currentUserIdStr = String(currentUserId);
        if (user.role !== user_schema_1.UserRole.ADMIN && childParentIdStr !== currentUserIdStr) {
            this.logger.warn(`[ChildrenController] User ${currentUserIdStr} unauthorized to delete child ${id} (parent: ${childParentIdStr})`);
            throw new common_1.ForbiddenException('You can only delete your own children');
        }
        const result = await this.childrenService.remove(id);
        this.logger.log(`[ChildrenController] Child ${id} deleted by user ${currentUserIdStr} (${user.role})`);
        return result;
    }
};
exports.ChildrenController = ChildrenController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all children (admin) or children of a specific parent' }),
    (0, swagger_1.ApiQuery)({ name: 'parentId', required: false, description: 'Filter by parent ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of children', type: [child_dto_1.ChildDto] }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('parentId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific child by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Child ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Child details', type: child_dto_1.ChildDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Child not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create one or multiple children' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Children created successfully', type: [child_dto_1.ChildDto] }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a child' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Child ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Child updated successfully', type: child_dto_1.ChildDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Child not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, child_dto_1.UpdateChildDto, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a child (admin or parent owner)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Child ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Child deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Child not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "remove", null);
exports.ChildrenController = ChildrenController = ChildrenController_1 = __decorate([
    (0, swagger_1.ApiTags)('children'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('children'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [children_service_1.ChildrenService])
], ChildrenController);
//# sourceMappingURL=children.controller.js.map