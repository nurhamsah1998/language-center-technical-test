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
@ApiBearerAuth('access_token')
@UseGuards(AuthGuardService)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async Create(@Body() body: CreateProductDto) {
    try {
      return await this.productService.Create(body);
    } catch (error) {
      console.log(error);
      if (error?.code == 'P2002') {
        throw new BadRequestException('name already exist!');
      } else {
        throw new BadRequestException();
      }
    }
  }

  @Get()
  async FindAll(@Query() query: QueryProduct) {
    try {
      return await this.productService.FindAll(query);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Put(':id')
  async Update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    try {
      return await this.productService.Update({ id, body });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

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
