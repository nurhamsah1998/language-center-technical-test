import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from 'src/guard/guard.service';
import {
  CreateProductDto,
  QueryProduct,
  UpdateProductDto,
} from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Post()
  async Create(@Body() body: CreateProductDto) {
    try {
      return await this.productService.Create(body);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Get()
  async FindAll(@Query() query: QueryProduct) {
    try {
      return await this.productService.FindAll(query);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Put(':id')
  async Update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    try {
      return await this.productService.Update({ id, body });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Delete(':id')
  async Remove(@Param('id') id: string) {
    try {
      return await this.productService.Remove(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Get(':id')
  async FindOne(@Param('id') id: string) {
    try {
      return await this.productService.FindOne(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
