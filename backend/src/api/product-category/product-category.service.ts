import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MutationProductCategoryDto } from './product-category.dto';
import { QueryInit } from 'src/utils/queryInit';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async Create(body: MutationProductCategoryDto) {
    return await this.prisma.productCategory.create({
      data: {
        name: body.name,
      },
    });
  }

  async FindAll(query: QueryInit) {
    const totalData = await this.prisma.productCategory.count({
      where: {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
      },
    });
    const data = await this.prisma.productCategory.findMany({
      where: {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
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

  async Update({ id, body }: { body: MutationProductCategoryDto; id: string }) {
    const data = await this.prisma.productCategory.findFirst({
      where: {
        id,
      },
    });
    if (!data) {
      throw {
        message: `cannot update. product category with id ${id} not found`,
      };
    }
    return await this.prisma.productCategory.update({
      where: {
        id,
      },
      data: {
        name: body.name,
      },
    });
  }

  async Remove(id: string) {
    const data = await this.prisma.productCategory.findFirst({
      where: {
        id,
      },
    });
    if (!data) {
      throw {
        message: `cannot delete. product category with id ${id} not found`,
      };
    }
    return await this.prisma.productCategory.delete({
      where: {
        id,
      },
    });
  }
}
