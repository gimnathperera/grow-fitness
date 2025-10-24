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
import { InvoicesService } from './invoices.service';
import { AdminGuard } from '../auth/admin.guard';
import { InvoiceStatus, PaymentMethod } from '../../schemas/invoice.schema';

export class CreateInvoiceDto {
  parentId: string;
  amountLKR: number;
  status?: InvoiceStatus;
}

export class UpdateInvoiceDto {
  amountLKR?: number;
  status?: InvoiceStatus;
}

export class MarkPaidDto {
  paidMethod: PaymentMethod;
  paidDate?: Date;
}

@Controller('invoices')
@UseGuards(AdminGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(
    @Query('status') status?: InvoiceStatus,
    @Query('parentId') parentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (parentId) filters.parentId = parentId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.invoicesService.findAll(filters);
  }

  @Get('summary')
  getSummary() {
    return this.invoicesService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Patch(':id/mark-paid')
  markAsPaid(@Param('id') id: string, @Body() markPaidDto: MarkPaidDto) {
    return this.invoicesService.markAsPaid(
      id,
      markPaidDto.paidMethod,
      markPaidDto.paidDate,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}

