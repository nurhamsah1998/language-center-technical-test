import { Global, Module } from '@nestjs/common';
import { AuthGuardService } from './guard.service';

@Global()
@Module({
  providers: [AuthGuardService],
  exports: [AuthGuardService],
})
export class GuardModule {}
