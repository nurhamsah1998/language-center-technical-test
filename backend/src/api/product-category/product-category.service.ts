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
        name: query.search,
      },
    });
    const data = await this.prisma.productCategory.count({
      where: {
        name: query.search,
      },
      skip: query.page >= 0 ? query.page * query.limit : 0,
      take: query.limit,
    });
    const totalPage = Math.floor(totalData / query.limit);
    return {
      data,
      meta: {
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
