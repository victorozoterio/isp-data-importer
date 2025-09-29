import { Module } from '@nestjs/common';
import { IspService } from './isp.service';
import { IspController } from './isp.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('ISP_BASE_URL') || 'http://localhost:4000',
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  ],
  controllers: [IspController],
  providers: [IspService],
})
export class IspModule {}
