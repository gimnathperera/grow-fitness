import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, Matches, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChildDto } from '../../children/dto/child.dto';

export class RegisterParentDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^[+]?[1-9][\d]{7,14}$/, {
    message: 'Please enter a valid phone number',
  })
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChildDto)
  @IsOptional()
  children?: CreateChildDto[];
}
