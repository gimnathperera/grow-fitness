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
import * as sessionsService_1 from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../schemas/user.schema';
import { SessionStatus } from '../../schemas/session.schema';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  private readonly logger = new Logger(SessionsController.name);

  constructor(private readonly sessionsService: sessionsService_1.SessionsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new session (Admin only)' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - conflicts detected' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createSessionDto: sessionsService_1.CreateSessionDto, @User() user: any) {
    this.logger.log(`[SessionsController] Admin ${user.id} creating new session`);
    const session = await this.sessionsService.create(createSessionDto);
    return {
      success: true,
      message: 'Session created successfully',
      data: session,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions with pagination and filters' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by parent/client ID' })
  @ApiQuery({ name: 'coachId', required: false, description: 'Filter by coach ID' })
  @ApiQuery({ name: 'kidId', required: false, description: 'Filter by child ID' })
  @ApiQuery({ name: 'status', required: false, enum: SessionStatus })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'End date (ISO format)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiResponse({ status: 200, description: 'List of sessions with pagination' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() queryParams: sessionsService_1.SessionsQueryParams, @User() user: any) {
    this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching sessions`);

    const currentUserId = user.id || user.userId;
    if (!currentUserId) {
      this.logger.warn(`[SessionsController] User not authenticated`);
      throw new ForbiddenException('User not authenticated');
    }

    const currentUserIdStr = String(currentUserId);

    // Role-based access control for query parameters
    if (user.role === UserRole.ADMIN) {
      // Admin can query with any parameters
      this.logger.debug(`[SessionsController] Admin fetching sessions with filters`);
    } else if (user.role === UserRole.COACH || user.role === 'coach') {
      // Coaches can only see their assigned sessions
      const requestedCoachId = queryParams.coachId || currentUserIdStr;
      const requestedCoachIdStr = String(requestedCoachId);

      if (requestedCoachIdStr !== currentUserIdStr) {
        this.logger.warn(
          `[SessionsController] Coach ${currentUserIdStr} tried to access sessions of coach ${requestedCoachIdStr}`,
        );
        throw new ForbiddenException('You can only view your own assigned sessions');
      }

      // Override coachId to ensure they only see their sessions
      queryParams.coachId = currentUserIdStr;
      this.logger.debug(`[SessionsController] Coach ${currentUserIdStr} fetching their assigned sessions`);
    } else if (user.role === UserRole.PARENT || user.role === 'parent' || user.role === 'client') {
      // Parents can only see sessions for their children
      // If they provide clientId, it must match their own ID
      if (queryParams.clientId && String(queryParams.clientId) !== currentUserIdStr) {
        this.logger.warn(
          `[SessionsController] Parent ${currentUserIdStr} tried to access sessions of client ${queryParams.clientId}`,
        );
        throw new ForbiddenException('You can only view your own sessions');
      }

      // Override clientId to ensure they only see their own children's sessions
      queryParams.clientId = currentUserIdStr;
      this.logger.debug(`[SessionsController] Parent ${currentUserIdStr} fetching sessions for their children`);
    } else {
      this.logger.warn(`[SessionsController] Unknown role: ${user.role}`);
      throw new ForbiddenException('Invalid user role');
    }

    const result = await this.sessionsService.findAll(queryParams, user.role, currentUserIdStr);
    
    return {
      success: true,
      message: 'Sessions retrieved successfully',
      data: result,
    };
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming sessions' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of sessions to return', type: Number })
  @ApiResponse({ status: 200, description: 'List of upcoming sessions' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUpcomingSessions(@Query('limit') limit: string, @User() user: any) {
    this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching upcoming sessions`);

    const currentUserId = user.id || user.userId;
    if (!currentUserId) {
      this.logger.warn(`[SessionsController] User not authenticated`);
      throw new ForbiddenException('User not authenticated');
    }

    const limitNum = limit ? parseInt(limit, 10) : 10;
    const sessions = await this.sessionsService.getUpcomingSessions(limitNum, String(currentUserId), user.role);

    return {
      success: true,
      message: 'Upcoming sessions retrieved successfully',
      data: sessions,
    };
  }

  @Get('upcoming-by-kid')
  @ApiOperation({ summary: 'Get upcoming sessions for a specific kid' })
  @ApiQuery({ name: 'kidId', required: true, description: 'Child ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of sessions to return', type: Number })
  @ApiResponse({ status: 200, description: 'List of upcoming sessions for the kid' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Child not found or access denied' })
  async getUpcomingByKid(
    @Query('kidId') kidId: string,
    @Query('limit') limit: string,
    @User() user: any,
  ) {
    this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching upcoming sessions for kid ${kidId}`);

    if (!kidId) {
      throw new ForbiddenException('kidId is required');
    }

    const currentUserId = user.id || user.userId;
    if (!currentUserId) {
      this.logger.warn(`[SessionsController] User not authenticated`);
      throw new ForbiddenException('User not authenticated');
    }

    const limitNum = limit ? parseInt(limit, 10) : 10;
    const sessions = await this.sessionsService.getUpcomingByKid(
      kidId,
      limitNum,
      String(currentUserId),
      user.role,
    );

    return {
      success: true,
      message: 'Upcoming sessions for kid retrieved successfully',
      data: sessions,
    };
  }

  @Get('check-availability')
  @ApiOperation({ summary: 'Check coach availability' })
  @ApiQuery({ name: 'coachId', required: true, description: 'Coach ID' })
  @ApiQuery({ name: 'location', required: false, description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Coach availability data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async checkAvailability(
    @Query('coachId') coachId: string,
    @Query('location') location: string,
    @User() user: any,
  ) {
    this.logger.debug(`[SessionsController] User ${user.id} checking availability for coach ${coachId}`);

    if (!coachId) {
      throw new ForbiddenException('coachId is required');
    }

    const availability = await this.sessionsService.checkAvailability(coachId, location);

    return {
      success: true,
      message: 'Availability checked successfully',
      data: availability,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async findOne(@Param('id') id: string, @User() user: any) {
    this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) fetching session ${id}`);

    const session = await this.sessionsService.findOne(id);
    if (!session) {
      this.logger.warn(`[SessionsController] Session ${id} not found`);
      throw new NotFoundException('Session not found');
    }

    const currentUserId = user.id || user.userId;
    const currentUserIdStr = String(currentUserId);

    // Role-based access control
    if (user.role === UserRole.ADMIN) {
      // Admin can view any session
      this.logger.debug(`[SessionsController] Admin accessing session ${id}`);
    } else if (user.role === UserRole.COACH || user.role === 'coach') {
      // Coaches can only view their assigned sessions
      const sessionCoachIdStr = String(session.coachId);
      if (sessionCoachIdStr !== currentUserIdStr) {
        this.logger.warn(
          `[SessionsController] Coach ${currentUserIdStr} tried to access session ${id} assigned to coach ${sessionCoachIdStr}`,
        );
        throw new ForbiddenException('You can only view your own assigned sessions');
      }
      this.logger.debug(`[SessionsController] Coach ${currentUserIdStr} accessing their session ${id}`);
    } else if (user.role === UserRole.PARENT || user.role === 'parent' || user.role === 'client') {
      // Parents can only view sessions involving their children
      const hasAccess = await this.sessionsService.validateParentAccess(id, currentUserIdStr);
      if (!hasAccess) {
        this.logger.warn(
          `[SessionsController] Parent ${currentUserIdStr} tried to access session ${id} without their children`,
        );
        throw new ForbiddenException('You can only view sessions involving your children');
      }
      this.logger.debug(`[SessionsController] Parent ${currentUserIdStr} accessing session ${id}`);
    } else {
      this.logger.warn(`[SessionsController] Unknown role: ${user.role}`);
      throw new ForbiddenException('Invalid user role');
    }

    return {
      success: true,
      message: 'Session retrieved successfully',
      data: session,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSessionDto: sessionsService_1.UpdateSessionDto,
    @User() user: any,
  ) {
    this.logger.debug(`[SessionsController] User ${user.id} (${user.role}) updating session ${id}`);

    const session = await this.sessionsService.findOne(id);
    if (!session) {
      this.logger.warn(`[SessionsController] Session ${id} not found for update`);
      throw new NotFoundException('Session not found');
    }

    const currentUserId = user.id || user.userId;
    const currentUserIdStr = String(currentUserId);

    // Role-based update permissions
    if (user.role === UserRole.ADMIN) {
      // Admin can update any session
      this.logger.debug(`[SessionsController] Admin updating session ${id}`);
      const updated = await this.sessionsService.update(id, updateSessionDto);
      this.logger.log(`[SessionsController] Session ${id} updated by admin`);
      return {
        success: true,
        message: 'Session updated successfully',
        data: updated,
      };
    } else if (user.role === UserRole.COACH || user.role === 'coach') {
      // Coaches can only update status of their assigned sessions
      const sessionCoachIdStr = String(session.coachId);
      if (sessionCoachIdStr !== currentUserIdStr) {
        this.logger.warn(
          `[SessionsController] Coach ${currentUserIdStr} tried to update session ${id} assigned to coach ${sessionCoachIdStr}`,
        );
        throw new ForbiddenException('You can only update your own assigned sessions');
      }

      // Restrict what coaches can update (only status)
      const allowedUpdates: sessionsService_1.UpdateSessionDto = {};
      if (updateSessionDto.status !== undefined) allowedUpdates.status = updateSessionDto.status;
      
      this.logger.debug(`[SessionsController] Coach ${currentUserIdStr} updating session ${id} status`);
      const updated = await this.sessionsService.update(id, allowedUpdates);
      this.logger.log(`[SessionsController] Session ${id} updated by coach`);
      return {
        success: true,
        message: 'Session status updated successfully',
        data: updated,
      };
    } else if (user.role === UserRole.PARENT || user.role === 'parent' || user.role === 'client') {
      // Parents cannot update sessions
      this.logger.warn(`[SessionsController] Parent ${currentUserIdStr} tried to update session ${id}`);
      throw new ForbiddenException('Parents cannot update sessions');
    } else {
      this.logger.warn(`[SessionsController] Unknown role: ${user.role}`);
      throw new ForbiddenException('Invalid user role');
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a session (Admin only)' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async remove(@Param('id') id: string, @User() user: any) {
    this.logger.log(`[SessionsController] Admin ${user.id} deleting session ${id}`);
    const result = await this.sessionsService.remove(id);
    this.logger.log(`[SessionsController] Session ${id} deleted successfully`);
    return {
      success: true,
      message: 'Session deleted successfully',
      data: result,
    };
  }
}