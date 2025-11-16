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
exports.UpdateChildDto = exports.CreateChildDto = exports.ChildDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ChildDto {
    id;
    parentId;
    name;
    birthDate;
    age;
    gender;
    location;
    goals = [];
    medicalCondition;
    isInSports = false;
    trainingPreference;
    createdAt;
    updatedAt;
}
exports.ChildDto = ChildDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The unique identifier of the child' }),
    __metadata("design:type", String)
], ChildDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the parent user' }),
    __metadata("design:type", String)
], ChildDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the child' }),
    __metadata("design:type", String)
], ChildDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The birth date of the child' }),
    __metadata("design:type", Date)
], ChildDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The age of the child', minimum: 0, maximum: 18 }),
    __metadata("design:type", Number)
], ChildDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['boy', 'girl'], description: 'The gender of the child' }),
    __metadata("design:type", String)
], ChildDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The location of the child' }),
    __metadata("design:type", String)
], ChildDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'List of goals for the child' }),
    __metadata("design:type", Array)
], ChildDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Any medical conditions the child has' }),
    __metadata("design:type", String)
], ChildDto.prototype, "medicalCondition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the child is involved in sports', default: false }),
    __metadata("design:type", Boolean)
], ChildDto.prototype, "isInSports", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['personal', 'group'], description: 'Preferred training type' }),
    __metadata("design:type", String)
], ChildDto.prototype, "trainingPreference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date when the child record was created' }),
    __metadata("design:type", Date)
], ChildDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date when the child record was last updated' }),
    __metadata("design:type", Date)
], ChildDto.prototype, "updatedAt", void 0);
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
    (0, swagger_1.ApiProperty)({ description: 'The name of the child' }),
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
    (0, swagger_1.ApiPropertyOptional)({ description: 'The age of the child', minimum: 0, maximum: 18 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(18),
    __metadata("design:type", Number)
], CreateChildDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['boy', 'girl'], description: 'The gender of the child' }),
    (0, class_validator_1.IsIn)(['boy', 'girl']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The location of the child' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'List of goals for the child' }),
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
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the child is involved in sports', default: false }),
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