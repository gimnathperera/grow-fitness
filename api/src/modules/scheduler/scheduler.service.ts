import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Session,
  SessionDocument,
  SessionStatus,
} from '../../schemas/session.schema';
import { Request, RequestDocument } from '../../schemas/request.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Child, ChildDocument } from '../../schemas/child.schema';
import {
  MilestoneRule,
  MilestoneRuleDocument,
} from '../../schemas/milestone-rule.schema';
import {
  MilestoneAward,
  MilestoneAwardDocument,
} from '../../schemas/milestone-award.schema';
import { CRMEvent, CRMEventDocument } from '../../schemas/crm-event.schema';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
    @InjectModel(MilestoneRule.name)
    private milestoneRuleModel: Model<MilestoneRuleDocument>,
    @InjectModel(MilestoneAward.name)
    private milestoneAwardModel: Model<MilestoneAwardDocument>,
    @InjectModel(CRMEvent.name) private crmEventModel: Model<CRMEventDocument>,
    private mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleReminderJob() {
    console.log('🔄 Running reminder job...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    // Find sessions in next 24 hours
    const sessions24h = await this.sessionModel
      .find({
        status: SessionStatus.BOOKED,
        startAt: {
          $gte: new Date(in24Hours.getTime() - 5 * 60 * 1000), // 5 minutes buffer
          $lte: new Date(in24Hours.getTime() + 5 * 60 * 1000),
        },
      })
      .populate('childIds', 'name')
      .populate('locationId', 'label')
      .populate('coachId', 'name')
      .exec();

    // Find sessions in next 1 hour
    const sessions1h = await this.sessionModel
      .find({
        status: SessionStatus.BOOKED,
        startAt: {
          $gte: new Date(in1Hour.getTime() - 5 * 60 * 1000),
          $lte: new Date(in1Hour.getTime() + 5 * 60 * 1000),
        },
      })
      .populate('childIds', 'name')
      .populate('locationId', 'label')
      .populate('coachId', 'name')
      .exec();

    // Send 24h reminders
    for (const session of sessions24h) {
      if (!session.remindersSent.includes('24h')) {
        // Get parent email (simplified - in real app, you'd get from parent profile)
        const parentEmail = 'parent@example.com'; // This should be fetched from parent profile

        await this.mailerService.sendSessionReminder(
          parentEmail,
          (session.childIds[0] as any)?.name || 'Child',
          session.startAt,
          session.startAt.toLocaleTimeString(),
          (session.locationId as any)?.label || 'Location',
          '24h',
        );

        // Mark reminder as sent
        await this.sessionModel
          .findByIdAndUpdate(session._id, {
            $push: { remindersSent: '24h' },
          })
          .exec();
      }
    }

    // Send 1h reminders
    for (const session of sessions1h) {
      if (!session.remindersSent.includes('1h')) {
        const parentEmail = 'parent@example.com';

        await this.mailerService.sendSessionReminder(
          parentEmail,
          (session.childIds[0] as any)?.name || 'Child',
          session.startAt,
          session.startAt.toLocaleTimeString(),
          (session.locationId as any)?.label || 'Location',
          '1h',
        );

        await this.sessionModel
          .findByIdAndUpdate(session._id, {
            $push: { remindersSent: '1h' },
          })
          .exec();
      }
    }

    console.log(
      `✅ Sent ${sessions24h.length} 24h reminders and ${sessions1h.length} 1h reminders`,
    );
  }

  @Cron('0 6 * * *') // 06:00 Asia/Colombo
  async handleDailyDigest() {
    console.log('📧 Sending daily digest...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's sessions
    const todaySessions = await this.sessionModel
      .find({
        status: SessionStatus.BOOKED,
        startAt: { $gte: today, $lt: tomorrow },
      })
      .populate('childIds', 'name')
      .populate('locationId', 'label')
      .populate('coachId', 'name')
      .exec();

    // Get pending requests
    const pendingRequests = await this.requestModel
      .find({ status: 'pending' })
      .populate('sessionId')
      .populate('requesterId', 'name')
      .exec();

    // Get all admins and coaches
    const adminsAndCoaches = await this.userModel
      .find({ role: { $in: [UserRole.ADMIN, UserRole.COACH] } })
      .exec();

    // Send digest to each admin and coach
    for (const user of adminsAndCoaches) {
      await this.mailerService.sendDailyDigest(
        user.email,
        todaySessions.map((s) => ({
          time: s.startAt.toLocaleTimeString(),
          children: s.childIds.map((c) => (c as any).name).join(', '),
          location: (s.locationId as any)?.label,
        })),
        pendingRequests.map((r) => ({
          type: r.type,
          session: (r.sessionId as any)?.startAt?.toLocaleDateString(),
          requester: (r.requesterId as any)?.name,
        })),
        user.role as any,
      );
    }

    console.log(`✅ Sent daily digest to ${adminsAndCoaches.length} users`);
  }

  @Cron('0 0 * * *') // Midnight Asia/Colombo
  async handleMilestoneAwards() {
    console.log('🏆 Processing milestone awards...');

    const activeRules = await this.milestoneRuleModel
      .find({ isActive: true })
      .exec();
    const children = await this.childModel.find().exec();

    for (const child of children) {
      for (const rule of activeRules) {
        // Check if child already has this award
        const existingAward = await this.milestoneAwardModel
          .findOne({ childId: child._id, ruleId: rule._id })
          .exec();

        if (existingAward) continue;

        // Evaluate rule (simplified - in real app, you'd have complex logic)
        let shouldAward = false;

        if (rule.conditionJSON.type === 'session_count') {
          const sessionCount = await this.sessionModel
            .countDocuments({
              childIds: child._id,
              status: SessionStatus.COMPLETED,
            })
            .exec();

          shouldAward = sessionCount >= rule.conditionJSON.threshold;
        }

        if (shouldAward) {
          // Create milestone award
          const award = new this.milestoneAwardModel({
            childId: child._id,
            ruleId: rule._id,
            awardedAt: new Date(),
            artifactUrl: `/certificates/${child._id}-${rule._id}.pdf`, // Generated certificate URL
          });
          await award.save();

          // Log CRM event
          await this.crmEventModel.create({
            actorId: new Types.ObjectId(), // System actor
            subjectId: child._id,
            kind: 'milestone_awarded',
            payload: {
              milestoneName: rule.name,
              childName: child.name,
              awardedAt: award.awardedAt,
            },
          });

          // Send congratulatory email to parent
          const parent = await this.userModel.findById(child.parentId).exec();
          if (parent) {
            await this.mailerService.sendMilestoneCongratulations(
              parent.email,
              child.name,
              rule.name,
              award.awardedAt,
            );
          }
        }
      }
    }

    console.log('✅ Processed milestone awards');
  }
}
