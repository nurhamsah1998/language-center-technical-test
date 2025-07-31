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
@UseGuards(AuthGuardService)
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiBearerAuth('access_token')
  @Post()
  async Create(@Body() body: MutationProductCategoryDto) {
    try {
      return await this.productCategoryService.Create(body);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

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

  @ApiBearerAuth('access_token')
  @Put(':id')
  async Update(
    @Param('id') id: string,
    @Body() body: MutationProductCategoryDto,
  ) {
    try {
      return await this.productCategoryService.Update({ id, body });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @ApiBearerAuth('access_token')
  @Delete(':id')
  async Remove(@Param('id') id: string) {
    try {
      return await this.productCategoryService.Remove(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
