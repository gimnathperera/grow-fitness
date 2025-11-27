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
exports.QuizResultSchema = exports.QuizResult = exports.OwnerType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var OwnerType;
(function (OwnerType) {
    OwnerType["PARENT"] = "parent";
    OwnerType["COACH"] = "coach";
})(OwnerType || (exports.OwnerType = OwnerType = {}));
let QuizResult = class QuizResult {
    ownerType;
    ownerId;
    type;
    score;
};
exports.QuizResult = QuizResult;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: OwnerType }),
    __metadata("design:type", String)
], QuizResult.prototype, "ownerType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], QuizResult.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], QuizResult.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], QuizResult.prototype, "score", void 0);
exports.QuizResult = QuizResult = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], QuizResult);
exports.QuizResultSchema = mongoose_1.SchemaFactory.createForClass(QuizResult);
//# sourceMappingURL=quiz-result.schema.js.map