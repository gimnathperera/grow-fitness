import { RegisterParentDto } from './dto/register-parent.dto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, UserRole } from '../../schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    registerParent(registerDto: RegisterParentDto): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    hashPassword(password: string): Promise<string>;
    createUser(userData: {
        email: string;
        name: string;
        password: string;
        role: UserRole;
        phone?: string;
        location?: string;
    }): Promise<UserDocument>;
}
