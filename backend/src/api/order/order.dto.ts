import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { StatusOrder } from 'generated/prisma';
import { QueryInit } from 'src/utils/queryInit';

class ProductOnOrder {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(1_000_000)
  @IsNotEmpty()
  qty: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: [{ productId: 'product uuid here', qty: 3 }] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOnOrder)
  products: ProductOnOrder[];
}

export class UpdateStatusOrderDto {
  @ApiProperty({ example: 'Deliver' })
  @IsEnum(StatusOrder)
  @IsNotEmpty()
  status: StatusOrder;
}

export class UpdateTrackingOrderDto {
  @ApiProperty({ example: ['deliver to customer'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tracking: string[];
}

export class QueryOrder extends QueryInit {}
