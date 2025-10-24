import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { RequestsModule } from './modules/requests/requests.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChildrenModule } from './modules/children/children.module';

// Import all schemas
import { User, UserSchema } from './schemas/user.schema';
import {
  ParentProfile,
  ParentProfileSchema,
} from './schemas/parent-profile.schema';
import { Child, ChildSchema } from './schemas/child.schema';
import {
  CoachProfile,
  CoachProfileSchema,
} from './schemas/coach-profile.schema';
import { Location, LocationSchema } from './schemas/location.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { Request, RequestSchema } from './schemas/request.schema';
import { ProgressLog, ProgressLogSchema } from './schemas/progress-log.schema';
import {
  MilestoneRule,
  MilestoneRuleSchema,
} from './schemas/milestone-rule.schema';
import {
  MilestoneAward,
  MilestoneAwardSchema,
} from './schemas/milestone-award.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { QuizResult, QuizResultSchema } from './schemas/quiz-result.schema';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { CRMEvent, CRMEventSchema } from './schemas/crm-event.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://admin:password@localhost:27017/grow-fitness-admin?authSource=admin',
    ),
    AuthModule,
    UsersModule,
    SessionsModule,
    RequestsModule,
    InvoicesModule,
    LocationsModule,
    ReportsModule,
    MailerModule,
    SchedulerModule,
    NotificationsModule,
    ChildrenModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ParentProfile.name, schema: ParentProfileSchema },
      { name: Child.name, schema: ChildSchema },
      { name: CoachProfile.name, schema: CoachProfileSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Request.name, schema: RequestSchema },
      { name: ProgressLog.name, schema: ProgressLogSchema },
      { name: MilestoneRule.name, schema: MilestoneRuleSchema },
      { name: MilestoneAward.name, schema: MilestoneAwardSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Resource.name, schema: ResourceSchema },
      { name: QuizResult.name, schema: QuizResultSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: CRMEvent.name, schema: CRMEventSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
