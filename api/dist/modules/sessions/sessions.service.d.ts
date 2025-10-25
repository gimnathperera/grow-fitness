import { Model } from 'mongoose';
import { Session, SessionDocument, SessionType, SessionStatus } from '../../schemas/session.schema';
export declare class SessionsService {
    private sessionModel;
    constructor(sessionModel: Model<SessionDocument>);
    create(createSessionDto: {
        type: SessionType;
        coachId: string;
        childIds: string[];
        locationId: string;
        startAt: Date;
        endAt: Date;
    }): Promise<Session>;
    findAll(filters?: {
        coachId?: string;
        childId?: string;
        startDate?: Date;
        endDate?: Date;
        status?: SessionStatus;
    }): Promise<Session[]>;
    findOne(id: string): Promise<Session | null>;
    update(id: string, updateSessionDto: {
        type?: SessionType;
        coachId?: string;
        childIds?: string[];
        locationId?: string;
        startAt?: Date;
        endAt?: Date;
        status?: SessionStatus;
    }): Promise<Session | null>;
    remove(id: string): Promise<Session | null>;
    checkConflicts(coachId: string, childIds: string[], startAt: Date, endAt: Date): Promise<string[]>;
}
