import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Session,
  SessionDocument,
  SessionType,
  SessionStatus,
} from '../../schemas/session.schema';
import { Child, ChildDocument } from '../../schemas/child.schema';

export interface CreateSessionDto {
  clientId: string;
  coachId: string;
  kidId?: string;
  startsAt: string; // ISO string
  endsAt: string; // ISO string
  location?: string;
  notes?: string;
  sessionType?: SessionType;
  price?: number;
  tags?: string[];
}

export interface UpdateSessionDto {
  type?: SessionType;
  coachId?: string;
  childIds?: string[];
  locationId?: string;
  startAt?: Date;
  endAt?: Date;
  status?: SessionStatus;
  notes?: string;
  price?: number;
  tags?: string[];
}

export interface SessionsQueryParams {
  clientId?: string;
  coachId?: string;
  kidId?: string;
  status?: SessionStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
  ) {}

  /** CREATE SESSION */
  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    console.log('[SessionsService] Starting session creation...', createSessionDto);

    const startAt = new Date(createSessionDto.startsAt);
    const endAt = new Date(createSessionDto.endsAt);

    const childIds = createSessionDto.kidId ? [createSessionDto.kidId] : [];
    console.log('[SessionsService] Child IDs for session:', childIds);

    // Check for conflicts
    const conflicts = await this.checkConflicts(createSessionDto.coachId, childIds, startAt, endAt);
    if (conflicts.length > 0) {
      console.warn('[SessionsService] Conflicts found:', conflicts);
      throw new BadRequestException(`Conflicts detected: ${conflicts.join(', ')}`);
    }

    const sessionData: any = {
      type: createSessionDto.sessionType || SessionType.TRAINING,
      coachId: new Types.ObjectId(createSessionDto.coachId),
      childIds: childIds.map((id) => new Types.ObjectId(id)),
      startAt,
      endAt,
      status: SessionStatus.BOOKED,
    };

    if (createSessionDto.location) sessionData.locationId = new Types.ObjectId(createSessionDto.location);
    if (createSessionDto.notes) sessionData.notes = createSessionDto.notes;
    if (createSessionDto.price !== undefined) sessionData.price = createSessionDto.price;
    if (createSessionDto.tags) sessionData.tags = createSessionDto.tags;

    console.log('[SessionsService] Final session data to save:', sessionData);

    const session = new this.sessionModel(sessionData);
    const saved = await session.save();
    console.log('[SessionsService] Session created with ID:', saved._id);

    return saved;
  }

  /** FIND ALL SESSIONS WITH FILTERS & PAGINATION */
  async findAll(
    filters: SessionsQueryParams,
    userRole?: string,
    userId?: string,
  ): Promise<{ sessions: Session[]; total: number; pagination: any }> {
    console.log('[SessionsService] Fetching sessions with filters:', filters, 'Role:', userRole);

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Parent-specific filtering
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
        query.childIds = new Types.ObjectId(filters.kidId);
      } else {
        query.childIds = { $in: childIds.map((id) => new Types.ObjectId(id)) };
      }
    } else {
      if (filters.coachId) query.coachId = new Types.ObjectId(filters.coachId);
      if (filters.kidId) query.childIds = new Types.ObjectId(filters.kidId);
    }

    if (filters.dateFrom || filters.dateTo) {
      query.startAt = {};
      if (filters.dateFrom) query.startAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.startAt.$lte = new Date(filters.dateTo);
    }

    if (filters.status) query.status = filters.status;

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

  /** GET UPCOMING SESSIONS */
  async getUpcomingSessions(limit = 10, userId?: string, userRole?: string): Promise<Session[]> {
    console.log('[SessionsService] Fetching upcoming sessions, limit:', limit, 'User:', userId);

    const now = new Date();
    const query: any = { startAt: { $gte: now }, status: { $in: [SessionStatus.BOOKED, SessionStatus.CONFIRMED] } };

    if (userRole === 'parent' && userId) {
      const children = await this.childModel.find({ parentId: userId }).select('_id').lean();
      const childIds = children.map(c => c._id);
      if (childIds.length === 0) return [];
      query.childIds = { $in: childIds };
    }

    if (userRole === 'coach' && userId) query.coachId = new Types.ObjectId(userId);

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

  /** GET UPCOMING SESSIONS BY KID */
  async getUpcomingByKid(kidId: string, limit = 10, userId?: string, userRole?: string): Promise<Session[]> {
    console.log('[SessionsService] Fetching upcoming sessions for kid:', kidId);

    if (userRole === 'parent' && userId) {
      const child = await this.childModel.findOne({ _id: kidId, parentId: userId }).lean();
      if (!child) {
        console.warn('[SessionsService] Parent does not own this child:', kidId);
        throw new NotFoundException('Child not found or access denied');
      }
    }

    const now = new Date();
    const sessions = await this.sessionModel
      .find({ childIds: new Types.ObjectId(kidId), startAt: { $gte: now }, status: { $in: [SessionStatus.BOOKED, SessionStatus.CONFIRMED] } })
      .populate('coachId', 'name email')
      .populate('childIds', 'name age')
      .populate('locationId', 'name address label')
      .sort({ startAt: 1 })
      .limit(limit)
      .lean();

    console.log('[SessionsService] Upcoming sessions for kid found:', sessions.length);
    return sessions;
  }

  /** CHECK CONFLICTS */
  async checkConflicts(coachId: string, childIds: string[], startAt: Date, endAt: Date): Promise<string[]> {
    const conflicts: string[] = [];
    console.log('[SessionsService] Checking conflicts for coach and children...');

    // Coach conflicts
    const coachConflicts = await this.sessionModel.find({
      coachId: new Types.ObjectId(coachId),
      status: SessionStatus.BOOKED,
      $or: [{ startAt: { $lt: endAt }, endAt: { $gt: startAt } }],
    }).exec();
    if (coachConflicts.length > 0) conflicts.push('Coach has conflicting sessions');

    // Child conflicts
    for (const childId of childIds) {
      const childConflicts = await this.sessionModel.find({
        childIds: new Types.ObjectId(childId),
        status: SessionStatus.BOOKED,
        $or: [{ startAt: { $lt: endAt }, endAt: { $gt: startAt } }],
      }).exec();
      if (childConflicts.length > 0) conflicts.push(`Child ${childId} has conflicting sessions`);
    }

    console.log('[SessionsService] Conflicts detected:', conflicts);
    return conflicts;
  }

  /** FIND ONE SESSION */
  async findOne(id: string): Promise<Session | null> {
    console.log('[SessionsService] Fetching session with ID:', id);
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid session ID');

    const session = await this.sessionModel
      .findById(id)
      .populate('coachId', 'name email')
      .populate('childIds', 'name age')
      .populate('locationId', 'name address label')
      .lean();

    console.log('[SessionsService] Session found:', session ? session._id : 'None');
    return session;
  }

  /** VALIDATE PARENT ACCESS */
  async validateParentAccess(sessionId: string, parentId: string): Promise<boolean> {
    console.log('[SessionsService] Validating parent access:', parentId, 'to session:', sessionId);

    try {
      const session = await this.sessionModel.findById(sessionId).lean();
      if (!session) return false;

      const children = await this.childModel.find({ parentId }).select('_id').lean();
      const childIds = children.map(c => c._id.toString());
      const sessionChildIds = session.childIds.map((id) => id.toString());
      const hasAccess = sessionChildIds.some((id) => childIds.includes(id));

      console.log(`[SessionsService] Parent has access: ${hasAccess}`);
      return hasAccess;
    } catch (error) {
      console.error('[SessionsService] Error validating parent access:', error.message);
      return false;
    }
  }

  /** UPDATE SESSION */
  async update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session | null> {
    console.log('[SessionsService] Updating session:', id, updateSessionDto);
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid session ID');

    const updateData: any = { ...updateSessionDto };
    if (updateSessionDto.coachId) updateData.coachId = new Types.ObjectId(updateSessionDto.coachId);
    if (updateSessionDto.childIds) updateData.childIds = updateSessionDto.childIds.map((id) => new Types.ObjectId(id));
    if (updateSessionDto.locationId) updateData.locationId = new Types.ObjectId(updateSessionDto.locationId);

    const updated = await this.sessionModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('coachId', 'name email')
      .populate('childIds', 'name age')
      .populate('locationId', 'name address label')
      .lean();

    console.log('[SessionsService] Session updated:', updated ? updated._id : 'Not found');
    if (!updated) throw new NotFoundException(`Session with ID ${id} not found`);

    return updated;
  }

  /** DELETE SESSION */
  async remove(id: string): Promise<Session | null> {
    console.log('[SessionsService] Deleting session:', id);
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid session ID');

    const deleted = await this.sessionModel.findByIdAndDelete(id).lean();
    console.log('[SessionsService] Session deleted:', deleted ? deleted._id : 'Not found');

    if (!deleted) throw new NotFoundException(`Session with ID ${id} not found`);
    return deleted;
  }

  /** CHECK AVAILABILITY */
  async checkAvailability(coachId: string, location?: string): Promise<any> {
    console.log('[SessionsService] Checking availability for coach:', coachId);

    const now = new Date();
    const query: any = { coachId: new Types.ObjectId(coachId), startAt: { $gte: now }, status: { $in: [SessionStatus.BOOKED, SessionStatus.CONFIRMED] } };
    if (location) query.locationId = new Types.ObjectId(location);

    const bookedSessions = await this.sessionModel.find(query).sort({ startAt: 1 }).lean();
    console.log('[SessionsService] Booked sessions found:', bookedSessions.length);

    return {
      coachId,
      location,
      bookedSlots: bookedSessions.map(s => ({ startAt: s.startAt, endAt: s.endAt })),
      totalBooked: bookedSessions.length,
    };
  }
}
