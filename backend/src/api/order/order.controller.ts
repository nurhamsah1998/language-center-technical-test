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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, QueryOrder, UpdateStatusOrderDto } from './order.dto';
import { AuthGuardService } from 'src/guard/guard.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('order')
@UseGuards(AuthGuardService)
@ApiBearerAuth('access_token')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async Create(@Body() body: CreateOrderDto) {
    try {
      return await this.orderService.Create(body);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Get()
  async FindAll(@Query() query: QueryOrder) {
    try {
      return await this.orderService.FindAll(query);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Get(':id')
  async FindOne(@Param('id') id: string) {
    try {
      return await this.orderService.FindOne(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Put(':id')
  async Update(@Param('id') id: string, @Body() body: UpdateStatusOrderDto) {
    try {
      return await this.orderService.UpdateStatus({ id, body });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
