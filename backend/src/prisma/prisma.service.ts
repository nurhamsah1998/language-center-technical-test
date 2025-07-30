import { Injectable } from '@nestjs/common';
/// big thanks : https://github.com/prisma/prisma/discussions/19669#discussioncomment-12852313
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    console.info('Prisma connect successfully');
  }
}
