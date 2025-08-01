import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Nurhamsah' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '6281213221343' })
  @IsString()
  @IsPhoneNumber('ID')
  @IsOptional()
  phoneNumber: string;
}

export class ChangeMyPasswordDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: '123qweasdzxc' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ example: '123qweasdzxc' })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  retypePassword: string;
}
