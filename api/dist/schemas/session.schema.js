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
exports.SessionSchema = exports.Session = exports.SessionStatus = exports.SessionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var SessionType;
(function (SessionType) {
    SessionType["INDIVIDUAL"] = "individual";
    SessionType["GROUP"] = "group";
    SessionType["TRAINING"] = "TRAINING";
})(SessionType || (exports.SessionType = SessionType = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["BOOKED"] = "booked";
    SessionStatus["CANCELED"] = "canceled";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["CONFIRMED"] = "CONFIRMED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
let Session = class Session {
    type;
    coachId;
    childIds;
    locationId;
    startAt;
    endAt;
    status;
    remindersSent;
};
exports.Session = Session;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: SessionType }),
    __metadata("design:type", String)
], Session.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Session.prototype, "coachId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Child' }], required: true }),
    __metadata("design:type", Array)
], Session.prototype, "childIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Location' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Session.prototype, "locationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Session.prototype, "startAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Session.prototype, "endAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: SessionStatus, default: SessionStatus.BOOKED }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Session.prototype, "remindersSent", void 0);
exports.Session = Session = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Session);
exports.SessionSchema = mongoose_1.SchemaFactory.createForClass(Session);
exports.SessionSchema.index({ coachId: 1, startAt: 1 });
exports.SessionSchema.index({ childIds: 1, startAt: 1 });
//# sourceMappingURL=session.schema.js.map