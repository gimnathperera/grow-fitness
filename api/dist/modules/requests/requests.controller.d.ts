import { RequestsService } from './requests.service';
import { RequestStatus } from '../../schemas/request.schema';
export declare class ApproveRequestDto {
    newSlot?: {
        startAt: Date;
        endAt: Date;
    };
    adminNote?: string;
}
export declare class RejectRequestDto {
    reason: string;
}
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    findAll(status?: RequestStatus): Promise<import("../../schemas/request.schema").Request[]>;
    findOne(id: string): Promise<import("../../schemas/request.schema").Request | null>;
    approve(id: string, approveRequestDto: ApproveRequestDto, req: any): Promise<import("../../schemas/request.schema").Request | null>;
    reject(id: string, rejectRequestDto: RejectRequestDto, req: any): Promise<import("../../schemas/request.schema").Request | null>;
}
