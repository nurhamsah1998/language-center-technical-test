import { Injectable } from '@nestjs/common';
import { CreateOrderDto, QueryOrder, UpdateStatusOrderDto } from './order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { UserSession } from '../auth/types';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async Create({ request, body }: { body: CreateOrderDto; request: Request }) {
    const userSession: UserSession = request['user'];
    /// VALIDASI JIKA ADMIN MELAKUKAN ORDER
    if (userSession.role === 'Admin') {
      throw {
        message: `admin cannot make order!`,
      };
    }
    const totalCountOrder = await this.prisma.order.count();
    return await this.prisma.order.create({
      data: {
        customerId: userSession.id as keyof UserSession,
        status: 'Packaging',
        orderCode: `ORDER-${totalCountOrder + 1}-${Math.floor(Math.random() * 2000)}`,
        tracking: ['still in the shop'],
        ProductOnOrder: {
          createMany: {
            data: body.products.map((item) => ({
              productId: item.productId,
              qty: item.qty,
            })),
          },
        },
      },
    });
  }

  async FindAll(query: QueryOrder) {
    const totalData = await this.prisma.order.count({
      where: {
        orderCode: query.search,
      },
    });
    const data = await this.prisma.order.findMany({
      where: {
        orderCode: query.search,
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

  async findOrderById(id: string) {
    const dataOrder = await this.prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        ProductOnOrder: {
          select: {
            productId: true,
            qty: true,
          },
        },
      },
    });
    if (!dataOrder) {
      throw {
        message: `mutation failed. order not found`,
      };
    }
    return dataOrder;
  }
  async FindOne(id: string) {
    return await this.findOrderById(id);
  }

  async UpdateStatus({ id, body }: { id: string; body: UpdateStatusOrderDto }) {
    const dataOrder = await this.findOrderById(id);
    if (dataOrder.status == 'Done') {
      throw {
        message: `Cannot change status after status is Done!`,
      };
    }
    await this.prisma.$transaction(async (ctx) => {
      /// LOGIC PENAMBAHAN TOTAL PENJUALAN DI SETIAP ORDER PRODUCT JIKA STATUS SELESAI / Done
      if (body.status === 'Done') {
        for (let index = 0; index < dataOrder.ProductOnOrder.length; index++) {
          const element = dataOrder.ProductOnOrder[index];
          await ctx.product.update({
            where: {
              id: element.productId,
            },
            data: {
              selled: {
                increment: element.qty,
              },
            },
          });
        }
      }

      await ctx.order.update({
        where: {
          id,
        },
        data: {
          status: body.status,
        },
      });
    });
    return;
  }
}
