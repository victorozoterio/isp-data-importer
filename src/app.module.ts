import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { IspModule } from './modules/isp/isp.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HealthModule, IspModule],
})
export class AppModule {}
