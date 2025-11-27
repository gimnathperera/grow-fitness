import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminGuard } from './admin.guard';
import { RegisterParentDto } from './dto/register-parent.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';

export class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/parent')
  @ApiOperation({ summary: 'Register a new parent' })
  @ApiResponse({ 
    status: 201, 
    description: 'Parent registered successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
            phone: { type: 'string' },
            location: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async registerParent(@Body() registerDto: RegisterParentDto) {
    console.log('🔑 [AuthController] Received parent registration request');
    console.log('📝 [AuthController] Request body:', JSON.stringify({
      ...registerDto,
      password: registerDto.password ? '[REDACTED]' : undefined,
      children: registerDto.children?.length || 0
    }, null, 2));
    
    try {
      console.log('🔄 [AuthController] Processing registration...');
      const { access_token, refresh_token, user } = await this.authService.registerParent(registerDto);
      console.log('✅ [AuthController] Parent registration successful');
      
      // Return the response in the expected format
      return {
        access_token,
        refresh_token,
        tokens: {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
        user
      };
    } catch (error) {
      console.error('❌ [AuthController] Parent registration failed:', {
        error: error.message,
        stack: error.stack,
        email: registerDto?.email
      });
      
      const statusCode = error.message.includes('already in use') 
        ? HttpStatus.CONFLICT 
        : HttpStatus.BAD_REQUEST;
        
      throw new HttpException(
        {
          status: statusCode,
          error: error.message,
          timestamp: new Date().toISOString(),
          path: '/auth/register/parent'
        },
        statusCode,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('register/patient')
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async registerPatient(@Body() registerDto: RegisterPatientDto) {
    // Map patient registration to parent registration
    const parentDto: RegisterParentDto = {
      name: registerDto.name,
      email: registerDto.email,
      phone: registerDto.phone,
      password: registerDto.password,
      location: registerDto.location
    };
    return this.authService.registerParent(parentDto);
  }
}
