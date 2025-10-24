import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateChildDto {
  @IsString()
  parentId: string;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  @IsOptional()
  medicalCondition?: string;

  @IsString()
  gender: string;

  @IsArray()
  @IsOptional()
  goals?: string[];
}

export class UpdateChildDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  medicalCondition?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsArray()
  @IsOptional()
  goals?: string[];
}
