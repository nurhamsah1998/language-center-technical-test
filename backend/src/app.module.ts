import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './api/profile/profile.module';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, GuardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
