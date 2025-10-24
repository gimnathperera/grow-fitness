import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async findAll(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string, userId: string) {
    return this.notificationModel
      .findOneAndUpdate(
        { _id: id, userId },
        { readAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async create(notificationData: {
    userId: string;
    type: string;
    message: string;
    data?: any;
  }) {
    const notification = new this.notificationModel(notificationData);
    return notification.save();
  }
}
