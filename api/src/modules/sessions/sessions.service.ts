import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Session,
  SessionDocument,
  SessionType,
  SessionStatus,
} from '../../schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async create(createSessionDto: {
    type: SessionType;
    coachId: string;
    childIds: string[];
    locationId: string;
    startAt: Date;
    endAt: Date;
  }): Promise<Session> {
    // Check for conflicts
    const conflicts = await this.checkConflicts(
      createSessionDto.coachId,
      createSessionDto.childIds,
      createSessionDto.startAt,
      createSessionDto.endAt,
    );

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `Conflicts detected: ${conflicts.join(', ')}`,
      );
    }

    const session = new this.sessionModel({
      ...createSessionDto,
      coachId: new Types.ObjectId(createSessionDto.coachId),
      childIds: createSessionDto.childIds.map((id) => new Types.ObjectId(id)),
      locationId: new Types.ObjectId(createSessionDto.locationId),
    });

    return session.save();
  }

  async findAll(filters?: {
    coachId?: string;
    childId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: SessionStatus;
  }): Promise<Session[]> {
    const query: any = {};

    if (filters?.coachId) {
      query.coachId = new Types.ObjectId(filters.coachId);
    }

    if (filters?.childId) {
      query.childIds = new Types.ObjectId(filters.childId);
    }

    if (filters?.startDate || filters?.endDate) {
      query.startAt = {};
      if (filters.startDate) {
        query.startAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.startAt.$lte = filters.endDate;
      }
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    return this.sessionModel
      .find(query)
      .populate('coachId', 'name email')
      .populate('childIds', 'name')
      .populate('locationId', 'label')
      .exec();
  }

  async findOne(id: string): Promise<Session | null> {
    return this.sessionModel
      .findById(id)
      .populate('coachId', 'name email')
      .populate('childIds', 'name')
      .populate('locationId', 'label')
      .exec();
  }

  async update(
    id: string,
    updateSessionDto: {
      type?: SessionType;
      coachId?: string;
      childIds?: string[];
      locationId?: string;
      startAt?: Date;
      endAt?: Date;
      status?: SessionStatus;
    },
  ): Promise<Session | null> {
    const updateData: any = { ...updateSessionDto };

    if (updateSessionDto.coachId) {
      updateData.coachId = new Types.ObjectId(updateSessionDto.coachId);
    }

    if (updateSessionDto.childIds) {
      updateData.childIds = updateSessionDto.childIds.map(
        (id) => new Types.ObjectId(id),
      );
    }

    if (updateSessionDto.locationId) {
      updateData.locationId = new Types.ObjectId(updateSessionDto.locationId);
    }

    return this.sessionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('coachId', 'name email')
      .populate('childIds', 'name')
      .populate('locationId', 'label')
      .exec();
  }

  async remove(id: string): Promise<Session | null> {
    return this.sessionModel.findByIdAndDelete(id).exec();
  }

  async checkConflicts(
    coachId: string,
    childIds: string[],
    startAt: Date,
    endAt: Date,
  ): Promise<string[]> {
    const conflicts: string[] = [];

    // Check coach conflicts
    const coachConflicts = await this.sessionModel
      .find({
        coachId: new Types.ObjectId(coachId),
        status: SessionStatus.BOOKED,
        $or: [
          {
            startAt: { $lt: endAt },
            endAt: { $gt: startAt },
          },
        ],
      })
      .exec();

    if (coachConflicts.length > 0) {
      conflicts.push(`Coach has conflicting sessions`);
    }

    // Check child conflicts
    for (const childId of childIds) {
      const childConflicts = await this.sessionModel
        .find({
          childIds: new Types.ObjectId(childId),
          status: SessionStatus.BOOKED,
          $or: [
            {
              startAt: { $lt: endAt },
              endAt: { $gt: startAt },
            },
          ],
        })
        .exec();

      if (childConflicts.length > 0) {
        conflicts.push(`Child ${childId} has conflicting sessions`);
      }
    }

    return conflicts;
  }
}
