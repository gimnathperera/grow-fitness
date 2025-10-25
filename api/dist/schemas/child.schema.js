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
exports.ChildSchema = exports.Child = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Child = class Child {
    parentId;
    name;
    age;
    medicalCondition;
    gender;
    goals;
};
exports.Child = Child;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Child.prototype, "parentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Child.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Child.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Child.prototype, "medicalCondition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['male', 'female', 'other'] }),
    __metadata("design:type", String)
], Child.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Child.prototype, "goals", void 0);
exports.Child = Child = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Child);
exports.ChildSchema = mongoose_1.SchemaFactory.createForClass(Child);
//# sourceMappingURL=child.schema.js.map