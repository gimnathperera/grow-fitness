"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("../../schemas/user.schema");
const child_schema_1 = require("../../schemas/child.schema");
let AuthService = class AuthService {
    userModel;
    childModel;
    jwtService;
    constructor(userModel, childModel, jwtService) {
        this.userModel = userModel;
        this.childModel = childModel;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).exec();
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const { passwordHash, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async registerParent(registerDto) {
        console.log('🔍 [AuthService] Registering parent with data:', JSON.stringify({
            ...registerDto,
            password: registerDto.password ? '[REDACTED]' : undefined,
            children: registerDto.children?.length || 0
        }, null, 2));
        try {
            console.log('🔍 [AuthService] Checking for existing user with email:', registerDto.email);
            const existingUser = await this.userModel.findOne({ email: registerDto.email }).exec();
            if (existingUser) {
                console.warn('⚠️ [AuthService] Registration failed - Email already in use:', registerDto.email);
                throw new Error('Email already in use');
            }
            console.log('🔧 [AuthService] Creating new user...');
            const newUser = await this.createUser({
                email: registerDto.email,
                name: registerDto.name,
                password: registerDto.password,
                role: user_schema_1.UserRole.PARENT,
                phone: registerDto.phone,
                location: registerDto.location
            });
            console.log('✅ [AuthService] User created successfully:', {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            });
            const { passwordHash, ...userWithoutPassword } = newUser.toObject();
            if (registerDto.children && registerDto.children.length > 0) {
                console.log(`👶 [AuthService] Processing ${registerDto.children.length} children...`);
                const childrenWithParent = registerDto.children.map((child, index) => {
                    const childData = {
                        ...child,
                        parentId: newUser._id,
                        goals: child.goals || [],
                        isInSports: child.isInSports || false,
                        preferredTrainingStyle: child.preferredTrainingStyle || 'group'
                    };
                    console.log(`  🧒 [Child ${index + 1}] Prepared child data:`, JSON.stringify(childData, null, 2));
                    return childData;
                });
                try {
                    console.log('📝 [AuthService] Saving children to database...');
                    const savedChildren = await this.childModel.insertMany(childrenWithParent);
                    console.log(`✅ [AuthService] Successfully saved ${savedChildren.length} children`);
                }
                catch (error) {
                    console.error('❌ [AuthService] Error saving children:', error);
                    throw new Error(`Failed to save children: ${error.message}`);
                }
            }
            else {
                console.log('ℹ️ [AuthService] No children provided for registration');
            }
            console.log('🔑 [AuthService] Generating JWT token...');
            const payload = {
                email: newUser.email,
                sub: newUser._id,
                role: newUser.role
            };
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: '15m'
            });
            const refreshToken = this.jwtService.sign({ sub: newUser._id }, { expiresIn: '7d' });
            console.log('✅ [AuthService] Tokens generated successfully');
            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    phone: newUser.phone,
                }
            };
        }
        catch (error) {
            console.error('❌ [AuthService] Error in registerParent:', {
                error: error.message,
                stack: error.stack,
                registerDto: registerDto ? {
                    ...registerDto,
                    password: registerDto.password ? '[REDACTED]' : undefined,
                    children: registerDto.children?.length || 0
                } : 'No registerDto'
            });
            throw error;
        }
    }
    async login(user) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async createUser(userData) {
        const passwordHash = await this.hashPassword(userData.password);
        const user = new this.userModel({
            ...userData,
            passwordHash,
        });
        return user.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(child_schema_1.Child.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map