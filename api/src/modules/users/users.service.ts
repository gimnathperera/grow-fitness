import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async findAll(role?: UserRole): Promise<User[]> {
    const filter = role ? { role } : {};
    return this.userModel.find(filter).select('-passwordHash').exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-passwordHash').exec();
  }

  async create(userData: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    phone?: string;
  }): Promise<User> {
    return this.authService.createUser(userData);
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
