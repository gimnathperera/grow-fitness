import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class RegisterPatientDto {
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
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  role: string = 'client'; // Default role for patients

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;
}
