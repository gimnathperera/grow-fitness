import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markAsRead(id: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    create(notificationData: {
        userId: string;
        type: string;
        message: string;
        data?: any;
    }): Promise<import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
