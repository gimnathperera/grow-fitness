import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userModel;
    constructor(configService: ConfigService, userModel: Model<UserDocument>);
    validate(payload: any): Promise<{
        id: unknown;
        email: string;
        role: import("../../schemas/user.schema").UserRole;
        name: string;
    }>;
}
export {};
