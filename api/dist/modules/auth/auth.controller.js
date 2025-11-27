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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.LoginDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_parent_dto_1 = require("./dto/register-parent.dto");
const register_patient_dto_1 = require("./dto/register-patient.dto");
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async registerParent(registerDto) {
        console.log('🔑 [AuthController] Received parent registration request');
        console.log('📝 [AuthController] Request body:', JSON.stringify({
            ...registerDto,
            password: registerDto.password ? '[REDACTED]' : undefined,
            children: registerDto.children?.length || 0
        }, null, 2));
        try {
            console.log('🔄 [AuthController] Processing registration...');
            const { access_token, refresh_token, user } = await this.authService.registerParent(registerDto);
            console.log('✅ [AuthController] Parent registration successful');
            return {
                access_token,
                refresh_token,
                tokens: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                },
                user
            };
        }
        catch (error) {
            console.error('❌ [AuthController] Parent registration failed:', {
                error: error.message,
                stack: error.stack,
                email: registerDto?.email
            });
            const statusCode = error.message.includes('already in use')
                ? common_1.HttpStatus.CONFLICT
                : common_1.HttpStatus.BAD_REQUEST;
            throw new common_1.HttpException({
                status: statusCode,
                error: error.message,
                timestamp: new Date().toISOString(),
                path: '/auth/register/parent'
            }, statusCode);
        }
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.authService.login(user);
    }
    async registerPatient(registerDto) {
        const parentDto = {
            name: registerDto.name,
            email: registerDto.email,
            phone: registerDto.phone,
            password: registerDto.password,
            location: registerDto.location
        };
        return this.authService.registerParent(parentDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register/parent'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new parent' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Parent registered successfully',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        phone: { type: 'string' },
                        location: { type: 'string' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_parent_dto_1.RegisterParentDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerParent", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register/patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new patient' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_patient_dto_1.RegisterPatientDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerPatient", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map