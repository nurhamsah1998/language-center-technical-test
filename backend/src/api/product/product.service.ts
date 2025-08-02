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

  async findProductCategory(productCategoryId: string) {
    const dataCategory = await this.prisma.productCategory.findFirst({
      where: {
        id: productCategoryId,
      },
    });
    if (!dataCategory) {
      throw {
        message: `mutation failed. product category not found`,
      };
    }
  }

  async Create(body: CreateProductDto) {
    await this.findProductCategory(body.productCategoryId);
    /// validation sell price must be greater or equal than buy price
    if (body.buyPrice >= body.sellPrice) {
      throw {
        message: `sell price must be greater or equal than buy price`,
      };
    }
    return await this.prisma.product.create({
      data: {
        name: body.name,
        sellPrice: body.sellPrice,
        stock: body.stock,
        buyPrice: body.buyPrice,
        selled: 0,
        desc: body.desc,
        productCategoryId: body.productCategoryId,
      },
    });
  }

  async FindAll({
    query,
    isPublic,
  }: {
    isPublic: boolean;
    query: QueryProduct;
  }) {
    const totalData = await this.prisma.product.count({
      where: {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
        productCategoryId: query.productCategoryId,
      },
    });
    const data = await this.prisma.product.findMany({
      where: {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
        productCategoryId: query.productCategoryId,
      },
      skip: query.page > 1 ? (query.page - 1) * query.limit : 0,
      take: query.limit,
      orderBy: {
        createdAt: query.sortCreatedAt,
      },
      select: {
        id: true,
        name: true,
        productCategory: {
          select: {
            name: true,
            id: true,
          },
        },
        selled: true,
        sellPrice: true,
        ...(!isPublic && {
          buyPrice: true,
        }),
        desc: true,
        createdAt: true,
        stock: true,
      },
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

  async FindOne({ id, isPublic }: { id: string; isPublic: boolean }) {
    const data = await this.prisma.product.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        productCategory: {
          select: {
            name: true,
            id: true,
          },
        },
        selled: true,
        sellPrice: true,
        ...(!isPublic && {
          buyPrice: true,
        }),
        desc: true,
        createdAt: true,
        stock: true,
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
    await this.findProductCategory(body.productCategoryId);
    const dataCategory = await this.prisma.productCategory.findFirst({
      where: {
        id: body.productCategoryId,
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
        productCategoryId: body.productCategoryId,
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
