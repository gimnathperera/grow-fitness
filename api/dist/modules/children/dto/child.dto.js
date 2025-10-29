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
exports.UpdateChildDto = exports.CreateChildDto = void 0;
const class_validator_1 = require("class-validator");
class CreateChildDto {
    parentId;
    name;
    birthDate;
    age;
    gender;
    location;
    goals = [];
    medicalCondition;
    isInSports = false;
    preferredTrainingStyle = 'group';
    trainingPreference;
}
exports.CreateChildDto = CreateChildDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateChildDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(18),
    __metadata("design:type", Number)
], CreateChildDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['boy', 'girl']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateChildDto.prototype, "goals", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "medicalCondition", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChildDto.prototype, "isInSports", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['personal', 'group']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "preferredTrainingStyle", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['personal', 'group']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "trainingPreference", void 0);
class UpdateChildDto {
    parentId;
    name;
    birthDate;
    gender;
    location;
    goals;
    medicalCondition;
    isInSports;
    trainingPreference;
}
exports.UpdateChildDto = UpdateChildDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateChildDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['boy', 'girl']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateChildDto.prototype, "goals", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildDto.prototype, "medicalCondition", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateChildDto.prototype, "isInSports", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['personal', 'group']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildDto.prototype, "trainingPreference", void 0);
//# sourceMappingURL=child.dto.js.map