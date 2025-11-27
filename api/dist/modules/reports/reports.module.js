"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
const session_schema_1 = require("../../schemas/session.schema");
const invoice_schema_1 = require("../../schemas/invoice.schema");
const user_schema_1 = require("../../schemas/user.schema");
const child_schema_1 = require("../../schemas/child.schema");
const milestone_award_schema_1 = require("../../schemas/milestone-award.schema");
const auth_module_1 = require("../auth/auth.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: child_schema_1.Child.name, schema: child_schema_1.ChildSchema },
                { name: milestone_award_schema_1.MilestoneAward.name, schema: milestone_award_schema_1.MilestoneAwardSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map