import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
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
