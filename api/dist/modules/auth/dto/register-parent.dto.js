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
exports.RegisterParentDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterParentDto {
    name;
    email;
    phone;
    password;
    location;
}
exports.RegisterParentDto = RegisterParentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Name must be at least 2 characters long' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterParentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterParentDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[+]?[1-9][\d]{7,14}$/, {
        message: 'Please enter a valid phone number',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterParentDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterParentDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterParentDto.prototype, "location", void 0);
//# sourceMappingURL=register-parent.dto.js.map