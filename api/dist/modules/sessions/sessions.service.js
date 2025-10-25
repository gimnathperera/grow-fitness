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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../../schemas/session.schema");
let SessionsService = class SessionsService {
    sessionModel;
    constructor(sessionModel) {
        this.sessionModel = sessionModel;
    }
    async create(createSessionDto) {
        const conflicts = await this.checkConflicts(createSessionDto.coachId, createSessionDto.childIds, createSessionDto.startAt, createSessionDto.endAt);
        if (conflicts.length > 0) {
            throw new common_1.BadRequestException(`Conflicts detected: ${conflicts.join(', ')}`);
        }
        const session = new this.sessionModel({
            ...createSessionDto,
            coachId: new mongoose_2.Types.ObjectId(createSessionDto.coachId),
            childIds: createSessionDto.childIds.map((id) => new mongoose_2.Types.ObjectId(id)),
            locationId: new mongoose_2.Types.ObjectId(createSessionDto.locationId),
        });
        return session.save();
    }
    async findAll(filters) {
        const query = {};
        if (filters?.coachId) {
            query.coachId = new mongoose_2.Types.ObjectId(filters.coachId);
        }
        if (filters?.childId) {
            query.childIds = new mongoose_2.Types.ObjectId(filters.childId);
        }
        if (filters?.startDate || filters?.endDate) {
            query.startAt = {};
            if (filters.startDate) {
                query.startAt.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.startAt.$lte = filters.endDate;
            }
        }
        if (filters?.status) {
            query.status = filters.status;
        }
        return this.sessionModel
            .find(query)
            .populate('coachId', 'name email')
            .populate('childIds', 'name')
            .populate('locationId', 'label')
            .exec();
    }
    async findOne(id) {
        return this.sessionModel
            .findById(id)
            .populate('coachId', 'name email')
            .populate('childIds', 'name')
            .populate('locationId', 'label')
            .exec();
    }
    async update(id, updateSessionDto) {
        const updateData = { ...updateSessionDto };
        if (updateSessionDto.coachId) {
            updateData.coachId = new mongoose_2.Types.ObjectId(updateSessionDto.coachId);
        }
        if (updateSessionDto.childIds) {
            updateData.childIds = updateSessionDto.childIds.map((id) => new mongoose_2.Types.ObjectId(id));
        }
        if (updateSessionDto.locationId) {
            updateData.locationId = new mongoose_2.Types.ObjectId(updateSessionDto.locationId);
        }
        return this.sessionModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('coachId', 'name email')
            .populate('childIds', 'name')
            .populate('locationId', 'label')
            .exec();
    }
    async remove(id) {
        return this.sessionModel.findByIdAndDelete(id).exec();
    }
    async checkConflicts(coachId, childIds, startAt, endAt) {
        const conflicts = [];
        const coachConflicts = await this.sessionModel
            .find({
            coachId: new mongoose_2.Types.ObjectId(coachId),
            status: session_schema_1.SessionStatus.BOOKED,
            $or: [
                {
                    startAt: { $lt: endAt },
                    endAt: { $gt: startAt },
                },
            ],
        })
            .exec();
        if (coachConflicts.length > 0) {
            conflicts.push(`Coach has conflicting sessions`);
        }
        for (const childId of childIds) {
            const childConflicts = await this.sessionModel
                .find({
                childIds: new mongoose_2.Types.ObjectId(childId),
                status: session_schema_1.SessionStatus.BOOKED,
                $or: [
                    {
                        startAt: { $lt: endAt },
                        endAt: { $gt: startAt },
                    },
                ],
            })
                .exec();
            if (childConflicts.length > 0) {
                conflicts.push(`Child ${childId} has conflicting sessions`);
            }
        }
        return conflicts;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map