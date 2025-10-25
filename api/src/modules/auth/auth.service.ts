import { RegisterParentDto } from './dto/register-parent.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async registerParent(registerDto: RegisterParentDto): Promise<any> {
    const existingUser = await this.userModel.findOne({ email: registerDto.email }).exec();
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const newUser = await this.createUser({
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password,
      role: UserRole.PARENT,
      phone: registerDto.phone,
      location: registerDto.location
  });

  const { passwordHash, ...result } = newUser.toObject();
  return result;
}

  async login(user: any) {
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

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    phone?: string;
    location?: string;
  }): Promise<UserDocument> {
    const passwordHash = await this.hashPassword(userData.password);
    const user = new this.userModel({
      ...userData,
      passwordHash,
    });
    return user.save();
  }
}

