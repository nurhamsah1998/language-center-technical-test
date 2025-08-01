import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './api/profile/profile.module';
import { GuardModule } from './guard/guard.module';
import { ProductCategoryModule } from './api/product-category/product-category.module';
import { ProductModule } from './api/product/product.module';
import { OrderModule } from './api/order/order.module';

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, GuardModule, ProductCategoryModule, ProductModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
