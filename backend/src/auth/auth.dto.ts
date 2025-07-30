import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsPhoneNumber('ID')
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class AuthLoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
