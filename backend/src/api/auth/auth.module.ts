import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
