import { IsString, IsDateString, IsArray, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChildDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ type: [String] })
  @IsArray()
  goals: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  medicalCondition?: string;

  @ApiProperty({ enum: ['male', 'female', 'other'] })
  @IsIn(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';
}
