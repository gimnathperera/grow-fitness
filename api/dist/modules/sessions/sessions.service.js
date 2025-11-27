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
var SessionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../../schemas/session.schema");
const child_schema_1 = require("../../schemas/child.schema");
let SessionsService = SessionsService_1 = class SessionsService {
    sessionModel;
    childModel;
    logger = new common_1.Logger(SessionsService_1.name);
    constructor(sessionModel, childModel) {
        this.sessionModel = sessionModel;
        this.childModel = childModel;
    }
    async create(createSessionDto) {
        console.log('[SessionsService] Starting session creation...', createSessionDto);
        const startAt = new Date(createSessionDto.startsAt);
        const endAt = new Date(createSessionDto.endsAt);
        const childIds = createSessionDto.kidId ? [createSessionDto.kidId] : [];
        console.log('[SessionsService] Child IDs for session:', childIds);
        const conflicts = await this.checkConflicts(createSessionDto.coachId, childIds, startAt, endAt);
        if (conflicts.length > 0) {
            console.warn('[SessionsService] Conflicts found:', conflicts);
            throw new common_1.BadRequestException(`Conflicts detected: ${conflicts.join(', ')}`);
        }
        const sessionData = {
            type: createSessionDto.sessionType || session_schema_1.SessionType.TRAINING,
            coachId: new mongoose_2.Types.ObjectId(createSessionDto.coachId),
            childIds: childIds.map((id) => new mongoose_2.Types.ObjectId(id)),
            startAt,
            endAt,
            status: session_schema_1.SessionStatus.BOOKED,
        };
        if (createSessionDto.location)
            sessionData.locationId = new mongoose_2.Types.ObjectId(createSessionDto.location);
        if (createSessionDto.notes)
            sessionData.notes = createSessionDto.notes;
        if (createSessionDto.price !== undefined)
            sessionData.price = createSessionDto.price;
        if (createSessionDto.tags)
            sessionData.tags = createSessionDto.tags;
        console.log('[SessionsService] Final session data to save:', sessionData);
        const session = new this.sessionModel(sessionData);
        const saved = await session.save();
        console.log('[SessionsService] Session created with ID:', saved._id);
        return saved;
    }
    async findAll(filters, userRole, userId) {
        console.log('[SessionsService] Fetching sessions with filters:', filters, 'Role:', userRole);
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;
        const query = {};
        if (filters.clientId || (userRole === 'parent' && userId)) {
            const parentId = filters.clientId || userId;
            console.log('[SessionsService] Filtering sessions for parent:', parentId);
            const children = await this.childModel.find({ parentId }).select('_id').lean();
            const childIds = children.map((child) => child._id.toString());
            console.log('[SessionsService] Children IDs for parent:', childIds);
            if (childIds.length === 0) {
                console.log('[SessionsService] Parent has no children. Returning empty result.');
                return { sessions: [], total: 0, pagination: { page, limit, total: 0, totalPages: 0 } };
            }
            if (filters.kidId) {
                if (!childIds.includes(filters.kidId)) {
                    console.warn('[SessionsService] Parent does not have access to requested kid:', filters.kidId);
                    return { sessions: [], total: 0, pagination: { page, limit, total: 0, totalPages: 0 } };
                }
                query.childIds = new mongoose_2.Types.ObjectId(filters.kidId);
            }
            else {
                query.childIds = { $in: childIds.map((id) => new mongoose_2.Types.ObjectId(id)) };
            }
        }
        else {
            if (filters.coachId)
                query.coachId = new mongoose_2.Types.ObjectId(filters.coachId);
            if (filters.kidId)
                query.childIds = new mongoose_2.Types.ObjectId(filters.kidId);
        }
        if (filters.dateFrom || filters.dateTo) {
            query.startAt = {};
            if (filters.dateFrom)
                query.startAt.$gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                query.startAt.$lte = new Date(filters.dateTo);
        }
        if (filters.status)
            query.status = filters.status;
        console.log('[SessionsService] MongoDB query:', query);
        const [sessions, total] = await Promise.all([
            this.sessionModel
                .find(query)
                .populate('coachId', 'name email')
                .populate('childIds', 'name age')
                .populate('locationId', 'name address label')
                .sort({ startAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.sessionModel.countDocuments(query),
        ]);
        console.log('[SessionsService] Found sessions:', sessions.length, 'Total:', total);
        return {
            sessions,
            total,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUpcomingSessions(limit = 10, userId, userRole) {
        console.log('[SessionsService] Fetching upcoming sessions, limit:', limit, 'User:', userId);
        const now = new Date();
        const query = { startAt: { $gte: now }, status: { $in: [session_schema_1.SessionStatus.BOOKED, session_schema_1.SessionStatus.CONFIRMED] } };
        if (userRole === 'parent' && userId) {
            const children = await this.childModel.find({ parentId: userId }).select('_id').lean();
            const childIds = children.map(c => c._id);
            if (childIds.length === 0)
                return [];
            query.childIds = { $in: childIds };
        }
        if (userRole === 'coach' && userId)
            query.coachId = new mongoose_2.Types.ObjectId(userId);
        const sessions = await this.sessionModel
            .find(query)
            .populate('coachId', 'name email')
            .populate('childIds', 'name age')
            .populate('locationId', 'name address label')
            .sort({ startAt: 1 })
            .limit(limit)
            .lean();
        console.log('[SessionsService] Upcoming sessions found:', sessions.length);
        return sessions;
    }
    async getUpcomingByKid(kidId, limit = 10, userId, userRole) {
        console.log('[SessionsService] Fetching upcoming sessions for kid:', kidId);
        if (userRole === 'parent' && userId) {
            const child = await this.childModel.findOne({ _id: kidId, parentId: userId }).lean();
            if (!child) {
                console.warn('[SessionsService] Parent does not own this child:', kidId);
                throw new common_1.NotFoundException('Child not found or access denied');
            }
        }
        const now = new Date();
        const sessions = await this.sessionModel
            .find({ childIds: new mongoose_2.Types.ObjectId(kidId), startAt: { $gte: now }, status: { $in: [session_schema_1.SessionStatus.BOOKED, session_schema_1.SessionStatus.CONFIRMED] } })
            .populate('coachId', 'name email')
            .populate('childIds', 'name age')
            .populate('locationId', 'name address label')
            .sort({ startAt: 1 })
            .limit(limit)
            .lean();
        console.log('[SessionsService] Upcoming sessions for kid found:', sessions.length);
        return sessions;
    }
    async checkConflicts(coachId, childIds, startAt, endAt) {
        const conflicts = [];
        console.log('[SessionsService] Checking conflicts for coach and children...');
        const coachConflicts = await this.sessionModel.find({
            coachId: new mongoose_2.Types.ObjectId(coachId),
            status: session_schema_1.SessionStatus.BOOKED,
            $or: [{ startAt: { $lt: endAt }, endAt: { $gt: startAt } }],
        }).exec();
        if (coachConflicts.length > 0)
            conflicts.push('Coach has conflicting sessions');
        for (const childId of childIds) {
            const childConflicts = await this.sessionModel.find({
                childIds: new mongoose_2.Types.ObjectId(childId),
                status: session_schema_1.SessionStatus.BOOKED,
                $or: [{ startAt: { $lt: endAt }, endAt: { $gt: startAt } }],
            }).exec();
            if (childConflicts.length > 0)
                conflicts.push(`Child ${childId} has conflicting sessions`);
        }
        console.log('[SessionsService] Conflicts detected:', conflicts);
        return conflicts;
    }
    async findOne(id) {
        console.log('[SessionsService] Fetching session with ID:', id);
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Invalid session ID');
        const session = await this.sessionModel
            .findById(id)
            .populate('coachId', 'name email')
            .populate('childIds', 'name age')
            .populate('locationId', 'name address label')
            .lean();
        console.log('[SessionsService] Session found:', session ? session._id : 'None');
        return session;
    }
    async validateParentAccess(sessionId, parentId) {
        console.log('[SessionsService] Validating parent access:', parentId, 'to session:', sessionId);
        try {
            const session = await this.sessionModel.findById(sessionId).lean();
            if (!session)
                return false;
            const children = await this.childModel.find({ parentId }).select('_id').lean();
            const childIds = children.map(c => c._id.toString());
            const sessionChildIds = session.childIds.map((id) => id.toString());
            const hasAccess = sessionChildIds.some((id) => childIds.includes(id));
            console.log(`[SessionsService] Parent has access: ${hasAccess}`);
            return hasAccess;
        }
        catch (error) {
            console.error('[SessionsService] Error validating parent access:', error.message);
            return false;
        }
    }
    async update(id, updateSessionDto) {
        console.log('[SessionsService] Updating session:', id, updateSessionDto);
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Invalid session ID');
        const updateData = { ...updateSessionDto };
        if (updateSessionDto.coachId)
            updateData.coachId = new mongoose_2.Types.ObjectId(updateSessionDto.coachId);
        if (updateSessionDto.childIds)
            updateData.childIds = updateSessionDto.childIds.map((id) => new mongoose_2.Types.ObjectId(id));
        if (updateSessionDto.locationId)
            updateData.locationId = new mongoose_2.Types.ObjectId(updateSessionDto.locationId);
        const updated = await this.sessionModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('coachId', 'name email')
            .populate('childIds', 'name age')
            .populate('locationId', 'name address label')
            .lean();
        console.log('[SessionsService] Session updated:', updated ? updated._id : 'Not found');
        if (!updated)
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        return updated;
    }
    async remove(id) {
        console.log('[SessionsService] Deleting session:', id);
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Invalid session ID');
        const deleted = await this.sessionModel.findByIdAndDelete(id).lean();
        console.log('[SessionsService] Session deleted:', deleted ? deleted._id : 'Not found');
        if (!deleted)
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        return deleted;
    }
    async checkAvailability(coachId, location) {
        console.log('[SessionsService] Checking availability for coach:', coachId);
        const now = new Date();
        const query = { coachId: new mongoose_2.Types.ObjectId(coachId), startAt: { $gte: now }, status: { $in: [session_schema_1.SessionStatus.BOOKED, session_schema_1.SessionStatus.CONFIRMED] } };
        if (location)
            query.locationId = new mongoose_2.Types.ObjectId(location);
        const bookedSessions = await this.sessionModel.find(query).sort({ startAt: 1 }).lean();
        console.log('[SessionsService] Booked sessions found:', bookedSessions.length);
        return {
            coachId,
            location,
            bookedSlots: bookedSessions.map(s => ({ startAt: s.startAt, endAt: s.endAt })),
            totalBooked: bookedSessions.length,
        };
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = SessionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(1, (0, mongoose_1.InjectModel)(child_schema_1.Child.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map