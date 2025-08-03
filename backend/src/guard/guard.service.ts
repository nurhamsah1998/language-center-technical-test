/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserSession } from 'src/api/auth/types';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserSession = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN,
      });
      /// VALIDASI UNTUK PROTEKSI API YANG HANYA BISA DI ACCESS OLEH ROLE ADMIN
      const isNonSharedPermission: boolean =
        (await this.reflector.get('isAdmin', context.getHandler())) ?? true;
      if (payload.role !== 'Admin' && isNonSharedPermission) {
        throw new UnauthorizedException('only Admin can do this!');
      }

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(
        error?.message?.includes('jwt expired')
          ? 'jwt expired'
          : 'Unauthorized',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
