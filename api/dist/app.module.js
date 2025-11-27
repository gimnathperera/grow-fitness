"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const jwt_strategy_1 = require("./modules/auth/jwt.strategy");
const users_module_1 = require("./modules/users/users.module");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const requests_module_1 = require("./modules/requests/requests.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const locations_module_1 = require("./modules/locations/locations.module");
const reports_module_1 = require("./modules/reports/reports.module");
const mailer_module_1 = require("./modules/mailer/mailer.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const children_module_1 = require("./modules/children/children.module");
const user_schema_1 = require("./schemas/user.schema");
const parent_profile_schema_1 = require("./schemas/parent-profile.schema");
const child_schema_1 = require("./schemas/child.schema");
const coach_profile_schema_1 = require("./schemas/coach-profile.schema");
const location_schema_1 = require("./schemas/location.schema");
const session_schema_1 = require("./schemas/session.schema");
const request_schema_1 = require("./schemas/request.schema");
const progress_log_schema_1 = require("./schemas/progress-log.schema");
const milestone_rule_schema_1 = require("./schemas/milestone-rule.schema");
const milestone_award_schema_1 = require("./schemas/milestone-award.schema");
const invoice_schema_1 = require("./schemas/invoice.schema");
const resource_schema_1 = require("./schemas/resource.schema");
const quiz_result_schema_1 = require("./schemas/quiz-result.schema");
const notification_schema_1 = require("./schemas/notification.schema");
const crm_event_schema_1 = require("./schemas/crm-event.schema");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env.local',
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI ||
                'mongodb://admin:password@localhost:27017/grow-fitness-admin?authSource=admin'),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            sessions_module_1.SessionsModule,
            requests_module_1.RequestsModule,
            invoices_module_1.InvoicesModule,
            locations_module_1.LocationsModule,
            reports_module_1.ReportsModule,
            mailer_module_1.MailerModule,
            scheduler_module_1.SchedulerModule,
            notifications_module_1.NotificationsModule,
            children_module_1.ChildrenModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: parent_profile_schema_1.ParentProfile.name, schema: parent_profile_schema_1.ParentProfileSchema },
                { name: child_schema_1.Child.name, schema: child_schema_1.ChildSchema },
                { name: coach_profile_schema_1.CoachProfile.name, schema: coach_profile_schema_1.CoachProfileSchema },
                { name: location_schema_1.Location.name, schema: location_schema_1.LocationSchema },
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: request_schema_1.Request.name, schema: request_schema_1.RequestSchema },
                { name: progress_log_schema_1.ProgressLog.name, schema: progress_log_schema_1.ProgressLogSchema },
                { name: milestone_rule_schema_1.MilestoneRule.name, schema: milestone_rule_schema_1.MilestoneRuleSchema },
                { name: milestone_award_schema_1.MilestoneAward.name, schema: milestone_award_schema_1.MilestoneAwardSchema },
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
                { name: resource_schema_1.Resource.name, schema: resource_schema_1.ResourceSchema },
                { name: quiz_result_schema_1.QuizResult.name, schema: quiz_result_schema_1.QuizResultSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                { name: crm_event_schema_1.CRMEvent.name, schema: crm_event_schema_1.CRMEventSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, jwt_strategy_1.JwtStrategy],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map