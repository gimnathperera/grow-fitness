import { UsersService } from './users.service';
import { UserRole } from '../../schemas/user.schema';
export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    phone?: string;
}
export declare class UpdateUserDto {
    email?: string;
    name?: string;
    phone?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: UserRole): Promise<import("../../schemas/user.schema").User[]>;
    findOne(id: string): Promise<import("../../schemas/user.schema").User | null>;
    create(createUserDto: CreateUserDto): Promise<import("../../schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../../schemas/user.schema").User | null>;
    remove(id: string): Promise<import("../../schemas/user.schema").User | null>;
}
