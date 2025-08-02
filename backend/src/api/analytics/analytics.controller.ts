import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuardService } from 'src/guard/guard.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('analytics')
@UseGuards(AuthGuardService)
@ApiBearerAuth('access_token')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue')
  async GetRevenue() {
    try {
      return await this.analyticsService.GetRevenue();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad request');
    }
  }

  @Get('product-count')
  async GetProductCount() {
    try {
      return await this.analyticsService.GetProductCount();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad request');
    }
  }
}
