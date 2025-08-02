import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async GetRevenue() {
    const rawQuery = await this.prisma.$queryRaw`
    -- generate table dummy sementara
    with order_date 
    as (
        select generate_series(current_date - interval '5 days', current_date + interval '5 days', interval '1 day')::Date 
        as date_gs
      )
    -- join untuk menghitung total revenue berdasarkan table dummy
    select od.date_gs, coalesce(sum(o.revenue)::int,0) as revenue from order_date od left join orders o on o."createdAt"::Date = od.date_gs 
    group by od.date_gs
    `;
    return rawQuery;
  }

  async GetProductCount() {
    const rawQuery = await this.prisma.$queryRaw`
      select count(p.name)::int, pc.name from products p left join "product-categories" pc on p."productCategoryId" = pc.id 
      group by pc.name
    `;
    return rawQuery;
  }
}
