import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    ADMIN = "admin",
    COACH = "coach",
    PARENT = "parent"
}
export declare class User {
    role: UserRole;
    email: string;
    name: string;
    phone?: string;
    passwordHash: string;
    createdAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
