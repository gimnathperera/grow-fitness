import { Model } from 'mongoose';
import { Request, RequestDocument, RequestStatus } from '../../schemas/request.schema';
import { SessionDocument } from '../../schemas/session.schema';
import { CRMEventDocument } from '../../schemas/crm-event.schema';
export declare class RequestsService {
    private requestModel;
    private sessionModel;
    private crmEventModel;
    constructor(requestModel: Model<RequestDocument>, sessionModel: Model<SessionDocument>, crmEventModel: Model<CRMEventDocument>);
    findAll(status?: RequestStatus): Promise<Request[]>;
    findOne(id: string): Promise<Request | null>;
    approve(id: string, adminId: string, newSlot?: {
        startAt: Date;
        endAt: Date;
    }, adminNote?: string): Promise<Request | null>;
    reject(id: string, adminId: string, reason: string): Promise<Request | null>;
    checkLateRequest(sessionId: string): Promise<boolean>;
}
