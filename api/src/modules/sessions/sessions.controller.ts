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
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AdminGuard } from '../auth/admin.guard';
import { SessionType, SessionStatus } from '../../schemas/session.schema';

export class CreateSessionDto {
  type: SessionType;
  coachId: string;
  childIds: string[];
  locationId: string;
  startAt: Date;
  endAt: Date;
}

export class UpdateSessionDto {
  type?: SessionType;
  coachId?: string;
  childIds?: string[];
  locationId?: string;
  startAt?: Date;
  endAt?: Date;
  status?: SessionStatus;
}

@Controller('sessions')
@UseGuards(AdminGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findAll(
    @Query('coachId') coachId?: string,
    @Query('childId') childId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: SessionStatus,
  ) {
    const filters: any = {};
    if (coachId) filters.coachId = coachId;
    if (childId) filters.childId = childId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (status) filters.status = status;

    return this.sessionsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }
}

