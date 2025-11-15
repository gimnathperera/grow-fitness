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

    if (user.role === UserRole.ADMIN) {
      this.logger.debug(`[ChildrenController] Admin fetching children with filter parentId=${parentId}`);
      const result = await this.childrenService.findAll(parentId);
      this.logger.debug(`[ChildrenController] Admin fetched ${result.length} children`);
      return result;
    }

    const currentUserId = user.id || user.userId;
    if (!currentUserId) {
      this.logger.warn(`[ChildrenController] User not authenticated trying to fetch children`);
      throw new ForbiddenException('User not authenticated');
    }

    this.logger.debug(`[ChildrenController] Parent ${currentUserId} fetching their own children`);
    const result = await this.childrenService.findByParentId(parentId);
    this.logger.debug(`[ChildrenController] Parent fetched ${result.length} children`);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: any) {
    this.logger.debug(`[ChildrenController] User ${user.id} fetching child ${id}`);

    const child = await this.childrenService.findOne(id);
    if (!child) {
      this.logger.warn(`[ChildrenController] Child ${id} not found`);
      throw new NotFoundException('Child not found');
    }

    if (user.role !== UserRole.ADMIN && child.parentId.toString() !== (user.id || user.userId)) {
      this.logger.warn(`[ChildrenController] User ${user.id} unauthorized to access child ${id}`);
      throw new ForbiddenException('Not authorized to view this child');
    }

    this.logger.debug(`[ChildrenController] Child ${id} fetched successfully`);
    return child;
  }

  @Post()
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

      if (!childData.parentId) {
        childData.parentId = currentUserId;
      } else {
        const parentIdStr = String(childData.parentId);
        const currentUserIdStr = String(currentUserId);
        const isAdmin = user.role === UserRole.ADMIN;
        const isParentCreatingForSelf =
          (user.role === 'parent' || user.role === 'client') && parentIdStr === currentUserIdStr;

        if (!isAdmin && !isParentCreatingForSelf) {
          this.logger.warn(
            `[ChildrenController] User ${currentUserIdStr} (${user.role}) tried to create child for another parent ${parentIdStr}`,
          );
          throw new ForbiddenException(
            'You do not have permission to create children for another parent',
          );
        }
      }

      if (!childData.goals) childData.goals = [];
      if (childData.isInSports === undefined) childData.isInSports = false;

      if (childData.age !== undefined && !childData.birthDate) {
        const birthYear = new Date().getFullYear() - childData.age;
        childData.birthDate = new Date(birthYear, 0, 1);
      }

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
  async update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto, @User() user: any) {
    this.logger.debug(`[ChildrenController] User ${user.id} updating child ${id}`);

    const child = await this.childrenService.findOne(id);
    if (!child) {
      this.logger.warn(`[ChildrenController] Child ${id} not found for update`);
      throw new NotFoundException('Child not found');
    }

    if (user.role !== UserRole.ADMIN && child.parentId.toString() !== (user.id || user.userId)) {
      this.logger.warn(`[ChildrenController] User ${user.id} unauthorized to update child ${id}`);
      throw new ForbiddenException('You can only update your own children');
    }

    const updatedChild = await this.childrenService.update(id, updateChildDto);
    this.logger.log(`[ChildrenController] Child ${id} updated successfully`);
    return updatedChild;
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string, @User() user: any) {
    this.logger.log(`[ChildrenController] Admin ${user.id} deleting child ${id}`);
    const result = await this.childrenService.remove(id);
    this.logger.log(`[ChildrenController] Child ${id} deleted successfully`);
    return result;
  }
}
