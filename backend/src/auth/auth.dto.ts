import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Nurhamsah' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '6281213221343' })
  @IsString()
  @IsPhoneNumber('ID')
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class AuthLoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class AuthForgotPasswordDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class AuthResetDto {
  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  new_password: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  retype_password: string;
}
