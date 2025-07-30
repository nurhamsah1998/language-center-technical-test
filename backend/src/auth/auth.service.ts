/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async Register({ body }: { body: AuthRegisterDto }) {
    return await this.prisma.user.create({
      data: {
        email: body?.email,
        password: await bcrypt.hash(body.password, 10),
        role: 'Customer',
        profile: {
          create: {
            name: body.name,
            phoneNumber: body.phoneNumber,
          },
        },
      },
    });
  }
}
