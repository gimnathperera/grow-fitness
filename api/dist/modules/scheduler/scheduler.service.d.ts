import { Model } from 'mongoose';
import { SessionDocument } from '../../schemas/session.schema';
import { RequestDocument } from '../../schemas/request.schema';
import { UserDocument } from '../../schemas/user.schema';
import { ChildDocument } from '../../schemas/child.schema';
import { MilestoneRuleDocument } from '../../schemas/milestone-rule.schema';
import { MilestoneAwardDocument } from '../../schemas/milestone-award.schema';
import { CRMEventDocument } from '../../schemas/crm-event.schema';
import { MailerService } from '../mailer/mailer.service';
export declare class SchedulerService {
    private sessionModel;
    private requestModel;
    private userModel;
    private childModel;
    private milestoneRuleModel;
    private milestoneAwardModel;
    private crmEventModel;
    private mailerService;
    constructor(sessionModel: Model<SessionDocument>, requestModel: Model<RequestDocument>, userModel: Model<UserDocument>, childModel: Model<ChildDocument>, milestoneRuleModel: Model<MilestoneRuleDocument>, milestoneAwardModel: Model<MilestoneAwardDocument>, crmEventModel: Model<CRMEventDocument>, mailerService: MailerService);
    handleReminderJob(): Promise<void>;
    handleDailyDigest(): Promise<void>;
    handleMilestoneAwards(): Promise<void>;
}
