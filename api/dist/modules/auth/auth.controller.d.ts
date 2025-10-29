import { AuthService } from './auth.service';
import { RegisterParentDto } from './dto/register-parent.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerParent(registerDto: RegisterParentDto): Promise<{
        access_token: string;
        refresh_token: string;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
        user: any;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    registerPatient(registerDto: RegisterPatientDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
}
