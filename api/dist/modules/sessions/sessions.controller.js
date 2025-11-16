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
var SessionsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sessionsService_1 = __importStar(require("./sessions.service"));
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const user_decorator_1 = require("../../decorators/user.decorator");
const user_schema_1 = require("../../schemas/user.schema");
const session_schema_1 = require("../../schemas/session.schema");
let SessionsController = SessionsController_1 = class SessionsController {
    sessionsService;
    logger = new common_1.Logger(SessionsController_1.name);
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async create(createSessionDto, user) {
        this.logger.log(`[SessionsController] Admin ${user.id} creating new session`);
        const session = await this.sessionsService.create(createSessionDto);
        return {
            success: true,
            message: 'Session created successfully',
            data: session,
        };
    }
    async findAll(queryParams, user) {
        this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching sessions`);
        const currentUserId = user.id || user.userId;
        if (!currentUserId) {
            this.logger.warn(`[SessionsController] User not authenticated`);
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const currentUserIdStr = String(currentUserId);
        if (user.role === user_schema_1.UserRole.ADMIN) {
            this.logger.debug(`[SessionsController] Admin fetching sessions with filters`);
        }
        else if (user.role === user_schema_1.UserRole.COACH || user.role === 'coach') {
            const requestedCoachId = queryParams.coachId || currentUserIdStr;
            const requestedCoachIdStr = String(requestedCoachId);
            if (requestedCoachIdStr !== currentUserIdStr) {
                this.logger.warn(`[SessionsController] Coach ${currentUserIdStr} tried to access sessions of coach ${requestedCoachIdStr}`);
                throw new common_1.ForbiddenException('You can only view your own assigned sessions');
            }
            queryParams.coachId = currentUserIdStr;
            this.logger.debug(`[SessionsController] Coach ${currentUserIdStr} fetching their assigned sessions`);
        }
        else if (user.role === user_schema_1.UserRole.PARENT || user.role === 'parent' || user.role === 'client') {
            if (queryParams.clientId && String(queryParams.clientId) !== currentUserIdStr) {
                this.logger.warn(`[SessionsController] Parent ${currentUserIdStr} tried to access sessions of client ${queryParams.clientId}`);
                throw new common_1.ForbiddenException('You can only view your own sessions');
            }
            queryParams.clientId = currentUserIdStr;
            this.logger.debug(`[SessionsController] Parent ${currentUserIdStr} fetching sessions for their children`);
        }
        else {
            this.logger.warn(`[SessionsController] Unknown role: ${user.role}`);
            throw new common_1.ForbiddenException('Invalid user role');
        }
        const result = await this.sessionsService.findAll(queryParams, user.role, currentUserIdStr);
        return {
            success: true,
            message: 'Sessions retrieved successfully',
            data: result,
        };
    }
    async getUpcomingSessions(limit, user) {
        this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching upcoming sessions`);
        const currentUserId = user.id || user.userId;
        if (!currentUserId) {
            this.logger.warn(`[SessionsController] User not authenticated`);
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const sessions = await this.sessionsService.getUpcomingSessions(limitNum, String(currentUserId), user.role);
        return {
            success: true,
            message: 'Upcoming sessions retrieved successfully',
            data: sessions,
        };
    }
    async getUpcomingByKid(kidId, limit, user) {
        this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching upcoming sessions for kid ${kidId}`);
        if (!kidId) {
            throw new common_1.ForbiddenException('kidId is required');
        }
        const currentUserId = user.id || user.userId;
        if (!currentUserId) {
            this.logger.warn(`[SessionsController] User not authenticated`);
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const sessions = await this.sessionsService.getUpcomingByKid(kidId, limitNum, String(currentUserId), user.role);
        return {
            success: true,
            message: 'Upcoming sessions for kid retrieved successfully',
            data: sessions,
        };
    }
    async checkAvailability(coachId, location, user) {
        this.logger.debug(`[SessionsController] User ${user.id} checking availability for coach ${coachId}`);
        if (!coachId) {
            throw new common_1.ForbiddenException('coachId is required');
        }
        const availability = await this.sessionsService.checkAvailability(coachId, location);
        return {
            success: true,
            message: 'Availability checked successfully',
            data: availability,
        };
    }
    async findOne(id, user) {
        this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching session ${id}`);
        const session = await this.sessionsService.findOne(id);
        if (!session) {
            this.logger.warn(`[SessionsController] Session ${id} not found`);
            throw new common_1.NotFoundException('Session not found');
        }
        const currentUserId = user.id || user.userId;
        const currentUserIdStr = String(currentUserId);
        if (user.role === user_schema_1.UserRole.ADMIN) {
            this.logger.debug(`[SessionsController] Admin accessing session ${id}`);
        }
        else if (user.role === user_schema_1.UserRole.COACH || user.role === 'coach') {
            const sessionCoachIdStr = String(session.coachId);
            if (sessionCoachIdStr !== currentUserIdStr) {
                this.logger.warn(`[SessionsController] Coach ${currentUserIdStr} tried to access session ${id} assigned to coach ${sessionCoachIdStr}`);
                throw new common_1.ForbiddenException('You can only view your own assigned sessions');
            }
            this.logger.debug(`[SessionsController] Coach ${currentUserIdStr} accessing their session ${id}`);
        }
        else if (user.role === user_schema_1.UserRole.PARENT || user.role === 'parent' || user.role === 'client') {
            const hasAccess = await this.sessionsService.validateParentAccess(id, currentUserIdStr);
            if (!hasAccess) {
                this.logger.warn(`[SessionsController] Parent ${currentUserIdStr} tried to access session ${id} without their children`);
                throw new common_1.ForbiddenException('You can only view sessions involving your children');
            }
            this.logger.debug(`[SessionsController] Parent ${currentUserIdStr} accessing session ${id}`);
        }
        else {
            this.logger.warn(`[SessionsController] Unknown role: ${user.role}`);
            throw new common_1.ForbiddenException('Invalid user role');
        }
        return {
            success: true,
            message: 'Session retrieved successfully',
            data: session,
        };
    }
    async update(id, updateSessionDto, user) {
        this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) updating session ${id}`);
        const session = await this.sessionsService.findOne(id);
        if (!session) {
            this.logger.warn(`[SessionsController] Session ${id} not found for update`);
            throw new common_1.NotFoundException('Session not found');
        }
        const currentUserId = user.id || user.userId;
        const currentUserIdStr = String(currentUserId);
        if (user.role === user_schema_1.UserRole.ADMIN) {
            this.logger.debug(`[SessionsController] Admin updating session ${id}`);
            const updated = await this.sessionsService.update(id, updateSessionDto);
            this.logger.log(`[SessionsController] Session ${id} updated by admin`);
            return {
                success: true,
                message: 'Session updated successfully',
                data: updated,
            };
        }
        else if (user.role === user_schema_1.UserRole.COACH || user.role === 'coach') {
            const sessionCoachIdStr = String(session.coachId);
            if (sessionCoachIdStr !== currentUserIdStr) {
                this.logger.warn(`[SessionsController] Coach ${currentUserIdStr} tried to update session ${id} assigned to coach ${sessionCoachIdStr}`);
                throw new common_1.ForbiddenException('You can only update your own assigned sessions');
            }
            const allowedUpdates = {};
            if (updateSessionDto.status !== undefined)
                allowedUpdates.status = updateSessionDto.status;
            this.logger.debug(`[SessionsController] Coach ${currentUserIdStr} updating session ${id} status`);
            const updated = await this.sessionsService.update(id, allowedUpdates);
            this.logger.log(`[SessionsController] Session ${id} updated by coach`);
            return {
                success: true,
                message: 'Session status updated successfully',
                data: updated,
            };
        }
        else if (user.role === user_schema_1.UserRole.PARENT || user.role === 'parent' || user.role === 'client') {
            this.logger.warn(`[SessionsController] Parent ${currentUserIdStr} tried to update session ${id}`);
            throw new common_1.ForbiddenException('Parents cannot update sessions');
        }
        else {
            this.logger.warn(`[SessionsController] Unknown role: ${user.role}`);
            throw new common_1.ForbiddenException('Invalid user role');
        }
    }
    async remove(id, user) {
        this.logger.log(`[SessionsController] Admin ${user.id} deleting session ${id}`);
        const result = await this.sessionsService.remove(id);
        this.logger.log(`[SessionsController] Session ${id} deleted successfully`);
        return {
            success: true,
            message: 'Session deleted successfully',
            data: result,
        };
    }
};
exports.SessionsController = SessionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new session (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - conflicts detected' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sessions with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filter by parent/client ID' }),
    (0, swagger_1.ApiQuery)({ name: 'coachId', required: false, description: 'Filter by coach ID' }),
    (0, swagger_1.ApiQuery)({ name: 'kidId', required: false, description: 'Filter by child ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: session_schema_1.SessionStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, description: 'Start date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, description: 'End date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sessions with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming sessions' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of sessions to return', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming sessions' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getUpcomingSessions", null);
__decorate([
    (0, common_1.Get)('upcoming-by-kid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming sessions for a specific kid' }),
    (0, swagger_1.ApiQuery)({ name: 'kidId', required: true, description: 'Child ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of sessions to return', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming sessions for the kid' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Child not found or access denied' }),
    __param(0, (0, common_1.Query)('kidId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getUpcomingByKid", null);
__decorate([
    (0, common_1.Get)('check-availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Check coach availability' }),
    (0, swagger_1.ApiQuery)({ name: 'coachId', required: true, description: 'Coach ID' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Location ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coach availability data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('coachId')),
    __param(1, (0, common_1.Query)('location')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific session by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session details' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a session' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a session (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "remove", null);
exports.SessionsController = SessionsController = SessionsController_1 = __decorate([
    (0, swagger_1.ApiTags)('sessions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sessionsService_1.SessionsService])
], SessionsController);
//# sourceMappingURL=sessions.controller.js.map