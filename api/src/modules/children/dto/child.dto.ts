import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChildDto {
  @ApiProperty({ description: 'The unique identifier of the child' })
  id: string;

  @ApiProperty({ description: 'The ID of the parent user' })
  parentId?: string;

  @ApiProperty({ description: 'The name of the child' })
  name: string;

  @ApiPropertyOptional({ description: 'The birth date of the child' })
  birthDate?: Date;

  @ApiPropertyOptional({ description: 'The age of the child', minimum: 0, maximum: 18 })
  age?: number;

  @ApiProperty({ enum: ['boy', 'girl'], description: 'The gender of the child' })
  gender: 'boy' | 'girl';

  @ApiProperty({ description: 'The location of the child' })
  location: string;

  @ApiPropertyOptional({ type: [String], description: 'List of goals for the child' })
  goals?: string[] = [];

  @ApiPropertyOptional({ description: 'Any medical conditions the child has' })
  medicalCondition?: string;

  @ApiPropertyOptional({ description: 'Whether the child is involved in sports', default: false })
  isInSports?: boolean = false;

  @ApiPropertyOptional({ enum: ['personal', 'group'], description: 'Preferred training type' })
  trainingPreference?: 'personal' | 'group';

  @ApiProperty({ description: 'The date when the child record was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the child record was last updated' })
  updatedAt: Date;
}

export class CreateChildDto {
  @IsOptional()
  parentId?: string;

  @ApiProperty({ description: 'The name of the child' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ description: 'The age of the child', minimum: 0, maximum: 18 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(18)
  age?: number;

  @ApiProperty({ enum: ['boy', 'girl'], description: 'The gender of the child' })
  @IsIn(['boy', 'girl'])
  @IsNotEmpty()
  gender: 'boy' | 'girl';

  @ApiProperty({ description: 'The location of the child' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ type: [String], description: 'List of goals for the child' })
  @IsArray()
  @IsOptional()
  goals?: string[] = [];

  @IsString()
  @IsOptional()
  medicalCondition?: string;

  @ApiPropertyOptional({ description: 'Whether the child is involved in sports', default: false })
  @IsBoolean()
  @IsOptional()
  isInSports?: boolean = false;

  @IsIn(['personal', 'group'])
  @IsOptional()
  preferredTrainingStyle?: 'personal' | 'group' = 'group';

  @IsIn(['personal', 'group'])
  @IsOptional()
  trainingPreference?: 'personal' | 'group';
}

export class UpdateChildDto {
  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsIn(['boy', 'girl'])
  @IsOptional()
  gender?: 'boy' | 'girl';

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  goals?: string[];

  @IsString()
  @IsOptional()
  medicalCondition?: string;

  @IsBoolean()
  @IsOptional()
  isInSports?: boolean;

  @IsIn(['personal', 'group'])
  @IsOptional()
  trainingPreference?: 'personal' | 'group';
}
