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
import { ChildrenService } from './children.service';
import { AdminGuard } from '../auth/admin.guard';

export class CreateChildDto {
  name: string;
  parentId: string;
  birthDate: Date;
  goals: string[];
}

export class UpdateChildDto {
  name?: string;
  birthDate?: Date;
  goals?: string[];
}

@Controller('children')
@UseGuards(AdminGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  findAll(@Query('parentId') parentId?: string) {
    return this.childrenService.findAll(parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childrenService.findOne(id);
  }

  @Post()
  create(@Body() createChildDto: CreateChildDto) {
    return this.childrenService.create(createChildDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto) {
    return this.childrenService.update(id, updateChildDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childrenService.remove(id);
  }
}
