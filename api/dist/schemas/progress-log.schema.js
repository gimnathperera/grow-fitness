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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressLogSchema = exports.ProgressLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProgressLog = class ProgressLog {
    sessionId;
    childId;
    notes;
    milestones;
};
exports.ProgressLog = ProgressLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Session' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProgressLog.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Child' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProgressLog.prototype, "childId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProgressLog.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ProgressLog.prototype, "milestones", void 0);
exports.ProgressLog = ProgressLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProgressLog);
exports.ProgressLogSchema = mongoose_1.SchemaFactory.createForClass(ProgressLog);
//# sourceMappingURL=progress-log.schema.js.map