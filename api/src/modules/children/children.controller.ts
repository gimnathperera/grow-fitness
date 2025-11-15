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
  Logger,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { ChildrenService } from './children.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../schemas/user.schema';
import { CreateChildDto, UpdateChildDto, ChildDto } from './dto/child.dto';

@ApiTags('children')
@ApiBearerAuth()
@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  private readonly logger = new Logger(ChildrenController.name);

  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  @ApiOperation({ summary: 'Get all children (admin) or children of a specific parent' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Filter by parent ID' })
  @ApiResponse({ status: 200, description: 'List of children', type: [ChildDto] })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query('parentId') parentId: string, @User() user: any) {
    this.logger.debug(`[ChildrenController] User ${user.id} (${user.role}) fetching children`);

    const currentUserId = user.id || user.userId;
    if (!currentUserId) {
      this.logger.warn(`[ChildrenController] User not authenticated trying to fetch children`);
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can fetch all children or filter by parentId
    if (user.role === UserRole.ADMIN) {
      this.logger.debug(`[ChildrenController] Admin fetching children with filter parentId=${parentId}`);
      const result = await this.childrenService.findAll(parentId);
      this.logger.debug(`[ChildrenController] Admin fetched ${result.length} children`);
      return result;
    }

    // Parents can only fetch their own children
    // Use provided parentId or default to current user's ID
    const targetParentId = parentId || currentUserId;
    
    // Normalize IDs to string for comparison
    const targetParentIdStr = String(targetParentId);
    const currentUserIdStr = String(currentUserId);
    
    // If parentId is provided and doesn't match current user, deny access
    if (targetParentIdStr !== currentUserIdStr) {
      this.logger.warn(`[ChildrenController] Parent ${currentUserIdStr} tried to access children of parent ${targetParentIdStr}`);
      throw new ForbiddenException('You can only access your own children');
    }

    this.logger.debug(`[ChildrenController] Parent ${currentUserIdStr} fetching their own children`);
    const result = await this.childrenService.findByParentId(currentUserIdStr);
    this.logger.debug(`[ChildrenController] Parent fetched ${result.length} children`);
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific child by ID' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiResponse({ status: 200, description: 'Child details', type: ChildDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async findOne(@Param('id') id: string, @User() user: any) {
    this.logger.debug(`[ChildrenController] User ${user.id} fetching child ${id}`);

    const child = await this.childrenService.findOne(id);
    if (!child) {
      this.logger.warn(`[ChildrenController] Child ${id} not found`);
      throw new NotFoundException('Child not found');
    }

    const currentUserId = user.id || user.userId;
    
    // Normalize IDs to string for comparison
    const childParentIdStr = String(child.parentId);
    const currentUserIdStr = String(currentUserId);
    
    // Admin can view any child, parents can only view their own
    if (user.role !== UserRole.ADMIN && childParentIdStr !== currentUserIdStr) {
      this.logger.warn(`[ChildrenController] User ${currentUserIdStr} unauthorized to access child ${id} (parent: ${childParentIdStr})`);
      throw new ForbiddenException('Not authorized to view this child');
    }

    this.logger.debug(`[ChildrenController] Child ${id} fetched successfully`);
    return child;
  }

  @Post()
  @ApiOperation({ summary: 'Create one or multiple children' })
  @ApiResponse({ status: 201, description: 'Children created successfully', type: [ChildDto] })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createChildDtos: CreateChildDto | CreateChildDto[], @User() user: any) {
    this.logger.debug(`[ChildrenController] User object: ${JSON.stringify(user, null, 2)}`);

    const currentUserId =
      user.id ||
      user._id ||
      user.userId ||
      (user.user && (user.user.id || user.user._id || user.user.userId));

    if (!currentUserId) {
      this.logger.warn(`[ChildrenController] User not authenticated trying to create child`);
      throw new ForbiddenException('User not authenticated');
    }

    this.logger.debug(`[ChildrenController] User ${currentUserId} (${user.role}) creating children`);

    const childDtos = Array.isArray(createChildDtos) ? createChildDtos : [createChildDtos];

    const processedDtos = childDtos.map((dto) => {
      const childData = { ...dto };

      // Set parentId to current user if not provided
      if (!childData.parentId) {
        childData.parentId = currentUserId;
      } else {
        const parentIdStr = String(childData.parentId);
        const currentUserIdStr = String(currentUserId);
        const isAdmin = user.role === UserRole.ADMIN;
        const isParentCreatingForSelf =
          (user.role === 'parent' || user.role === 'client') && parentIdStr === currentUserIdStr;

        // Parents can only create children for themselves
        if (!isAdmin && !isParentCreatingForSelf) {
          this.logger.warn(
            `[ChildrenController] User ${currentUserIdStr} (${user.role}) tried to create child for another parent ${parentIdStr}`,
          );
          throw new ForbiddenException(
            'You do not have permission to create children for another parent',
          );
        }
      }

      // Set default values
      if (!childData.goals) childData.goals = [];
      if (childData.isInSports === undefined) childData.isInSports = false;

      // Calculate birth date from age if provided
      if (childData.age !== undefined && !childData.birthDate) {
        const birthYear = new Date().getFullYear() - childData.age;
        childData.birthDate = new Date(birthYear, 0, 1);
      }

      // Handle legacy field name
      if (childData.preferredTrainingStyle && !childData.trainingPreference) {
        childData.trainingPreference = childData.preferredTrainingStyle;
      }

      this.logger.debug(`[ChildrenController] Prepared child data for creation: ${JSON.stringify(childData)}`);
      return childData;
    });

    const result = await this.childrenService.create(processedDtos);
    this.logger.log(`[ChildrenController] Created ${Array.isArray(result) ? result.length : 1} children successfully`);
    return Array.isArray(createChildDtos) ? result : result[0];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a child' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiResponse({ status: 200, description: 'Child updated successfully', type: ChildDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto, @User() user: any) {
    this.logger.debug(`[ChildrenController] User ${user.id} updating child ${id}`);

    const child = await this.childrenService.findOne(id);
    if (!child) {
      this.logger.warn(`[ChildrenController] Child ${id} not found for update`);
      throw new NotFoundException('Child not found');
    }

    const currentUserId = user.id || user.userId;
    
    // Normalize IDs to string for comparison
    const childParentIdStr = String(child.parentId);
    const currentUserIdStr = String(currentUserId);
    
    // Admin can update any child, parents can only update their own
    if (user.role !== UserRole.ADMIN && childParentIdStr !== currentUserIdStr) {
      this.logger.warn(`[ChildrenController] User ${currentUserIdStr} unauthorized to update child ${id} (parent: ${childParentIdStr})`);
      throw new ForbiddenException('You can only update your own children');
    }

    const updatedChild = await this.childrenService.update(id, updateChildDto);
    this.logger.log(`[ChildrenController] Child ${id} updated successfully`);
    return updatedChild;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a child (admin or parent owner)' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiResponse({ status: 200, description: 'Child deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async remove(@Param('id') id: string, @User() user: any) {
    this.logger.debug(`[ChildrenController] User ${user.id} (${user.role}) attempting to delete child ${id}`);

    const child = await this.childrenService.findOne(id);
    if (!child) {
      this.logger.warn(`[ChildrenController] Child ${id} not found for deletion`);
      throw new NotFoundException('Child not found');
    }

    const currentUserId = user.id || user.userId;
    
    // Normalize IDs to string for comparison
    const childParentIdStr = String(child.parentId);
    const currentUserIdStr = String(currentUserId);
    
    // Admin can delete any child, parents can only delete their own
    if (user.role !== UserRole.ADMIN && childParentIdStr !== currentUserIdStr) {
      this.logger.warn(`[ChildrenController] User ${currentUserIdStr} unauthorized to delete child ${id} (parent: ${childParentIdStr})`);
      throw new ForbiddenException('You can only delete your own children');
    }

    const result = await this.childrenService.remove(id);
    this.logger.log(`[ChildrenController] Child ${id} deleted by user ${currentUserIdStr} (${user.role})`);
    return result;
  }
}