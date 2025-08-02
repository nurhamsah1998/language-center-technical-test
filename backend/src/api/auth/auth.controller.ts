/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
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
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async Register(@Body() body: AuthRegisterDto) {
    try {
      await this.authService.Register({ body });
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
  async Login(@Body() body: AuthLoginDto): Promise<User> {
    try {
      const res = await this.authService.Login({ body });
      return res as unknown as User;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid credential');
    }
  }

  @Post('refresh')
  async RefreshToken(@Body() body: AuthRefreshTokenDto) {
    try {
      const newToken = await this.authService.RefreshToken({ body });
      return newToken;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error?.message as any);
    }
  }

  @Post('forgot-password')
  async ForgotPassword(@Body() body: AuthForgotPasswordDto) {
    try {
      const data = await this.authService.ForgotPassword({ body });
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
      await this.authService.ResetPassword({ body, forgotPasswordToken });
      return { message: 'your password is successfully reset' };
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error?.message as any);
    }
  }
}
