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
  @ApiResponse({ status: 201, description: 'Parent registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async registerParent(@Body() registerDto: RegisterParentDto) {
    return this.authService.registerParent(registerDto);
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
}
