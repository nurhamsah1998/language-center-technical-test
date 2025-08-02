import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { MutationProductCategoryDto } from './product-category.dto';
import { QueryInit } from 'src/utils/queryInit';
import { AuthGuardService } from 'src/guard/guard.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get('/public')
  async PublicFindAll(@Query() query: QueryInit) {
    try {
      return await this.productCategoryService.FindAll(query);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @UseGuards(AuthGuardService)
  @ApiBearerAuth('access_token')
  @Post()
  async Create(@Body() body: MutationProductCategoryDto) {
    try {
      const data = await this.productCategoryService.Create(body);
      return { message: 'successfully create product category', data };
    } catch (error: any) {
      console.log(error);
      if (error?.code == 'P2002') {
        throw new BadRequestException('name already exist!');
      } else {
        throw new BadRequestException();
      }
    }
  }

  @UseGuards(AuthGuardService)
  @ApiBearerAuth('access_token')
  @Get()
  async FindAll(@Query() query: QueryInit) {
    try {
      return await this.productCategoryService.FindAll(query);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @UseGuards(AuthGuardService)
  @ApiBearerAuth('access_token')
  @Put(':id')
  async Update(
    @Param('id') id: string,
    @Body() body: MutationProductCategoryDto,
  ) {
    try {
      const data = await this.productCategoryService.Update({ id, body });
      return { message: 'successfully update product category', data };
    } catch (error) {
      console.log(error);
      if (error?.code == 'P2002') {
        throw new BadRequestException('name already exist!');
      } else {
        throw new BadRequestException();
      }
    }
  }

  @UseGuards(AuthGuardService)
  @ApiBearerAuth('access_token')
  @Delete(':id')
  async Remove(@Param('id') id: string) {
    try {
      const data = await this.productCategoryService.Remove(id);
      return { message: 'successfully delete product category', data };
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
