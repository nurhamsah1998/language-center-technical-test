/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRefreshTokenDto,
  AuthRegisterDto,
  AuthResetDto,
} from './auth.dto';
import { User } from 'generated/prisma';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  async Register(@Body() body: AuthRegisterDto) {
    try {
      await this.service.Register({ body });
      return { message: 'register successfully!' };
    } catch (error) {
      console.log(error);
      if (error?.code == 'P2002') {
        throw new BadRequestException('email already exist!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Post('login')
  async Login(@Body() body: AuthLoginDto) {
    try {
      return await this.service.Login({ body });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid credential');
    }
  }

  @Post('refresh')
  async RefreshToken(@Body() body: AuthRefreshTokenDto) {
    try {
      const newToken = await this.service.RefreshToken({ body });
      return newToken;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error?.message as any);
    }
  }

  @Post('forgot-password')
  async ForgotPassword(@Body() body: AuthForgotPasswordDto) {
    try {
      const data = await this.service.ForgotPassword({ body });
      return {
        linkResetPassword: `/reset-password/${(data as User)?.forgotPasswordToken}`,
        message:
          'we sending new link to your email to reset your password, check your inbox!',
      };
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error?.message as any);
    }
  }

  @Put('reset-password/:forgotPasswordToken')
  async ResetPassword(
    @Body() body: AuthResetDto,
    @Param('forgotPasswordToken') forgotPasswordToken: string,
  ) {
    try {
      await this.service.ResetPassword({ body, forgotPasswordToken });
      return { message: 'your password is successfully reset' };
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error?.message as any);
    }
  }
}
