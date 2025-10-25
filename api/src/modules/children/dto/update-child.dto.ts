import { PartialType } from '@nestjs/swagger';
import { IsString, IsDateString, IsArray, IsOptional, IsIn } from 'class-validator';
import { CreateChildDto } from './create-child.dto';

export class UpdateChildDto extends PartialType(CreateChildDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsArray()
  goals?: string[];

  @IsOptional()
  @IsString()
  medicalCondition?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';
}
