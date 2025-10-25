import { SessionsService } from './sessions.service';
import { SessionType, SessionStatus } from '../../schemas/session.schema';
export declare class CreateSessionDto {
    type: SessionType;
    coachId: string;
    childIds: string[];
    locationId: string;
    startAt: Date;
    endAt: Date;
}
export declare class UpdateSessionDto {
    type?: SessionType;
    coachId?: string;
    childIds?: string[];
    locationId?: string;
    startAt?: Date;
    endAt?: Date;
    status?: SessionStatus;
}
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(createSessionDto: CreateSessionDto): Promise<import("../../schemas/session.schema").Session>;
    findAll(coachId?: string, childId?: string, startDate?: string, endDate?: string, status?: SessionStatus): Promise<import("../../schemas/session.schema").Session[]>;
    findOne(id: string): Promise<import("../../schemas/session.schema").Session | null>;
    update(id: string, updateSessionDto: UpdateSessionDto): Promise<import("../../schemas/session.schema").Session | null>;
    remove(id: string): Promise<import("../../schemas/session.schema").Session | null>;
}
