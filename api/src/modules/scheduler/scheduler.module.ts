import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerService } from './scheduler.service';
import { Session, SessionSchema } from '../../schemas/session.schema';
import { Request, RequestSchema } from '../../schemas/request.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Child, ChildSchema } from '../../schemas/child.schema';
import {
  MilestoneRule,
  MilestoneRuleSchema,
} from '../../schemas/milestone-rule.schema';
import {
  MilestoneAward,
  MilestoneAwardSchema,
} from '../../schemas/milestone-award.schema';
import { CRMEvent, CRMEventSchema } from '../../schemas/crm-event.schema';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Request.name, schema: RequestSchema },
      { name: User.name, schema: UserSchema },
      { name: Child.name, schema: ChildSchema },
      { name: MilestoneRule.name, schema: MilestoneRuleSchema },
      { name: MilestoneAward.name, schema: MilestoneAwardSchema },
      { name: CRMEvent.name, schema: CRMEventSchema },
    ]),
    MailerModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}

