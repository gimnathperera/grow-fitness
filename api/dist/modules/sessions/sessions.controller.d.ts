import * as sessionsService_1 from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    private readonly logger;
    constructor(sessionsService: sessionsService_1.SessionsService);
    create(createSessionDto: sessionsService_1.CreateSessionDto, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../schemas/session.schema").Session;
    }>;
    findAll(queryParams: sessionsService_1.SessionsQueryParams, user: any): Promise<{
        success: boolean;
        message: string;
        data: {
            sessions: import("../../schemas/session.schema").Session[];
            total: number;
            pagination: any;
        };
    }>;
    getUpcomingSessions(limit: string, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../schemas/session.schema").Session[];
    }>;
    getUpcomingByKid(kidId: string, limit: string, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../schemas/session.schema").Session[];
    }>;
    checkAvailability(coachId: string, location: string, user: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findOne(id: string, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../schemas/session.schema").Session;
    }>;
    update(id: string, updateSessionDto: sessionsService_1.UpdateSessionDto, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../schemas/session.schema").Session | null;
    }>;
    remove(id: string, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../schemas/session.schema").Session | null;
    }>;
}
