import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { AuthService } from '../auth/auth.service';
export declare class UsersService {
    private userModel;
    private authService;
    constructor(userModel: Model<UserDocument>, authService: AuthService);
    findAll(role?: UserRole): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    create(userData: {
        email: string;
        name: string;
        password: string;
        role: UserRole;
        phone?: string;
    }): Promise<User>;
    update(id: string, updateData: Partial<User>): Promise<User | null>;
    remove(id: string): Promise<User | null>;
}
