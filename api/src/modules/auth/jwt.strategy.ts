import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'default-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy validate called with payload:', payload);
    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      console.log('User not found for payload.sub:', payload.sub);
      throw new UnauthorizedException();
    }
    console.log('User found:', user);
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
