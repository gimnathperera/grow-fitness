import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { AdminGuard } from '../auth/admin.guard';
import { RequestStatus } from '../../schemas/request.schema';

export class ApproveRequestDto {
  newSlot?: {
    startAt: Date;
    endAt: Date;
  };
  adminNote?: string;
}

export class RejectRequestDto {
  reason: string;
}

@Controller('requests')
@UseGuards(AdminGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  findAll(@Query('status') status?: RequestStatus) {
    return this.requestsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() approveRequestDto: ApproveRequestDto,
    @Req() req: any,
  ) {
    return this.requestsService.approve(
      id,
      req.user.id,
      approveRequestDto.newSlot,
      approveRequestDto.adminNote,
    );
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() rejectRequestDto: RejectRequestDto,
    @Req() req: any,
  ) {
    return this.requestsService.reject(
      id,
      req.user.id,
      rejectRequestDto.reason,
    );
  }
}
