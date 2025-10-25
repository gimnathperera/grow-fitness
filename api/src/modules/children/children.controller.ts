import { AdminGuard } from '../auth/admin.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../../decorators/user.decorator';
import { Types } from 'mongoose';
import { UserRole } from '../../schemas/user.schema';

export class CreateChildDto {
  name: string;
  parentId?: string;
  birthDate: Date;
  goals: string[];
  medicalCondition?: string;
  gender: 'male' | 'female' | 'other';
}

export class UpdateChildDto {
  name?: string;
  birthDate?: Date;
  goals?: string[];
  medicalCondition?: string;
  gender?: 'male' | 'female' | 'other';
}

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  async findAll(
    @Query('parentId') parentId: string,
    @User() user: any,
  ) {
    // Admins can view all children or filter by parentId
    if (user.role === UserRole.ADMIN) {
      return this.childrenService.findAll(parentId);
    }
    
    // Parents can only view their own children
    return this.childrenService.findByParentId(user.userId);
  }

  /**
   * Get a single child
  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: any) {
    const child = await this.childrenService.findOne(id);
    if (!child) {
      throw new NotFoundException('Child not found');
    }

    // Only allow admin or the parent to view the child
    if (user.role !== UserRole.ADMIN && child.parentId.toString() !== user.userId) {
      throw new ForbiddenException('Not authorized to view this child');
    }

    return child;
  }

  @Post()
  async create(@Body() createChildDto: CreateChildDto, @User() user: any) {
    // Only allow admin to create children for other parents
    if (createChildDto.parentId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create children for other parents');
    }

    // If no parentId is provided, use the current user's ID
    if (!createChildDto.parentId) {
      createChildDto.parentId = user.userId;
    }

    return this.childrenService.create(createChildDto);
  }

  /**
   * Update a child
   * Admins or parents (of the child) can update
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
    @User() user: any,
  ) {
    const child = await this.childrenService.findOne(id);
    if (!child) {
      return null;
    }

    if (user.role !== 'admin' && child.parentId.toString() !== user.id) {
      throw new ForbiddenException('You can only update your own children');
    }

    return this.childrenService.update(id, updateChildDto);
  }

  /**
   * Delete a child
   * Only admins can delete children
   */
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.childrenService.remove(id);
  }
}
