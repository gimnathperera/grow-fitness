import { RegisterParentDto } from './dto/register-parent.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Child } from '../../schemas/child.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Child.name) private childModel: Model<Child>,
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

  async registerParent(registerDto: RegisterParentDto): Promise<{ 
    access_token: string; 
    refresh_token: string;
    user: any 
  }> {
    console.log('🔍 [AuthService] Registering parent with data:', JSON.stringify({
      ...registerDto,
      password: registerDto.password ? '[REDACTED]' : undefined,
      children: registerDto.children?.length || 0
    }, null, 2));
    
    try {
      // Check for existing user
      console.log('🔍 [AuthService] Checking for existing user with email:', registerDto.email);
      const existingUser = await this.userModel.findOne({ email: registerDto.email }).exec();
      
      if (existingUser) {
        console.warn('⚠️ [AuthService] Registration failed - Email already in use:', registerDto.email);
        throw new Error('Email already in use');
      }

      // Create user
      console.log('🔧 [AuthService] Creating new user...');
      const newUser = await this.createUser({
        email: registerDto.email,
        name: registerDto.name,
        password: registerDto.password,
        role: UserRole.PARENT,
        phone: registerDto.phone,
        location: registerDto.location
      });
      console.log('✅ [AuthService] User created successfully:', { 
        id: newUser._id, 
        email: newUser.email,
        role: newUser.role 
      });

      const { passwordHash, ...userWithoutPassword } = newUser.toObject();
      
      // Create children if provided
      if (registerDto.children && registerDto.children.length > 0) {
        console.log(`👶 [AuthService] Processing ${registerDto.children.length} children...`);
        
        const childrenWithParent = registerDto.children.map((child, index) => {
          const childData = {
            ...child,
            parentId: newUser._id,
            goals: child.goals || [],
            isInSports: child.isInSports || false,
            preferredTrainingStyle: child.preferredTrainingStyle || 'group'
          };
          console.log(`  🧒 [Child ${index + 1}] Prepared child data:`, JSON.stringify(childData, null, 2));
          return childData;
        });
        
        try {
          console.log('📝 [AuthService] Saving children to database...');
          const savedChildren = await this.childModel.insertMany(childrenWithParent);
          console.log(`✅ [AuthService] Successfully saved ${savedChildren.length} children`);
        } catch (error) {
          console.error('❌ [AuthService] Error saving children:', error);
          throw new Error(`Failed to save children: ${error.message}`);
        }
      } else {
        console.log('ℹ️ [AuthService] No children provided for registration');
      }
      
      // Generate JWT token
      console.log('🔑 [AuthService] Generating JWT token...');
      const payload = { 
        email: newUser.email, 
        sub: newUser._id, 
        role: newUser.role 
      };
      
      // Generate access token (short-lived)
      const accessToken = this.jwtService.sign(payload, { 
        expiresIn: '15m' // 15 minutes
      });
      
      // Generate refresh token (long-lived)
      const refreshToken = this.jwtService.sign(
        { sub: newUser._id },
        { expiresIn: '7d' } // 7 days
      );
      
      console.log('✅ [AuthService] Tokens generated successfully');
      
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          phone: newUser.phone,
        }
      };
    } catch (error) {
      console.error('❌ [AuthService] Error in registerParent:', {
        error: error.message,
        stack: error.stack,
        registerDto: registerDto ? {
          ...registerDto,
          password: registerDto.password ? '[REDACTED]' : undefined,
          children: registerDto.children?.length || 0
        } : 'No registerDto'
      });
      throw error;
    }
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

