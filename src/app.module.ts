import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { IspModule } from './modules/isp/isp.module';
import { ConfigModule } from '@nestjs/config';
import { OzmapModule } from './modules/ozmap/ozmap.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://root:root@localhost:27017/isp-data-importer?authSource=admin',
    ),
    ScheduleModule.forRoot(),
    HealthModule,
    IspModule,
    OzmapModule,
  ],
})
export class AppModule {}
