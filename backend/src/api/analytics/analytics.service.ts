import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async GetRevenue() {
    const rawQuery = await this.prisma.$queryRaw`
    select 
    generate_series(now() - interval '5 minutes', now() + interval '5 minutes', interval '1 minute') 
    as date
    `;
    return rawQuery;
  }
}
