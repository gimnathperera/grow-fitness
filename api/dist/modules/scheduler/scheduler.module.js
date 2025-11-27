"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const scheduler_service_1 = require("./scheduler.service");
const session_schema_1 = require("../../schemas/session.schema");
const request_schema_1 = require("../../schemas/request.schema");
const user_schema_1 = require("../../schemas/user.schema");
const child_schema_1 = require("../../schemas/child.schema");
const milestone_rule_schema_1 = require("../../schemas/milestone-rule.schema");
const milestone_award_schema_1 = require("../../schemas/milestone-award.schema");
const crm_event_schema_1 = require("../../schemas/crm-event.schema");
const mailer_module_1 = require("../mailer/mailer.module");
let SchedulerModule = class SchedulerModule {
};
exports.SchedulerModule = SchedulerModule;
exports.SchedulerModule = SchedulerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: request_schema_1.Request.name, schema: request_schema_1.RequestSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: child_schema_1.Child.name, schema: child_schema_1.ChildSchema },
                { name: milestone_rule_schema_1.MilestoneRule.name, schema: milestone_rule_schema_1.MilestoneRuleSchema },
                { name: milestone_award_schema_1.MilestoneAward.name, schema: milestone_award_schema_1.MilestoneAwardSchema },
                { name: crm_event_schema_1.CRMEvent.name, schema: crm_event_schema_1.CRMEventSchema },
            ]),
            mailer_module_1.MailerModule,
        ],
        providers: [scheduler_service_1.SchedulerService],
    })
], SchedulerModule);
//# sourceMappingURL=scheduler.module.js.map