import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProductDto,
  QueryProduct,
  UpdateProductDto,
} from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findProductCategory(categoryId: string) {
    const dataCategory = await this.prisma.productCategory.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (!dataCategory) {
      throw {
        message: `cannot create. product category not found`,
      };
    }
  }

  async Create(body: CreateProductDto) {
    await this.findProductCategory(body.categoryId);
    return await this.prisma.product.create({
      data: {
        name: body.name,
        sellPrice: body.sellPrice,
        stock: body.stock,
        buyPrice: body.buyPrice,
        desc: body.desc,
      },
    });
  }

  async FindAll(query: QueryProduct) {
    const totalData = await this.prisma.product.count({
      where: {
        name: query.search,
      },
    });
    const data = await this.prisma.product.findMany({
      where: {
        name: query.search,
      },
      skip: query.page > 1 ? (query.page - 1) * query.limit : 0,
      take: query.limit,
    });
    const totalPage = Math.ceil(totalData / query.limit);
    return {
      data,
      meta: {
        page: query.page,
        totalPage,
        totalData,
      },
    };
  }

  async FindOne(id: string) {
    const data = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });
    if (!data) {
      throw {
        message: `cannot find product id with ${id}`,
      };
    }
    return data;
  }

  async Update({ id, body }: { id: string; body: UpdateProductDto }) {
    await this.findProductCategory(body.categoryId);
    const dataCategory = await this.prisma.productCategory.findFirst({
      where: {
        id: body.categoryId,
      },
    });
    if (!dataCategory) {
      throw {
        message: `cannot create. product category not found`,
      };
    }
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        sellPrice: body.sellPrice,
        buyPrice: body.buyPrice,
        desc: body.desc,
      },
    });
  }

  async Remove(id: string) {
    const data = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });
    if (!data) {
      throw {
        message: `cannot delete. product with id ${id} not found`,
      };
    }
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
