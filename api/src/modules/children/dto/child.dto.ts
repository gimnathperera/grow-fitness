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

export class CreateChildDto {
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(18)
  age?: number;

  @IsIn(['boy', 'girl'])
  @IsNotEmpty()
  gender: 'boy' | 'girl';

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @IsOptional()
  goals?: string[] = [];

  @IsString()
  @IsOptional()
  medicalCondition?: string;

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
