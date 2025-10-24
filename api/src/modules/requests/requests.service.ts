import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Request,
  RequestDocument,
  RequestType,
  RequestStatus,
} from '../../schemas/request.schema';
import {
  Session,
  SessionDocument,
  SessionStatus,
} from '../../schemas/session.schema';
import { CRMEvent, CRMEventDocument } from '../../schemas/crm-event.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(CRMEvent.name) private crmEventModel: Model<CRMEventDocument>,
  ) {}

  async findAll(status?: RequestStatus): Promise<Request[]> {
    const filter = status ? { status } : {};
    return this.requestModel
      .find(filter)
      .populate('sessionId')
      .populate('requesterId', 'name email')
      .exec();
  }

  async findOne(id: string): Promise<Request | null> {
    return this.requestModel
      .findById(id)
      .populate('sessionId')
      .populate('requesterId', 'name email')
      .exec();
  }

  async approve(
    id: string,
    adminId: string,
    newSlot?: { startAt: Date; endAt: Date },
    adminNote?: string,
  ): Promise<Request | null> {
    const request = await this.requestModel.findById(id).exec();
    if (!request) {
      throw new Error('Request not found');
    }

    const session = await this.sessionModel.findById(request.sessionId).exec();
    if (!session) {
      throw new Error('Session not found');
    }

    if (request.type === RequestType.RESCHEDULE && newSlot) {
      // Update session with new slot
      await this.sessionModel
        .findByIdAndUpdate(request.sessionId, {
          startAt: newSlot.startAt,
          endAt: newSlot.endAt,
        })
        .exec();

      // Log CRM event
      await this.crmEventModel.create({
        actorId: new Types.ObjectId(adminId),
        subjectId: request.sessionId,
        kind: 'session_rescheduled',
        payload: {
          oldStartAt: session.startAt,
          oldEndAt: session.endAt,
          newStartAt: newSlot.startAt,
          newEndAt: newSlot.endAt,
          reason: request.reason,
        },
      });
    } else if (request.type === RequestType.CANCEL) {
      // Cancel session
      await this.sessionModel
        .findByIdAndUpdate(request.sessionId, {
          status: SessionStatus.CANCELED,
        })
        .exec();

      // Log CRM event
      await this.crmEventModel.create({
        actorId: new Types.ObjectId(adminId),
        subjectId: request.sessionId,
        kind: 'session_canceled',
        payload: {
          reason: request.reason,
          isLate: request.isLate,
        },
      });
    }

    // Update request status
    const updatedRequest = await this.requestModel
      .findByIdAndUpdate(
        id,
        {
          status: RequestStatus.APPROVED,
          adminNote,
          decidedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    return updatedRequest;
  }

  async reject(
    id: string,
    adminId: string,
    reason: string,
  ): Promise<Request | null> {
    const request = await this.requestModel
      .findByIdAndUpdate(
        id,
        {
          status: RequestStatus.REJECTED,
          adminNote: reason,
          decidedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!request) {
      throw new Error('Request not found');
    }

    // Log CRM event
    await this.crmEventModel.create({
      actorId: new Types.ObjectId(adminId),
      subjectId: request.sessionId,
      kind: 'request_rejected',
      payload: {
        requestType: request.type,
        reason: request.reason,
        adminReason: reason,
        isLate: request.isLate,
      },
    });

    return request;
  }

  async checkLateRequest(sessionId: string): Promise<boolean> {
    const session = await this.sessionModel.findById(sessionId).exec();
    if (!session) return false;

    const now = new Date();
    const sessionStart = new Date(session.startAt);
    const hoursUntilSession =
      (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilSession < 12;
  }
}
