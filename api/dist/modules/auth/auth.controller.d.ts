import { AuthService } from './auth.service';
import { RegisterParentDto } from './dto/register-parent.dto';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerParent(registerDto: RegisterParentDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
}
