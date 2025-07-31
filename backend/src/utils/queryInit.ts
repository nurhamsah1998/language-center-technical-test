import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryInit {
  @ApiProperty({ example: '10' })
  @IsNumber()
  limit: number = 10;

  @ApiProperty({ example: '1' })
  @IsNumber()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search: string;
}
