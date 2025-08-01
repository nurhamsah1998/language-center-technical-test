import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  BadRequestException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, QueryOrder, UpdateStatusOrderDto } from './order.dto';
import { AuthGuardService } from 'src/guard/guard.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('order')
@UseGuards(AuthGuardService)
@ApiBearerAuth('access_token')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async Create(@Body() body: CreateOrderDto, @Req() request: Request) {
    try {
      await this.orderService.Create({ body, request });
      return {
        message:
          'Yay! you have buy this product, our team will sending your product!',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad request');
    }
  }

  @Get()
  async FindAll(@Query() query: QueryOrder) {
    try {
      return await this.orderService.FindAll(query);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad request');
    }
  }

  @Get(':id')
  async FindOne(@Param('id') id: string) {
    try {
      return await this.orderService.FindOne(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad request');
    }
  }

  @Put(':id')
  async UpdateStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusOrderDto,
  ) {
    try {
      await this.orderService.UpdateStatus({ id, body });
      return { message: 'update successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad request');
    }
  }
}
