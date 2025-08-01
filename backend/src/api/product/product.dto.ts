import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QueryInit } from 'src/utils/queryInit';

export class CreateProductDto {
  @ApiProperty({ example: 'book how to learn english with language center' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'some desc' })
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty({ example: '500' })
  @IsNotEmpty()
  @IsInt()
  @Max(1_000_000)
  @Min(1)
  buyPrice: number;

  @ApiProperty({ example: 'some uuid' })
  @IsNotEmpty()
  @IsString()
  productCategoryId: string;

  @ApiProperty({
    example: '1000',
    description: 'Sell price must be greater than buy price',
  })
  @IsNotEmpty()
  @IsInt()
  @Max(1_000_000)
  @Min(1)
  sellPrice: number;

  @ApiProperty({
    example: '1000',
  })
  @IsNotEmpty()
  @IsInt()
  @Max(1_000)
  @Min(1)
  stock: number;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'book how to learn english with language center' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'some desc' })
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty({ example: '500' })
  @IsNotEmpty()
  @IsInt()
  @Max(1_000_000)
  @Min(1)
  buyPrice: number;

  @ApiProperty({ example: 'some uuid' })
  @IsNotEmpty()
  @IsString()
  productCategoryId: string;

  @ApiProperty({
    example: '1000',
    description: 'Sell price must be greater than buy price',
  })
  @IsNotEmpty()
  @IsInt()
  @Max(1_000_000)
  @Min(1)
  sellPrice: number;
}

export class QueryProduct extends QueryInit {
  //   @ApiProperty({ example: 'some uuid' })
  //   @IsNotEmpty()
  //   @IsString()
  //   sort: string;
}
