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

  @Get('public/:id')
  async PublicFindOne(@Param('id') id: string) {
    try {
      return await this.productService.FindOne({ id, isPublic: true });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }

  @Get('public')
  async PublicFindAll(@Query() query: QueryProduct) {
    try {
      return await this.productService.FindAll({ query, isPublic: true });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Post()
  async Create(@Body() body: CreateProductDto) {
    try {
      const data = await this.productService.Create(body);
      return { message: 'successfully create product', data };
    } catch (error) {
      console.log(error);
      if (error?.code == 'P2002') {
        throw new BadRequestException('name already exist!');
      } else {
        throw new BadRequestException(error?.message || 'Bad Request');
      }
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Get()
  async FindAll(@Query() query: QueryProduct) {
    try {
      return await this.productService.FindAll({ query, isPublic: false });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Put(':id')
  async Update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    try {
      const data = await this.productService.Update({ id, body });
      return { message: 'successfully update product', data };
    } catch (error) {
      console.log(error);
      if (error?.code == 'P2002') {
        throw new BadRequestException('name already exist!');
      } else {
        throw new BadRequestException(error?.message || 'Bad Request');
      }
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Delete(':id')
  async Remove(@Param('id') id: string) {
    try {
      const data = await this.productService.Remove(id);
      return { message: 'successfully delete product', data };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuardService)
  @Get(':id')
  async FindOne(@Param('id') id: string) {
    try {
      return await this.productService.FindOne({ id, isPublic: false });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }
}
