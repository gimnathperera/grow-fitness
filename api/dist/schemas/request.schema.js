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
exports.RequestSchema = exports.Request = exports.RequestStatus = exports.RequestType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RequestType;
(function (RequestType) {
    RequestType["RESCHEDULE"] = "reschedule";
    RequestType["CANCEL"] = "cancel";
})(RequestType || (exports.RequestType = RequestType = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let Request = class Request {
    type;
    sessionId;
    requesterId;
    reason;
    isLate;
    status;
    adminNote;
    decidedAt;
};
exports.Request = Request;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RequestType }),
    __metadata("design:type", String)
], Request.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Session' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Request.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Request.prototype, "requesterId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Request.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Request.prototype, "isLate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RequestStatus, default: RequestStatus.PENDING }),
    __metadata("design:type", String)
], Request.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Request.prototype, "adminNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Request.prototype, "decidedAt", void 0);
exports.Request = Request = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Request);
exports.RequestSchema = mongoose_1.SchemaFactory.createForClass(Request);
exports.RequestSchema.index({ status: 1 });
exports.RequestSchema.index({ requesterId: 1 });
//# sourceMappingURL=request.schema.js.map