"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../../schemas/session.schema");
const request_schema_1 = require("../../schemas/request.schema");
const user_schema_1 = require("../../schemas/user.schema");
const child_schema_1 = require("../../schemas/child.schema");
const milestone_rule_schema_1 = require("../../schemas/milestone-rule.schema");
const milestone_award_schema_1 = require("../../schemas/milestone-award.schema");
const crm_event_schema_1 = require("../../schemas/crm-event.schema");
const mailer_service_1 = require("../mailer/mailer.service");
let SchedulerService = class SchedulerService {
    sessionModel;
    requestModel;
    userModel;
    childModel;
    milestoneRuleModel;
    milestoneAwardModel;
    crmEventModel;
    mailerService;
    constructor(sessionModel, requestModel, userModel, childModel, milestoneRuleModel, milestoneAwardModel, crmEventModel, mailerService) {
        this.sessionModel = sessionModel;
        this.requestModel = requestModel;
        this.userModel = userModel;
        this.childModel = childModel;
        this.milestoneRuleModel = milestoneRuleModel;
        this.milestoneAwardModel = milestoneAwardModel;
        this.crmEventModel = crmEventModel;
        this.mailerService = mailerService;
    }
    async handleReminderJob() {
        console.log('🔄 Running reminder job...');
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
        const sessions24h = await this.sessionModel
            .find({
            status: session_schema_1.SessionStatus.BOOKED,
            startAt: {
                $gte: new Date(in24Hours.getTime() - 5 * 60 * 1000),
                $lte: new Date(in24Hours.getTime() + 5 * 60 * 1000),
            },
        })
            .populate('childIds', 'name')
            .populate('locationId', 'label')
            .populate('coachId', 'name')
            .exec();
        const sessions1h = await this.sessionModel
            .find({
            status: session_schema_1.SessionStatus.BOOKED,
            startAt: {
                $gte: new Date(in1Hour.getTime() - 5 * 60 * 1000),
                $lte: new Date(in1Hour.getTime() + 5 * 60 * 1000),
            },
        })
            .populate('childIds', 'name')
            .populate('locationId', 'label')
            .populate('coachId', 'name')
            .exec();
        for (const session of sessions24h) {
            if (!session.remindersSent.includes('24h')) {
                const parentEmail = 'parent@example.com';
                await this.mailerService.sendSessionReminder(parentEmail, session.childIds[0]?.name || 'Child', session.startAt, session.startAt.toLocaleTimeString(), session.locationId?.label || 'Location', '24h');
                await this.sessionModel
                    .findByIdAndUpdate(session._id, {
                    $push: { remindersSent: '24h' },
                })
                    .exec();
            }
        }
        for (const session of sessions1h) {
            if (!session.remindersSent.includes('1h')) {
                const parentEmail = 'parent@example.com';
                await this.mailerService.sendSessionReminder(parentEmail, session.childIds[0]?.name || 'Child', session.startAt, session.startAt.toLocaleTimeString(), session.locationId?.label || 'Location', '1h');
                await this.sessionModel
                    .findByIdAndUpdate(session._id, {
                    $push: { remindersSent: '1h' },
                })
                    .exec();
            }
        }
        console.log(`✅ Sent ${sessions24h.length} 24h reminders and ${sessions1h.length} 1h reminders`);
    }
    async handleDailyDigest() {
        console.log('📧 Sending daily digest...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaySessions = await this.sessionModel
            .find({
            status: session_schema_1.SessionStatus.BOOKED,
            startAt: { $gte: today, $lt: tomorrow },
        })
            .populate('childIds', 'name')
            .populate('locationId', 'label')
            .populate('coachId', 'name')
            .exec();
        const pendingRequests = await this.requestModel
            .find({ status: 'pending' })
            .populate('sessionId')
            .populate('requesterId', 'name')
            .exec();
        const adminsAndCoaches = await this.userModel
            .find({ role: { $in: [user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.COACH] } })
            .exec();
        for (const user of adminsAndCoaches) {
            await this.mailerService.sendDailyDigest(user.email, todaySessions.map((s) => ({
                time: s.startAt.toLocaleTimeString(),
                children: s.childIds.map((c) => c.name).join(', '),
                location: s.locationId?.label,
            })), pendingRequests.map((r) => ({
                type: r.type,
                session: r.sessionId?.startAt?.toLocaleDateString(),
                requester: r.requesterId?.name,
            })), user.role);
        }
        console.log(`✅ Sent daily digest to ${adminsAndCoaches.length} users`);
    }
    async handleMilestoneAwards() {
        console.log('🏆 Processing milestone awards...');
        const activeRules = await this.milestoneRuleModel
            .find({ isActive: true })
            .exec();
        const children = await this.childModel.find().exec();
        for (const child of children) {
            for (const rule of activeRules) {
                const existingAward = await this.milestoneAwardModel
                    .findOne({ childId: child._id, ruleId: rule._id })
                    .exec();
                if (existingAward)
                    continue;
                let shouldAward = false;
                if (rule.conditionJSON.type === 'session_count') {
                    const sessionCount = await this.sessionModel
                        .countDocuments({
                        childIds: child._id,
                        status: session_schema_1.SessionStatus.COMPLETED,
                    })
                        .exec();
                    shouldAward = sessionCount >= rule.conditionJSON.threshold;
                }
                if (shouldAward) {
                    const award = new this.milestoneAwardModel({
                        childId: child._id,
                        ruleId: rule._id,
                        awardedAt: new Date(),
                        artifactUrl: `/certificates/${child._id}-${rule._id}.pdf`,
                    });
                    await award.save();
                    await this.crmEventModel.create({
                        actorId: new mongoose_2.Types.ObjectId(),
                        subjectId: child._id,
                        kind: 'milestone_awarded',
                        payload: {
                            milestoneName: rule.name,
                            childName: child.name,
                            awardedAt: award.awardedAt,
                        },
                    });
                    const parent = await this.userModel.findById(child.parentId).exec();
                    if (parent) {
                        await this.mailerService.sendMilestoneCongratulations(parent.email, child.name, rule.name, award.awardedAt);
                    }
                }
            }
        }
        console.log('✅ Processed milestone awards');
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleReminderJob", null);
__decorate([
    (0, schedule_1.Cron)('0 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleDailyDigest", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleMilestoneAwards", null);
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(1, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(child_schema_1.Child.name)),
    __param(4, (0, mongoose_1.InjectModel)(milestone_rule_schema_1.MilestoneRule.name)),
    __param(5, (0, mongoose_1.InjectModel)(milestone_award_schema_1.MilestoneAward.name)),
    __param(6, (0, mongoose_1.InjectModel)(crm_event_schema_1.CRMEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mailer_service_1.MailerService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map