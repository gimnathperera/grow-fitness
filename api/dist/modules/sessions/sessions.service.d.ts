import { Model } from 'mongoose';
import { Session, SessionDocument, SessionType, SessionStatus } from '../../schemas/session.schema';
import { ChildDocument } from '../../schemas/child.schema';
export interface CreateSessionDto {
    clientId: string;
    coachId: string;
    kidId?: string;
    startsAt: string;
    endsAt: string;
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
export declare class SessionsService {
    private sessionModel;
    private readonly childModel;
    private readonly logger;
    constructor(sessionModel: Model<SessionDocument>, childModel: Model<ChildDocument>);
    create(createSessionDto: CreateSessionDto): Promise<Session>;
    findAll(filters: SessionsQueryParams, userRole?: string, userId?: string): Promise<{
        sessions: Session[];
        total: number;
        pagination: any;
    }>;
    getUpcomingSessions(limit?: number, userId?: string, userRole?: string): Promise<Session[]>;
    getUpcomingByKid(kidId: string, limit?: number, userId?: string, userRole?: string): Promise<Session[]>;
    checkConflicts(coachId: string, childIds: string[], startAt: Date, endAt: Date): Promise<string[]>;
    findOne(id: string): Promise<Session | null>;
    validateParentAccess(sessionId: string, parentId: string): Promise<boolean>;
    update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session | null>;
    remove(id: string): Promise<Session | null>;
    checkAvailability(coachId: string, location?: string): Promise<any>;
}
