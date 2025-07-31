import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MutationProductCategoryDto {
  @ApiProperty({ example: 'book' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
