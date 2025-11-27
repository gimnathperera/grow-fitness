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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const request_schema_1 = require("../../schemas/request.schema");
const session_schema_1 = require("../../schemas/session.schema");
const crm_event_schema_1 = require("../../schemas/crm-event.schema");
let RequestsService = class RequestsService {
    requestModel;
    sessionModel;
    crmEventModel;
    constructor(requestModel, sessionModel, crmEventModel) {
        this.requestModel = requestModel;
        this.sessionModel = sessionModel;
        this.crmEventModel = crmEventModel;
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        return this.requestModel
            .find(filter)
            .populate('sessionId')
            .populate('requesterId', 'name email')
            .exec();
    }
    async findOne(id) {
        return this.requestModel
            .findById(id)
            .populate('sessionId')
            .populate('requesterId', 'name email')
            .exec();
    }
    async approve(id, adminId, newSlot, adminNote) {
        const request = await this.requestModel.findById(id).exec();
        if (!request) {
            throw new Error('Request not found');
        }
        const session = await this.sessionModel.findById(request.sessionId).exec();
        if (!session) {
            throw new Error('Session not found');
        }
        if (request.type === request_schema_1.RequestType.RESCHEDULE && newSlot) {
            await this.sessionModel
                .findByIdAndUpdate(request.sessionId, {
                startAt: newSlot.startAt,
                endAt: newSlot.endAt,
            })
                .exec();
            await this.crmEventModel.create({
                actorId: new mongoose_2.Types.ObjectId(adminId),
                subjectId: request.sessionId,
                kind: 'session_rescheduled',
                payload: {
                    oldStartAt: session.startAt,
                    oldEndAt: session.endAt,
                    newStartAt: newSlot.startAt,
                    newEndAt: newSlot.endAt,
                    reason: request.reason,
                },
            });
        }
        else if (request.type === request_schema_1.RequestType.CANCEL) {
            await this.sessionModel
                .findByIdAndUpdate(request.sessionId, {
                status: session_schema_1.SessionStatus.CANCELED,
            })
                .exec();
            await this.crmEventModel.create({
                actorId: new mongoose_2.Types.ObjectId(adminId),
                subjectId: request.sessionId,
                kind: 'session_canceled',
                payload: {
                    reason: request.reason,
                    isLate: request.isLate,
                },
            });
        }
        const updatedRequest = await this.requestModel
            .findByIdAndUpdate(id, {
            status: request_schema_1.RequestStatus.APPROVED,
            adminNote,
            decidedAt: new Date(),
        }, { new: true })
            .exec();
        return updatedRequest;
    }
    async reject(id, adminId, reason) {
        const request = await this.requestModel
            .findByIdAndUpdate(id, {
            status: request_schema_1.RequestStatus.REJECTED,
            adminNote: reason,
            decidedAt: new Date(),
        }, { new: true })
            .exec();
        if (!request) {
            throw new Error('Request not found');
        }
        await this.crmEventModel.create({
            actorId: new mongoose_2.Types.ObjectId(adminId),
            subjectId: request.sessionId,
            kind: 'request_rejected',
            payload: {
                requestType: request.type,
                reason: request.reason,
                adminReason: reason,
                isLate: request.isLate,
            },
        });
        return request;
    }
    async checkLateRequest(sessionId) {
        const session = await this.sessionModel.findById(sessionId).exec();
        if (!session)
            return false;
        const now = new Date();
        const sessionStart = new Date(session.startAt);
        const hoursUntilSession = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilSession < 12;
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __param(1, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(2, (0, mongoose_1.InjectModel)(crm_event_schema_1.CRMEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RequestsService);
//# sourceMappingURL=requests.service.js.map